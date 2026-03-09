const express = require("express")
const router = express.Router()
const validatorInput = require('../utils/validator')
const { formatDate } = require('../utils/date')
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

/**
 * 获取用户个人信息（个人主页）
 * @route GET /user
 * @param {string} req.cookies.token - 用户令牌
 * @returns {object} 返回用户信息，包含 id, phone, email, nick, avatar, gender, birthday, desc, created_at, updated_at 等，其中 birthday 格式为 YYYY-MM-DD
 */
router.get('/user', async (req, res) => {
    const token = req.cookies.token;
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

/**
 * 获取用户的关注列表和粉丝列表
 * @route GET /follow
 * @param {string} req.cookies.token - 用户令牌
 * @returns {object} 返回 { following: 关注列表, followers: 粉丝列表, followingCount: 关注数, followersCount: 粉丝数 }，每个列表项包含 id, phone, email, nick, follow_time
 */
router.get('/follow', async (req, res) => {
    try {
        const token = req.cookies.token;

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
                following: followingList, // 关注
                followers: followersList, // 粉丝
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

/**
 * 关注或取消关注用户（切换操作）
 * @route POST /follows
 * @param {number} req.body.followee_id - 被关注者ID
 * @returns {object} 操作成功，返回 { msg: '关注成功' 或 '取消关注成功', status: 200 }
 */
router.post('/follows', async (req, res) => {
    try {
        const { followee_id } = req.body;
        const token = req.cookies.token;
        const { uid: follower_id } = decodeToken(token);

        if (!follower_id || !followee_id) {
            return res.status(400).send({ msg: '缺少必要参数', status: 400 });
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
 * @param {number} req.query.followee_id - 被关注者ID
 * @returns {object} { isFollowing: boolean, status: 200 }
 */
router.get('/checkFollowStatus', async (req, res) => {
    try {
        const { followee_id } = req.query;
        const token = req.cookies.token;
        const { uid: follower_id } = decodeToken(token);

        if (!follower_id || !followee_id) {
            return res.status(400).send({ msg: '缺少必要参数', status: 400 });
        }

        const isFollowing = await userFollowService.getFollowStatus(
            Number(follower_id),
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
 * @param {string} req.cookies.token - 用户令牌
 * @returns {object} 返回 { totalLikes: 总获赞数, comments: 评论列表（每个评论包含 id, content, like_count 等） }
 */
router.get('/like', async (req, res) => {
    try {
        const token = req.cookies.token;
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

/**
 * 获取用户的评论总数
 * @route GET /commentsCount
 * @param {string} req.cookies.token - 用户令牌
 * @returns {object} 返回 { total_comments: 评论总数 }
 */
router.get('/commentsCount', async (req, res) => {
    try {
        const token = req.cookies.token;
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

/**
 * 获取用户的所有评论（包含点赞数、回复数、所属小说等）
 * @route GET /comments
 * @param {string} req.cookies.token - 用户令牌
 * @returns {object} 返回评论数组，每条评论包含 id, userId, novelId, nickname, content, novel（小说标题）, time（格式化时间）, stats（[点赞数, 回复数]）, parentAuthor（父评论作者，若有）
 */
router.get('/comments', async (req, res) => {
    try {
        const token = req.cookies.token;
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
            userId: uid,
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

/**
 * 获取指定父评论下的所有子评论（回复）
 * @route GET /childComments
 * @param {number} req.query.parentId - 父评论ID
 * @returns {object} 返回回复数组，每条包含 id, nickname, content, time（格式化时间）, parentAuthor（父评论作者）
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

/**
 * 获取用户收藏的小说总数和小说名称列表
 * @route GET /collectCount
 * @param {string} req.cookies.token - 用户令牌
 * @returns {object} 返回 { total_collects: 收藏数, novel_titles: 小说名称数组 }
 */
router.get('/collectCount', async (req, res) => {
    try {
        const token = req.cookies.token;
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

/**
 * 获取用户收藏的小说详细信息（卡片格式）
 * @route GET /collect
 * @param {string} req.cookies.token - 用户令牌
 * @returns {object} 返回收藏小说数组，每项包含 id, cover, title, author, stats（[热度, 章节数, 评分]）, tag, desc
 */
router.get('/collect', async (req, res) => {
    try {
        const token = req.cookies.token;
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

/**
 * 获取用户创作的作品总数和作品名列表
 * @route GET /worksCount
 * @param {string} req.cookies.token - 用户令牌
 * @returns {object} 返回 { count: 作品数, works: 作品名数组 }
 */
router.get('/worksCount', async (req, res) => {
    try {
        const token = req.cookies.token;
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

/**
 * 获取用户创作的作品详细信息
 * @route GET /works
 * @param {string} req.cookies.token - 用户令牌
 * @returns {object} 返回作品数组，每项包含 id, cover, title, author, stats（[热度, 章节数, 评分]）, tag, desc
 */
router.get('/works', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).send({ status: 400, msg: '请提供 token' });
        }

        const { uid } = decodeToken(token);

        const novelData = await novelService.getNovelsListByUserId(uid);
        const userNick = await userService.getUserNickById(uid);
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

/**
 * 修改个人信息（部分更新）
 * @route PATCH /changePersonalInfo
 * @param {string} req.headers.authorization - 用户令牌
 * @param {string} [req.body.nick] - 昵称（可选）
 * @param {string} [req.body.phone] - 手机号（可选）
 * @param {string} [req.body.email] - 邮箱（可选）
 * @param {string} [req.body.gender] - 性别（可选）
 * @param {string} [req.body.birthday] - 生日（可选，格式 YYYY-MM-DD）
 * @param {string} [req.body.desc] - 个人简介（可选）
 * @returns {object} 修改成功
 */
router.patch('/changePersonalInfo', async (req, res) => {
    try {
        const { nick, phone, email, gender, birthday, desc } = req.body;
        const token = req.cookies.token;
        if (!token) return res.status(400).send({ status: 400, msg: '请提供 token' });

        const { uid } = decodeToken(token);

        // 数据验证
        const valid = validatorInput({ nick, phone, email });
        if (valid.isValid) {
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

/**
 * 添加或取消收藏（切换操作）
 * @route POST /addToShelf
 * @param {number} req.body.novelId - 小说ID
 * @returns {object} 操作成功，返回 { msg: '收藏成功' 或 '取消收藏成功', status: 200 }
 */
router.post('/addToShelf', async (req, res) => {
    try {
        const { novelId } = req.body;
        const token = req.cookies.token;
        const { uid: userId } = decodeToken(token);

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

/**
 * 检查当前用户是否收藏了指定小说
 * @route GET /checkCollected
 * @param {string} req.headers.authorization - 用户令牌
 * @param {number} req.query.novelId - 小说ID
 * @returns {object} 返回 { collected: true/false, msg: '已收藏'/'未收藏' }
 */
router.get('/checkCollected', async (req, res) => {
    try {
        const { novelId } = req.query;

        if (!novelId) {
            return res.status(400).send({ status: 400, msg: '缺少 novelId 参数' });
        }

        const token = req.cookies.token;
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

/**
 * 添加评分
 * @route POST /addScore
 * @param {number} req.body.novelId - 小说ID
 * @param {number} req.body.score - 评分（1-5整数）
 */
router.post('/addScore', async (req, res) => {
    const { novelId, score } = req.body;
    const token = req.cookies.token;
    const { uid: userId } = decodeToken(token);

    // 基础参数校验
    if (userId === undefined || novelId === undefined || score === undefined) {
        return res.send({
            msg: '缺少必要参数：userId, novelId, score',
            status: 400
        });
    }

    // 验证评分范围（假设1-5分）
    if (!Number.isInteger(score) || score < 1 || score > 5) {
        return res.send({
            msg: '评分必须为1-5之间的整数',
            status: 400
        });
    }

    try {
        const scoreId = await userScoreService.insertUserScore({
            userId,
            novelId,
            score
        });

        res.send({
            msg: '添加评分成功',
            status: 200,
            data: {
                scoreId
            }
        });
    } catch (error) {
        console.error('添加评分异常：', error);

        // 根据错误信息判断外键约束失败
        if (error.message.includes('foreign key constraint fails') ||
            error.message.includes('a foreign key constraint')) {
            return res.send({
                msg: '用户或小说不存在',
                status: 400
            });
        }

        // 其他数据库错误（可扩展）
        res.send({
            msg: '服务器内部错误',
            status: 500
        });
    }
});

/**
 * 获取用户评分
 * @route GET /getUserScore
 * @param {number} req.query.novelId - 小说ID
 */
router.get('/getUserScore', async (req, res) => {
    let { novelId } = req.query;
    const token = req.cookies.token;
    let { uid: userId } = decodeToken(token);

    // 参数存在性校验
    if (userId === undefined || novelId === undefined) {
        return res.send({
            msg: '缺少必要参数：userId, novelId',
            status: 400
        });
    }

    // 转换为数字并校验有效性
    userId = parseInt(userId, 10);
    novelId = parseInt(novelId, 10);
    if (isNaN(userId) || isNaN(novelId) || userId <= 0 || novelId <= 0) {
        return res.send({
            msg: 'userId 和 novelId 必须为正整数',
            status: 400
        });
    }

    try {
        const scoreRecord = await userScoreService.getUserScoreByUserIdAndNovelId(userId, novelId);

        if (!scoreRecord) {
            return res.send({
                msg: '未找到该用户对此小说的评分',
                status: 200,
                data: null
            });
        }

        res.send({
            msg: '获取评分成功',
            status: 200,
            data: scoreRecord
        });
    } catch (error) {
        console.error('获取评分异常：', error);
        res.send({
            msg: '服务器内部错误',
            status: 500
        });
    }
});

/**
 * 修改评分
 * @route PUT /updateScore
 * @param {number} req.body.novelId - 小说ID
 * @param {number} req.body.score - 新评分（1-5整数）
 */
router.put('/updateScore', async (req, res) => {
    const { novelId, score } = req.body;
    const token = req.cookies.token;
    const { uid: userId } = decodeToken(token);

    // 基础参数校验
    if (userId === undefined || novelId === undefined || score === undefined) {
        return res.send({
            msg: '缺少必要参数：userId, novelId, score',
            status: 400
        });
    }

    // 验证评分范围（1-5分）
    if (!Number.isInteger(score) || score < 1 || score > 5) {
        return res.send({
            msg: '评分必须为1-5之间的整数',
            status: 400
        });
    }

    try {
        const affectedRows = await userScoreService.updateUserScore({
            userId,
            novelId,
            score
        });

        if (affectedRows === 0) {
            return res.send({
                msg: '未找到该用户对此小说的评分记录，无法更新',
                status: 404
            });
        }

        res.send({
            msg: '修改评分成功',
            status: 200,
            data: {
                userId,
                novelId,
                score
            }
        });
    } catch (error) {
        console.error('修改评分异常：', error);
        res.send({
            msg: '服务器内部错误',
            status: 500
        });
    }
});

/**
 * 切换评论点赞状态
 * @route PUT /toggleLike
 * @param {number} req.body.userId - 用户ID
 * @param {number} req.body.commentId - 评论ID
 */
router.put('/toggleLike', async (req, res) => {
    const { userId, commentId } = req.body;

    // 基础参数校验
    if (userId === undefined || commentId === undefined) {
        return res.send({
            msg: '缺少必要参数：userId, commentId',
            status: 400
        });
    }

    // 验证参数为有效数字
    if (typeof userId !== 'number' || typeof commentId !== 'number' || userId <= 0 || commentId <= 0) {
        return res.send({
            msg: 'userId 和 commentId 必须为正整数',
            status: 400
        });
    }

    try {
        // 调用切换点赞的服务函数
        const { liked, count } = await commentService.toggleLike(userId, commentId);

        res.send({
            msg: liked ? '点赞成功' : '取消点赞成功',
            status: 200,
            data: {
                userId,
                commentId,
                liked,
                count
            }
        });
    } catch (error) {
        console.error('切换点赞异常：', error);
        if (error.message.includes('userId and commentId are required')) {
            return res.send({
                msg: '参数错误',
                status: 400
            });
        }

        res.send({
            msg: '服务器内部错误',
            status: 500
        });
    }
});

module.exports = router;