const express = require("express")
const router = express.Router()
const userService = require('../services/userService')
const chapterService = require('../services/chapterService')
const novelService = require('../services/novelService')
const tagService = require('../services/tagService')
const userScoreService = require('../services/userScoreService')
const commentService = require('../services/commentService')
const userCollectService = require('../services/userCollectService')
const query = require('../config').query;
const formatDate = require('../../src/utils/date')

// 获取小说章节内容
router.get('/getNovelContent', async (req, res) => {
    const { novelId, chapterNumber } = req.query;

    if (!novelId || isNaN(novelId)) {
        return res.status(400).send({
            status: 400,
            msg: '小说ID必须是数字'
        });
    }
    if (!chapterNumber || isNaN(chapterNumber)) {
        return res.status(400).send({
            status: 400,
            msg: '章节ID必须是数字'
        });
    }

    try {
        const chapter = await chapterService.getChapterByIdAndNumber(novelId, chapterNumber);
        if (!chapter) {
            return res.status(404).send({
                status: 404,
                msg: '章节不存在',
                data: null
            });
        }

        res.status(200).send({
            status: 200,
            msg: '获取章节内容成功',
            data: {
                id: chapter.id,
                chapterNumber: chapter.chapter_number,
                title: chapter.title,
                content: chapter.content,
                wordCount: chapter.word_count,
                createdAt: chapter.created_at,
                updatedAt: chapter.updated_at
            }
        });
    } catch (error) {
        console.error('获取章节内容失败:', error);
        res.status(500).send({
            status: 500,
            msg: '服务器错误',
            data: null
        });
    }
});

// 获取小说目录数据
router.get('/getNovelDetail', async (req, res) => {
    const { id: novelId, userId } = req.query;

    if (!novelId || isNaN(novelId)) {
        return res.status(400).send({
            status: 400,
            msg: '小说ID必须是数字'
        });
    }

    const hasValidUserId = userId && !isNaN(userId) && parseInt(userId) > 0;

    try {
        // 获取小说基本信息
        const novel = await novelService.getNovelById(novelId);
        if (!novel) {
            return res.status(404).send({
                status: 404,
                msg: '小说不存在',
                data: null
            });
        }

        // 并行获取所有附加数据
        const [
            tags,
            chapterCount,
            lastUpdate,
            avgRating,
            commentCount,
            isCollected
        ] = await Promise.all([
            // 标签列表
            tagService.getNovelTags(novelId),
            // 章节总数
            chapterService.getChapterCountByNovelId(novelId),
            // 最新更新时间
            chapterService.getLastUpdateByNovelId(novelId),
            // 平均得分
            userScoreService.getAverageScoreByNovelId(novelId),
            // 评论总数
            commentService.getCommentCountByNovelId(novelId),
            // 用户收藏状态
            hasValidUserId
                ? userCollectService.isCollected(userId, novelId)
                : Promise.resolve(false)
        ]);

        // 字数格式化
        let wordCountFormatted = "0";
        if (novel.word_count > 0) {
            if (novel.word_count >= 10000) {
                wordCountFormatted = (novel.word_count / 10000).toFixed(1) + "万字";
            } else {
                wordCountFormatted = novel.word_count + "字";
            }
        }
        // 热度格式化
        let hotFormatted = "0";
        if (novel.hot) {
            if (novel.hot >= 10000) {
                hotFormatted = (novel.hot / 10000).toFixed(1) + "万";
            } else {
                hotFormatted = novel.hot.toString();
            }
        }
        // 日期格式化函数
        const safeFormatDate = (dateInput) => {
            if (!dateInput) return null;
            const date = new Date(dateInput);
            return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
        };
        // 最后更新时间
        const lastUpdateFormatted = safeFormatDate(lastUpdate) ||
            safeFormatDate(novel.updated_at) ||
            '';
        // 平均评分
        let avgRatingFormatted = 0;
        if (avgRating) {
            avgRatingFormatted = parseFloat(avgRating);
            if (isNaN(avgRatingFormatted)) avgRatingFormatted = 0;
        }

        const novelData = {
            id: novel.id,
            title: novel.title,
            author: novel.author,
            cover: novel.cover || '',
            tags: tags,
            stats: {
                wordCount: wordCountFormatted,
                chapterCount: chapterCount.toLocaleString(),
                updateTime: lastUpdateFormatted,
                hot: hotFormatted,
                rating: parseFloat(avgRatingFormatted.toFixed(1)),
                totalRecommends: commentCount.toLocaleString()
            },
            description: novel.description || '',
            is_collected: isCollected
        };

        res.status(200).send({
            status: 200,
            msg: '获取小说详情成功',
            data: novelData
        });

    } catch (error) {
        console.error('获取小说详情失败:', error);
        res.status(500).send({
            status: 500,
            msg: '服务器错误',
            data: null
        });
    }
});

// 获取章节数据
router.get('/getChapterList', async (req, res) => {
    const { id: novelId } = req.query;

    if (!novelId || isNaN(novelId)) {
        return res.send({
            status: 400,
            msg: '小说ID必须是数字'
        });
    }

    const chapters = await chapterService.getChaptersById(novelId);

    if (chapters.length === 0) {
        return res.send({
            status: 200,
            msg: '获取章节列表成功',
            data: []
        });
    }

    // 格式化返回数据
    const chapterData = chapters.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        chapter_number: chapter.chapter_number,
        content: chapter.content
    }));

    res.send({
        status: 200,
        msg: '获取章节列表成功',
        data: chapterData
    });

    return;
});

// 小说卡片数据
router.get('/card', async (req, res) => {
    try {
        const novelsArray = await novelService.getAllNovel();

        const data = await Promise.all(novelsArray.map(async (novel) => {
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
                desc: novel.description,
                update: novel.updated_at,
                hot: novel.hot,
                average_score: avgRatingDisplay
            };
        }));

        res.send({
            status: 200,
            msg: '获取成功',
            data
        });
    } catch (error) {
        res.status(500).send({
            status: 500,
            msg: '服务器错误',
            error: error.message
        });
    }
});

// 按名字或作者搜索小说
router.get('/search', async (req, res) => {
    try {
        const searchKey = req.query.searchKey;

        // 无关键词时直接返回空数组
        if (!searchKey || !searchKey.trim()) {
            return res.send({
                status: 200,
                msg: '搜索成功',
                result: []
            });
        }

        const novels = await novelService.searchNovels(searchKey.trim());

        const data = await Promise.all(novels.map(async (novel) => {
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
                desc: novel.description,
                update: novel.updated_at,
                hot: novel.hot,
                average_score: avgRatingDisplay
            };
        }));

        res.send({
            status: 200,
            msg: '搜索成功',
            result: data
        });
    } catch (error) {
        res.status(500).send({
            status: 500,
            msg: '服务器错误',
            error: error.message
        });
    }
});

// tag数组
router.get('/tags', async (req, res) => {
    const tags = await tagService.getAllTags();
    res.send({
        status: 200,
        msg: '获取成功',
        result: tags
    });
});

// 发布小说
router.post('/publishNovel', async (req, res) => {
    const { title, userId, tags, cover, description } = req.body;

    // 参数校验
    if (!title || !userId || !tags || !Array.isArray(tags) || tags.length === 0) {
        return res.send({
            msg: '缺少必要参数',
            status: 400
        });
    }

    try {
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.send({
                msg: '用户不存在',
                status: 404
            });
        }
        const author = user.nick || '佚名';

        // 开始事务
        await query('START TRANSACTION');

        // 插入小说主记录
        const wordCount = 0;
        const hot = 0;
        const insertNovelSql = `
            INSERT INTO novels 
                (title, author, user_id, word_count, hot, description, created_at, updated_at, cover)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)
        `;
        const novelParams = [title, author, userId, wordCount, hot, description, cover];
        const novelResult = await query(insertNovelSql, novelParams);

        if (novelResult.affectedRows === 0) {
            await query('ROLLBACK');
            return res.send({
                msg: '插入主表失败',
                status: 500
            });
        }

        const newNovelId = novelResult.insertId;

        // 批量插入小说
        let tagValues = '';
        const tagParams = [];
        tags.forEach((tagId, index) => {
            tagValues += '(?, ?, NOW())';
            if (index < tags.length - 1) tagValues += ',';
            tagParams.push(newNovelId, tagId);
        });

        const insertTagsSql = `INSERT INTO novel_tags (novel_id, tag_id, created_at) VALUES ${tagValues}`;
        const tagResult = await query(insertTagsSql, tagParams);

        if (tagResult.affectedRows !== tags.length) {
            await query('ROLLBACK');
            return res.send({
                msg: '标签关联失败',
                status: 500
            });
        }

        // 提交事务
        await query('COMMIT');

        // 返回成功响应
        res.send({
            msg: '小说发布成功',
            status: 200,
            data: {
                novelId: newNovelId
            }
        });
    } catch (error) {
        // 发生异常时回滚事务
        await query('ROLLBACK');
        console.error('发布小说异常：', error);
        res.send({
            msg: '服务器内部错误',
            status: 500
        });
    }
});

// 更新小说数据
router.post('/updateNovel', async (req, res) => {
    const { novelId, data } = req.body;

    // 参数校验
    if (!novelId) {
        return res.send({
            msg: '缺少小说ID',
            status: 400
        });
    }

    try {
        await novelService.updateNovel(novelId, data);

        const categories = Array.isArray(data.categories) ? data.categories : [];
        const tags = [data.status, data.channel, ...categories].filter(tag => tag != null);
        await tagService.updateNovelTags(novelId, tags);

        // 成功响应
        res.send({
            msg: '更新小说成功',
            status: 200
        });
    } catch (error) {
        console.error('更新小说异常：', error);
        res.send({
            msg: '服务器内部错误',
            status: 500
        });
    }
});

// 删除章节
router.post('/deleteChapter', async (req, res) => {
    const { chapterId } = req.body;

    if (chapterId === undefined || chapterId === null) {
        return res.send({
            msg: '缺少章节ID',
            status: 400
        });
    }

    try {
        await chapterService.deleteChapter(chapterId);

        res.send({
            msg: '删除章节成功',
            status: 200
        });
    } catch (error) {
        console.error('删除章节异常：', error);

        if (error.message === '章节不存在') {
            return res.send({
                msg: '章节不存在',
                status: 404
            });
        }

        res.send({
            msg: '服务器内部错误',
            status: 500
        });
    }
});

/**
 * 添加章节
 * POST /addChapter
 * 请求体：{ novel_id, title, content, chapter_number（可选） }
 */
router.post('/addChapter', async (req, res) => {
    const { novel_id, title, content, chapter_number } = req.body;

    // 基础参数校验
    if (novel_id === undefined || !title || content === undefined) {
        return res.send({
            msg: '缺少必要参数：novel_id, title, content',
            status: 400
        });
    }

    try {
        const { chapterId, chapterNumber } = await chapterService.addChapter({
            novel_id,
            title,
            content,
            chapter_number
        });

        res.send({
            msg: '添加章节成功',
            status: 200,
            data: {
                chapterId,
                chapterNumber
            }
        });
    } catch (error) {
        console.error('添加章节异常：', error);

        if (error.message.includes('缺少必要参数')) {
            return res.send({
                msg: error.message,
                status: 400
            });
        }
        if (error.message === '章节序号必须为正整数') {
            return res.send({
                msg: error.message,
                status: 400
            });
        }

        res.send({
            msg: '服务器内部错误',
            status: 500
        });
    }
});

/**
 * 修改章节
 * POST /updateChapter
 * 请求体：{ chapterId, title（可选）, content（可选） }
 */
router.post('/updateChapter', async (req, res) => {
    const { chapterId, title, content } = req.body;

    if (chapterId === undefined || chapterId === null) {
        return res.send({
            msg: '缺少章节ID',
            status: 400
        });
    }

    // 构建需要更新的数据对象
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;

    // 如果没有提供任何更新字段，可以提前返回
    if (Object.keys(updateData).length === 0) {
        return res.send({
            msg: '没有提供要更新的内容',
            status: 400
        });
    }

    try {
        await chapterService.updateChapter(chapterId, updateData);

        res.send({
            msg: '更新章节成功',
            status: 200
        });
    } catch (error) {
        console.error('更新章节异常：', error);

        if (error.message === '章节不存在') {
            return res.send({
                msg: '章节不存在',
                status: 404
            });
        }

        // 其他错误
        if (error.message.includes('缺少必要参数')) {
            return res.send({
                msg: error.message,
                status: 400
            });
        }

        res.send({
            msg: '服务器内部错误',
            status: 500
        });
    }
});

// 删除小说
router.post('/deleteNovel', async (req, res) => {
    const { novelId } = req.body;

    if (novelId === undefined || novelId === null) {
        return res.send({
            msg: '缺少小说ID',
            status: 400
        });
    }

    try {
        await novelService.deleteNovel(novelId);

        res.send({
            msg: '删除章节成功',
            status: 200
        });
    } catch (error) {
        console.error('删除章节异常：', error);

        if (error.message === '章节不存在') {
            return res.send({
                msg: '章节不存在',
                status: 404
            });
        }

        res.send({
            msg: '服务器内部错误',
            status: 500
        });
    }
});

// 根据小说ID获取所有评论
router.get('/novelComments', async (req, res) => {
    try {
        let { novelId } = req.query;
        novelId = Number(novelId);
        if (!novelId) {
            return res.status(400).send({ status: 400, msg: '请提供小说ID' });
        }

        // 获取该小说的所有评论
        const allComments = await commentService.getCommentsByNovelId(novelId);
        if (allComments.length === 0) {
            return res.send({
                status: 200,
                msg: '获取评论成功',
                result: []
            });
        }

        // 提取用户昵称映射和点赞数映射
        const userNickMap = new Map(allComments.map(c => [c.user.id, c.user.nick]));
        const likesMap = new Map(allComments.map(c => [c.commentId, c.likeCount]));

        // 获取小说标题
        const novelTitleMap = await novelService.getNovelTitleMap([novelId]);
        const novelTitle = novelTitleMap.get(novelId) ?? '';

        // 构建评论映射
        const commentMap = new Map();
        allComments.forEach(comment => {
            commentMap.set(comment.commentId, {
                ...comment,
                replies: [] // 子评论数组
            });
        });

        // 构建树结构
        const topLevelComments = [];
        allComments.forEach(comment => {
            const commentWithReplies = commentMap.get(comment.commentId);
            if (comment.parentId && commentMap.has(comment.parentId)) {
                commentMap.get(comment.parentId).replies.push(commentWithReplies);
            } else {
                topLevelComments.push(commentWithReplies);
            }
        });

        // 递归格式化评论的函数
        const formatComment = (comment) => {
            const likes = likesMap.get(comment.commentId) || 0;
            const repliesCount = comment.replies.length;

            // 获取父评论作者昵称（如果有父评论）
            let parentAuthor = null;
            if (comment.parentId) {
                const parentComment = commentMap.get(comment.parentId);
                parentAuthor = parentComment ? (parentComment.user.nick || null) : null;
            }

            return {
                id: comment.commentId,
                novelId: novelId,
                nickname: userNickMap.get(comment.user.id) || '未知用户',
                content: comment.content,
                novel: novelTitle,
                time: formatDate(comment.createdAt),
                stats: [`👍 ${likes}`, `💬 ${repliesCount}`],
                parentAuthor,                // 父评论作者昵称
                replies: comment.replies.map(reply => formatComment(reply)) // 递归格式化子评论
            };
        };

        const formattedResults = topLevelComments.map(comment => formatComment(comment));

        res.send({
            status: 200,
            msg: '获取评论成功',
            result: formattedResults
        });
    } catch (error) {
        console.error('获取小说评论失败:', error);
        res.status(500).send({
            status: 500,
            msg: error.message || '服务器内部错误'
        });
    }
});

/**
 * 添加评论
 * POST /addComment
 * 请求体：{ userId, novelId, content, parentId（可选） }
 */
router.post('/addComment', async (req, res) => {
    const { userId, novelId, content, parentId } = req.body;

    // 基础参数校验
    if (userId === undefined || novelId === undefined || !content) {
        return res.send({
            msg: '缺少必要参数：userId, novelId, content',
            status: 400
        });
    }

    try {
        // parent_id 若未提供则自动转为 null
        const commentId = await commentService.insertComment({
            user_id: userId,
            novel_id: novelId,
            content,
            parent_id: parentId
        });

        res.send({
            msg: '添加评论成功',
            status: 200,
            data: {
                commentId
            }
        });
    } catch (error) {
        console.error('添加评论异常：', error);

        if (error.message.includes('外键约束') || error.message.includes('foreign key')) {
            return res.send({
                msg: '用户或小说不存在',
                status: 400
            });
        }
        if (error.message.includes('content') && error.message.includes('too long')) {
            return res.send({
                msg: '评论内容过长',
                status: 400
            });
        }

        res.send({
            msg: '服务器内部错误',
            status: 500
        });
    }
});

/**
 * 增加小说热度（hot字段+1）
 * POST /incrementHot
 * 请求体：{ novelId }
 */
router.post('/incrementHot', async (req, res) => {
    const { novelId } = req.body;

    // 参数校验
    if (novelId === undefined) {
        return res.send({
            msg: '缺少必要参数：novelId',
            status: 400
        });
    }

    try {
        const affectedRows = await novelService.incrementNovelHotById(novelId);

        if (affectedRows === 0) {
            return res.send({
                msg: '小说不存在',
                status: 400
            });
        }

        res.send({
            msg: '热度更新成功',
            status: 200,
            data: {
                affectedRows
            }
        });
    } catch (error) {
        console.error('更新热度异常：', error);
        res.send({
            msg: '服务器内部错误',
            status: 500
        });
    }
});

module.exports = router