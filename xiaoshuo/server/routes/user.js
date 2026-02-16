const express = require("express")
const router = express.Router()
const validatorInput = require('../../src/utils/validator')
const formatDate = require('../../src/utils/date')
const moment = require('moment')
const { decodeToken } = require("../utils/token")
const userService = require('../services/userService')
const userCollectService = require('../services/userCollectService')
const userFollowService = require('../services/userFollowService')
const userScoreService = require('../services/userScoreService')
const commentService = require('../services/commentService')
const chapterService = require('../services/chapterService')
const tagService = require('../services/tagService')
const novelService = require('../services/novelService')

// 用户信息（个人主页）
router.get('/user', async (req, res) => {
    const { token } = req.query;
    const { uid, phone, email } = decodeToken(token);

    // 判断是否提供查询条件
    if (!phone && !email) {
        return res.status(400).send({
            status: 400,
            msg: '请提供 phone 或 email 作为查询条件'
        });
    }

    const userData = (await userService.getUserByPhoneOrEmail(phone, email)) || [];

    if (userData.length === 0) {
        return res.send({
            status: 404,
            msg: '未找到用户',
            result: []
        });
    }

    if (userData.birthday) {
        userData.birthday = moment(userData.birthday).format('YYYY-MM-DD');
    } else {
        userData.birthday = null;
    }

    res.send({
        status: 200,
        msg: '获取成功',
        result: userData
    });
});

// 关注、粉丝
router.get('/follow', async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ status: 400, msg: '缺少 token 参数' });
        }

        const { uid } = decodeToken(token);

        const [following, followers] = await Promise.all([
            userFollowService.getFollowingList(uid),
            userFollowService.getFollowersList(uid)
        ]);

        const followingList = (following || []).map(item => ({
            id: item.id,
            phone: item.phone,
            email: item.email,
            nick: item.nick,
            follow_time: item.follow_time
        }));

        const followersList = (followers || []).map(item => ({
            id: item.id,
            phone: item.phone,
            email: item.email,
            nick: item.nick,
            follow_time: item.follow_time
        }));

        const followingCount = followingList.length;
        const followersCount = followersList.length;

        res.json({
            status: 200,
            msg: '获取成功',
            data: {
                following: followingList,
                followers: followersList,
                followingCount,
                followersCount
            }
        });
    } catch (error) {
        console.error('获取关注/粉丝失败:', error);

        res.status(500).json({
            status: 500,
            msg: '服务器内部错误，请稍后重试'
        });
    }
});

// 关注、粉丝信息
router.get('/followFan', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).send({ status: 400, msg: '请提供 token' });

        const { uid } = decodeToken(token);
        if (!uid) {
            return res.status(404).send({
                status: 404,
                msg: '未找到用户',
                result: { fans: [], following: [] }
            });
        }

        const [fans, following] = await Promise.all([
            userFollowService.getFollowersCount(uid),
            userFollowService.getFollowersList(uid)
        ]);

        res.send({
            status: 200,
            msg: '获取成功',
            result: { fans, following }
        });
    } catch (error) {
        console.error('/followFan error:', error);
        res.status(500).send({ status: 500, msg: error.message || '服务器内部错误' });
    }
});

// 关注/取消关注
router.post('/follows', async (req, res) => {
    try {
        const { follower_id, followee_id } = req.body;
        if (!follower_id || !followee_id) {
            return res.status(400).send({ msg: '缺少必要参数', status: 400 });
        }
        if (follower_id === followee_id) {
            return res.status(400).send({ msg: '不能关注自己', status: 400 });
        }

        const action = await userFollowService.toggleFollow(follower_id, followee_id);
        const msg = action === 'follow' ? '关注成功' : '取消关注成功';
        res.send({ msg, status: 200 });
    } catch (error) {
        console.error('/follows error:', error);
        if (error.message === '用户不存在') {
            return res.status(404).send({ msg: error.message, status: 404 });
        }
        res.status(500).send({ msg: error.message || '服务器内部错误', status: 500 });
    }
});

// 点赞
router.get('/like', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send({ status: 400, msg: '缺少 token' });
        }

        const { uid } = decodeToken(token);

        const [comments, totalLikes] = await Promise.all([
            commentService.getUserCommentsWithLikes(uid),
            commentService.getUserTotalLikes(uid)
        ]);

        res.send({
            status: 200,
            msg: '获取成功',
            data: {
                totalLikes,
                comments
            }
        });
    } catch (error) {
        console.error('获取点赞信息失败:', error);
        res.status(500).send({
            status: 500,
            msg: error.message || '服务器内部错误'
        });
    }
});

// 用户评论数
router.get('/commentsCount', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send({ status: 400, msg: '请提供 token' });
        }

        const { uid } = decodeToken(token);

        const totalComments = await commentService.getUserCommentCount(uid);

        res.send({
            status: 200,
            msg: '获取成功',
            result: { total_comments: totalComments }
        });
    } catch (error) {
        console.error('获取评论总数失败:', error);
        res.status(500).send({
            status: 500,
            msg: error.message || '服务器内部错误'
        });
    }
});

// 用户评论
router.get('/comments', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send({ status: 400, msg: '请提供 token' });
        }

        const { uid } = decodeToken(token);

        const userNick = await userService.getUserNickById(uid);
        const basicComments = await commentService.getUserCommentsBasic(uid);
        if (basicComments.length === 0) {
            return res.send({
                status: 200,
                msg: '获取用户评论成功',
                result: []
            });
        }

        const commentIds = basicComments.map(c => c.id);
        const novelIds = [...new Set(basicComments.map(c => c.novel_id))];
        const parentIds = basicComments.map(c => c.parent_id).filter(id => id);

        const [likesMap, repliesMap, novelTitleMap, parentAuthorMap] = await Promise.all([
            commentService.getLikesCountMap(commentIds),
            commentService.getRepliesCountMap(commentIds),
            novelService.getNovelTitleMap(novelIds),
            commentService.getParentAuthorsMap(parentIds)
        ]);

        const formattedResults = basicComments.map(item => ({
            id: item.id,
            nickname: userNick || '未知用户',
            content: item.content,
            novel: novelTitleMap.get(item.novel_id) || '未知小说',
            time: formatDate(item.created_at),
            stats: [
                `👍 ${likesMap.get(item.id) || 0}`,
                `💬 ${repliesMap.get(item.id) || 0}`
            ],
            parentAuthor: item.parent_id ? parentAuthorMap.get(item.parent_id) || null : null
        }));

        res.send({
            status: 200,
            msg: '获取用户评论成功',
            result: formattedResults
        });
    } catch (error) {
        console.error('获取用户评论失败:', error);
        res.status(500).send({
            status: 500,
            msg: error.message || '服务器内部错误'
        });
    }
});

// 用户评论的回复
router.get('/childComments', async (req, res) => {
    try {
        let { parentId } = req.query;
        parentId = Number(parentId);
        if (!parentId || isNaN(parentId)) {
            return res.status(400).json({ status: 400, msg: '缺少或无效的 parentId 参数' });
        }

        const replies = await commentService.getCommentReplies(parentId);

        const formattedComments = replies.map(comment => ({
            id: comment.id,
            nickname: comment.nickname,
            content: comment.content,
            time: formatDate(comment.created_at),
            parentAuthor: comment.parentAuthor || null
        }));

        res.json({
            status: 200,
            msg: '获取评论回复成功',
            result: formattedComments,
        });
    } catch (error) {
        console.error('获取评论回复失败:', error);
        res.status(500).json({
            status: 500,
            msg: error.message || '服务器内部错误'
        });
    }
});

// 收藏小说数和小说名称列表
router.get('/collectCount', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send({ status: 400, msg: '请提供 token' });
        }

        const { uid } = decodeToken(token);

        const titles = (await userCollectService.getUserCollectNovels(uid)).map(item => item.title);
        const total = titles.length;

        res.send({
            status: 200,
            msg: '获取成功',
            result: {
                total_collects: total,
                novel_titles: titles
            }
        });
    } catch (error) {
        console.error('获取收藏列表失败:', error);
        res.status(500).send({
            status: 500,
            msg: error.message || '服务器内部错误'
        });
    }
});

// 获取收藏小说信息
router.get('/collect', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send({ status: 400, msg: '请提供 token' });
        }

        const { uid } = decodeToken(token);

        const novelData = await userCollectService.getUserCollectNovels(uid);
        const data = await Promise.all(novelData.map(async (novel, index) => {
            let hotDisplay = novel.hot;
            if (novel.hot >= 10000) {
                hotDisplay = (novel.hot / 10000).toFixed(1) + '万';
            }

            const [chapterCount, avgRating, tags] = await Promise.all([
                chapterService.getChapterCountByNovelId(novel.id),
                userScoreService.getAverageScoreByNovelId(novel.id),
                tagService.getNovelTags(novel.id).then(rows => rows.map(t => t.name))
            ]);

            const avgRatingDisplay = avgRating ? Number(avgRating).toFixed(1) : '0.0';

            return {
                id: novel.id,
                cover: novel.cover,
                title: novel.title,
                author: novel.author,
                stats: [
                    `🔥 ${hotDisplay}`,
                    `📖 ${chapterCount}章`,
                    `⭐ ${avgRatingDisplay}评分`
                ],
                tag: tags,
                desc: novel.description
            };
        }));

        res.send({
            status: 200,
            msg: '获取用户收藏小说成功',
            result: data
        });
    } catch (error) {
        console.error('获取收藏列表失败:', error);
        res.status(500).send({
            status: 500,
            msg: error.message || '服务器内部错误'
        });
    }
});

// 作品数量和作品名
router.get('/worksCount', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send({ status: 400, msg: '请提供 token' });
        }

        const { uid } = decodeToken(token);

        const titles = (await novelService.getNovelsListByUserId(uid)).map(item => item.title);
        const total = titles.length;

        res.send({
            status: 200,
            msg: '获取用户作品成功',
            result: {
                count: total,
                works: titles
            }
        });
    } catch (error) {
        console.error('获取用户作品失败:', error);
        res.status(500).send({
            status: 500,
            msg: error.message || '服务器内部错误'
        });
    }
});

// 作品
router.get('/works', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send({ status: 400, msg: '请提供 token' });
        }

        const { uid } = decodeToken(token);

        const novelData = await novelService.getNovelsListByUserId(uid);
        const data = await Promise.all(novelData.map(async (novel, index) => {
            let hotDisplay = novel.hot;
            if (novel.hot >= 10000) {
                hotDisplay = (novel.hot / 10000).toFixed(1) + '万';
            }

            const [chapterCount, avgRating, tags] = await Promise.all([
                chapterService.getChapterCountByNovelId(novel.id),
                userScoreService.getAverageScoreByNovelId(novel.id),
                tagService.getNovelTags(novel.id).then(rows => rows.map(t => t.name))
            ]);

            const avgRatingDisplay = avgRating ? Number(avgRating).toFixed(1) : '0.0';

            return {
                id: novel.id,
                cover: novel.cover,
                title: novel.title,
                author: novel.author,
                stats: [
                    `🔥 ${hotDisplay}`,
                    `📖 ${chapterCount}章`,
                    `⭐ ${avgRatingDisplay}评分`
                ],
                tag: tags,
                desc: novel.description
            };
        }));

        res.send({
            status: 200,
            msg: '获取用户作品成功',
            result: data
        });
    } catch (error) {
        console.error('获取用户作品失败:', error);
        res.status(500).send({
            status: 500,
            msg: error.message || '服务器内部错误'
        });
    }
});

// 修改个人信息
router.post('/changePersonalInfo', async (req, res) => {
    try {
        const { nick, phone, email, gender, birthday, desc } = req.body;
        const token = req.headers['authorization'];
        if (!token) return res.status(400).send({ status: 400, msg: '请提供 token' });

        const { uid } = decodeToken(token);

        // 数据验证
        const valid = validatorInput({ nick, phone, email });
        if (!valid.isValid) {
            return res.status(400).send({
                msg: '数据验证失败',
                errors: valid.errors,
                status: 400
            });
        }

        const updateFields = { nick, phone, email, gender, birthday, desc };
        const success = await userService.updateUserInfo(uid, updateFields);
        if (success) {
            res.send({ msg: '修改成功', status: 200 });
        } else {
            res.send({ msg: '修改失败（无变化或用户不存在）', status: 400 });
        }
    } catch (error) {
        console.error('/changePersonalInfo error:', error);
        res.status(500).send({ status: 500, msg: error.message || '服务器内部错误' });
    }
});

// 添加书架
router.post('/addToShelf', async (req, res) => {
    try {
        const { userId, novelId } = req.body;
        if (!userId || !novelId) {
            return res.status(400).send({ msg: '缺少必要参数', status: 400 });
        }

        const action = await userCollectService.toggleCollect(userId, novelId);
        const msg = action === 'add' ? '收藏成功' : '取消收藏成功';
        res.send({ msg, status: 200 });
    } catch (error) {
        console.error('/addToShelf error:', error);
        if (error.message.includes('不存在')) {
            return res.status(404).send({ msg: error.message, status: 404 });
        }
        res.status(500).send({ msg: error.message || '服务器内部错误', status: 500 });
    }
});

// 查看小说是否添加书架
router.get('/checkCollected', async (req, res) => {
    try {
        const { novelId } = req.query;

        if (!novelId) {
            return res.status(400).send({ status: 400, msg: '缺少 novelId 参数' });
        }

        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).send({ status: 401, msg: '请提供 token' });
        }

        const { uid } = decodeToken(token);

        const isCollected = await userCollectService.isCollected(uid, novelId);

        return res.status(200).json({
            status: 200,
            collected: isCollected,
            msg: isCollected ? '已收藏' : '未收藏'
        });

    } catch (error) {
        console.error(error);

        if (error.message && error.message.includes('不存在')) {
            return res.status(404).send({ msg: error.message, status: 404 });
        }
        if (error.message && error.message.includes('token')) {
            return res.status(401).send({ msg: '无效的 token', status: 401 });
        }
        res.status(500).send({ msg: error.message || '服务器内部错误', status: 500 });
    }
});

module.exports = router;