const express = require("express");
const router = express.Router();
const validatorInput = require('../utils/validator');
const { formatDate } = require('../utils/date');
const moment = require('moment');
const { checkAuth } = require('../middleware/auth');
const userService = require('../services/userService');
const userCollectService = require('../services/userCollectService');
const userFollowService = require('../services/userFollowService');
const userScoreService = require('../services/userScoreService');
const commentService = require('../services/commentService');
const chapterService = require('../services/chapterService');
const tagService = require('../services/tagService');
const novelService = require('../services/novelService');
const userRolesService = require('../services/userRolesService');

/**
 * 获取当前登录用户的个人信息
 * @route GET /user
 * @returns {object} 用户信息
 */
router.get('/user', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const userData = await userService.getUserById(userId);

        if (!userData) {
            return res.status(404).send({
                status: 404,
                msg: '用户不存在'
            });
        }

        // 格式化生日
        if (userData.birthday) {
            userData.birthday = moment(userData.birthday).format('YYYY-MM-DD');
        }

        // 获取角色和权限
        const roles = await userRolesService.getUserRoles(userId);
        const permissions = await userRolesService.getUserPermissions(userId);
        userData.roles = roles || [];
        userData.permissions = permissions || [];

        res.send({
            status: 200,
            msg: '获取成功',
            result: userData
        });
    } catch (error) {
        console.error('获取用户信息失败:', error);
        res.status(500).send({ status: 500, msg: '服务器错误' });
    }
});

/**
 * 获取用户的关注列表和粉丝列表
 * @route GET /follow
 * @returns {object} 关注/粉丝列表及数量
 */
router.get('/follow', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;

        const [following, followers] = await Promise.all([
            userFollowService.getFollowingList(userId),
            userFollowService.getFollowersList(userId)
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

        res.json({
            status: 200,
            msg: '获取成功',
            data: {
                following: followingList,
                followers: followersList,
                followingCount: followingList.length,
                followersCount: followersList.length
            }
        });
    } catch (error) {
        console.error('获取关注/粉丝失败:', error);
        res.status(500).json({ status: 500, msg: '服务器内部错误' });
    }
});

/**
 * 关注或取消关注用户（切换操作）
 * @route POST /follows
 * @param {number} followee_id - 被关注者ID
 */
router.post('/follows', checkAuth, async (req, res) => {
    try {
        const { followee_id } = req.body;
        const follower_id = req.user.id;

        if (!followee_id) {
            return res.status(400).send({ msg: '缺少 followee_id 参数', status: 400 });
        }
        if (follower_id === followee_id) {
            return res.status(400).send({ msg: '不能关注自己', status: 400, self: true });
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

/**
 * 获取关注状态
 * @route GET /checkFollowStatus
 * @param {number} followee_id - 被关注者ID
 */
router.get('/checkFollowStatus', checkAuth, async (req, res) => {
    try {
        const { followee_id } = req.query;
        const follower_id = req.user.id;

        if (!followee_id) {
            return res.status(400).send({ msg: '缺少 followee_id 参数', status: 400 });
        }

        const isFollowing = await userFollowService.getFollowStatus(
            follower_id,
            Number(followee_id)
        );
        res.send({ isFollowing, status: 200 });
    } catch (error) {
        console.error('/follows/status error:', error);
        if (error.message === '用户不存在') {
            return res.status(404).send({ msg: error.message, status: 404 });
        }
        res.status(500).send({ msg: error.message || '服务器内部错误', status: 500 });
    }
});

/**
 * 获取用户的点赞信息（总点赞数和带点赞数的评论列表）
 * @route GET /like
 */
router.get('/like', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;

        const [comments, totalLikes] = await Promise.all([
            commentService.getUserCommentsWithLikes(userId),
            commentService.getUserTotalLikes(userId)
        ]);

        res.send({
            status: 200,
            msg: '获取成功',
            data: { totalLikes, comments }
        });
    } catch (error) {
        console.error('获取点赞信息失败:', error);
        res.status(500).send({ status: 500, msg: error.message || '服务器内部错误' });
    }
});

/**
 * 获取用户的评论总数
 * @route GET /commentsCount
 */
router.get('/commentsCount', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const totalComments = await commentService.getUserCommentCount(userId);

        res.send({
            status: 200,
            msg: '获取成功',
            result: { total_comments: totalComments }
        });
    } catch (error) {
        console.error('获取评论总数失败:', error);
        res.status(500).send({ status: 500, msg: error.message || '服务器内部错误' });
    }
});

/**
 * 获取用户的所有评论（包含点赞数、回复数、所属小说等）
 * @route GET /comments
 */
router.get('/comments', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;

        const userNick = await userService.getUserNickById(userId);
        const basicComments = await commentService.getUserCommentsBasic(userId);
        if (basicComments.length === 0) {
            return res.send({ status: 200, msg: '获取用户评论成功', result: [] });
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
            userId: userId,
            novelId: item.novel_id,
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

        res.send({ status: 200, msg: '获取用户评论成功', result: formattedResults });
    } catch (error) {
        console.error('获取用户评论失败:', error);
        res.status(500).send({ status: 500, msg: error.message || '服务器内部错误' });
    }
});

/**
 * 获取指定父评论下的所有子评论（回复）（公开接口）
 * @route GET /childComments
 * @param {number} parentId - 父评论ID
 */
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

        res.json({ status: 200, msg: '获取评论回复成功', result: formattedComments });
    } catch (error) {
        console.error('获取评论回复失败:', error);
        res.status(500).json({ status: 500, msg: error.message || '服务器内部错误' });
    }
});

/**
 * 获取用户收藏的小说总数和小说名称列表
 * @route GET /collectCount
 */
router.get('/collectCount', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const titles = (await userCollectService.getUserCollectNovels(userId)).map(item => item.title);

        res.send({
            status: 200,
            msg: '获取成功',
            result: {
                total_collects: titles.length,
                novel_titles: titles
            }
        });
    } catch (error) {
        console.error('获取收藏列表失败:', error);
        res.status(500).send({ status: 500, msg: error.message || '服务器内部错误' });
    }
});

/**
 * 获取用户收藏的小说详细信息（卡片格式）
 * @route GET /collect
 */
router.get('/collect', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const novelData = await userCollectService.getUserCollectNovels(userId);

        const data = await Promise.all(novelData.map(async (novel) => {
            let hotDisplay = novel.hot;
            if (novel.hot >= 10000) {
                hotDisplay = (novel.hot / 10000).toFixed(1) + '万';
            }

            const [chapterCount, avgRating, tags, userNick] = await Promise.all([
                chapterService.getChapterCountByNovelId(novel.id),
                userScoreService.getAverageScoreByNovelId(novel.id),
                tagService.getNovelTags(novel.id).then(rows => rows.map(t => t.name)),
                userService.getUserNickById(novel.user_id)
            ]);

            const avgRatingDisplay = avgRating ? Number(avgRating).toFixed(1) : '0.0';

            return {
                id: novel.id,
                cover: novel.cover,
                title: novel.title,
                author: userNick,
                stats: [
                    `🔥 ${hotDisplay}`,
                    `📖 ${chapterCount}章`,
                    `⭐ ${avgRatingDisplay}评分`
                ],
                tag: tags,
                desc: novel.description
            };
        }));

        res.send({ status: 200, msg: '获取用户收藏小说成功', result: data });
    } catch (error) {
        console.error('获取收藏列表失败:', error);
        res.status(500).send({ status: 500, msg: error.message || '服务器内部错误' });
    }
});

/**
 * 获取用户创作的作品总数和作品名列表
 * @route GET /worksCount
 */
router.get('/worksCount', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const titles = (await novelService.getNovelsListByUserId(userId)).map(item => item.title);

        res.send({
            status: 200,
            msg: '获取用户作品成功',
            result: {
                count: titles.length,
                works: titles
            }
        });
    } catch (error) {
        console.error('获取用户作品失败:', error);
        res.status(500).send({ status: 500, msg: error.message || '服务器内部错误' });
    }
});

/**
 * 获取用户创作的作品详细信息
 * @route GET /works
 */
router.get('/works', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const novelData = await novelService.getNovelsListByUserId(userId);
        const userNick = await userService.getUserNickById(userId);

        const data = await Promise.all(novelData.map(async (novel) => {
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
                author: userNick,
                stats: [
                    `🔥 ${hotDisplay}`,
                    `📖 ${chapterCount}章`,
                    `⭐ ${avgRatingDisplay}评分`
                ],
                tag: tags,
                desc: novel.description
            };
        }));

        res.send({ status: 200, msg: '获取用户作品成功', result: data });
    } catch (error) {
        console.error('获取用户作品失败:', error);
        res.status(500).send({ status: 500, msg: error.message || '服务器内部错误' });
    }
});

/**
 * 修改个人信息（部分更新）
 * @route PATCH /changePersonalInfo
 */
router.patch('/changePersonalInfo', checkAuth, async (req, res) => {
    try {
        const { nick, phone, email, gender, birthday, desc } = req.body;
        const userId = req.user.id;

        // 数据验证
        const valid = validatorInput({ nick, phone, email });
        if (valid.isValid) {
            return res.status(400).send({ msg: '数据验证失败', errors: valid.errors, status: 400 });
        }

        const updateFields = { nick, phone, email, gender, birthday, desc };
        const success = await userService.updateUserInfo(userId, updateFields);

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

/**
 * 添加或取消收藏（切换操作）
 * @route POST /addToShelf
 * @param {number} novelId - 小说ID
 */
router.post('/addToShelf', checkAuth, async (req, res) => {
    try {
        const { novelId } = req.body;
        const userId = req.user.id;

        if (!novelId) {
            return res.status(400).send({ msg: '缺少 novelId 参数', status: 400 });
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

/**
 * 检查当前用户是否收藏了指定小说
 * @route GET /checkCollected
 * @param {number} novelId - 小说ID
 */
router.get('/checkCollected', checkAuth, async (req, res) => {
    try {
        const { novelId } = req.query;
        if (!novelId) {
            return res.status(400).send({ status: 400, msg: '缺少 novelId 参数' });
        }

        const userId = req.user.id;
        const isCollected = await userCollectService.isCollected(userId, novelId);

        res.json({
            status: 200,
            collected: isCollected,
            msg: isCollected ? '已收藏' : '未收藏'
        });
    } catch (error) {
        console.error('/checkCollected error:', error);
        if (error.message.includes('不存在')) {
            return res.status(404).send({ msg: error.message, status: 404 });
        }
        res.status(500).send({ msg: error.message || '服务器内部错误', status: 500 });
    }
});

/**
 * 添加评分
 * @route POST /addScore
 * @param {number} novelId - 小说ID
 * @param {number} score - 评分（1-5整数）
 */
router.post('/addScore', checkAuth, async (req, res) => {
    const { novelId, score } = req.body;
    const userId = req.user.id;

    if (!novelId || score === undefined) {
        return res.send({ msg: '缺少必要参数：novelId, score', status: 400 });
    }

    if (!Number.isInteger(score) || score < 1 || score > 5) {
        return res.send({ msg: '评分必须为1-5之间的整数', status: 400 });
    }

    try {
        const scoreId = await userScoreService.insertUserScore({ userId, novelId, score });
        res.send({ msg: '添加评分成功', status: 200, data: { scoreId } });
    } catch (error) {
        console.error('添加评分异常：', error);
        if (error.message.includes('foreign key constraint') || error.message.includes('a foreign key constraint')) {
            return res.send({ msg: '用户或小说不存在', status: 400 });
        }
        res.send({ msg: '服务器内部错误', status: 500 });
    }
});

/**
 * 获取用户评分
 * @route GET /getUserScore
 * @param {number} novelId - 小说ID
 */
router.get('/getUserScore', checkAuth, async (req, res) => {
    let { novelId } = req.query;
    const userId = req.user.id;

    if (!novelId) {
        return res.send({ msg: '缺少 novelId 参数', status: 400 });
    }

    novelId = parseInt(novelId, 10);
    if (isNaN(novelId) || novelId <= 0) {
        return res.send({ msg: 'novelId 必须为正整数', status: 400 });
    }

    try {
        const scoreRecord = await userScoreService.getUserScoreByUserIdAndNovelId(userId, novelId);
        if (!scoreRecord) {
            return res.send({ msg: '未找到该用户对此小说的评分', status: 200, data: null });
        }
        res.send({ msg: '获取评分成功', status: 200, data: scoreRecord });
    } catch (error) {
        console.error('获取评分异常：', error);
        res.send({ msg: '服务器内部错误', status: 500 });
    }
});

/**
 * 修改评分
 * @route PUT /updateScore
 * @param {number} novelId - 小说ID
 * @param {number} score - 新评分（1-5整数）
 */
router.put('/updateScore', checkAuth, async (req, res) => {
    const { novelId, score } = req.body;
    const userId = req.user.id;

    if (!novelId || score === undefined) {
        return res.send({ msg: '缺少必要参数：novelId, score', status: 400 });
    }

    if (!Number.isInteger(score) || score < 1 || score > 5) {
        return res.send({ msg: '评分必须为1-5之间的整数', status: 400 });
    }

    try {
        const affectedRows = await userScoreService.updateUserScore({ userId, novelId, score });
        if (affectedRows === 0) {
            return res.send({ msg: '未找到该用户对此小说的评分记录，无法更新', status: 404 });
        }
        res.send({ msg: '修改评分成功', status: 200, data: { userId, novelId, score } });
    } catch (error) {
        console.error('修改评分异常：', error);
        res.send({ msg: '服务器内部错误', status: 500 });
    }
});

/**
 * 切换评论点赞状态（强制使用当前登录用户）
 * @route PUT /toggleLike
 * @param {number} commentId - 评论ID
 */
router.put('/toggleLike', checkAuth, async (req, res) => {
    const { commentId } = req.body;
    const userId = req.user.id;

    if (!commentId) {
        return res.send({ msg: '缺少 commentId 参数', status: 400 });
    }

    if (typeof commentId !== 'number' || commentId <= 0) {
        return res.send({ msg: 'commentId 必须为正整数', status: 400 });
    }

    try {
        const { liked, count } = await commentService.toggleLike(userId, commentId);
        res.send({
            msg: liked ? '点赞成功' : '取消点赞成功',
            status: 200,
            data: { userId, commentId, liked, count }
        });
    } catch (error) {
        console.error('切换点赞异常：', error);
        if (error.message.includes('userId and commentId are required')) {
            return res.send({ msg: '参数错误', status: 400 });
        }
        res.send({ msg: '服务器内部错误', status: 500 });
    }
});

module.exports = router;