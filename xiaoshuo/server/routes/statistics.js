const express = require("express")
const router = express.Router()
const novelService = require('../services/novelService')
const tagService = require('../services/tagService')
const userScoreService = require('../services/userScoreService')
const chapterService = require('../services/chapterService')
const userService = require('../services/userService')
const { formatTimeAgo } = require('../utils/date')

// 热度排行
router.get('/hot', async (req, res) => {
    try {
        const novelsBasic = await novelService.getHotRanking();

        const data = await Promise.all(novelsBasic.map(async (novel, index) => {
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
                desc: novel.description,
                update: novel.updated_at,
                rank: index + 1,
                hot: hotDisplay,
                chapters: chapterCount,
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

// 更新时间排行
router.get('/latest', async (req, res) => {
    try {
        // 获取最新更新的小说列表（假设每个 item 包含 user_id 字段）
        const novels = await novelService.getLatestNovels();

        // 并发处理每个小说，获取作者昵称
        const data = await Promise.all(novels.map(async (item) => {
            const userNick = await userService.getUserNickById(item.user_id);
            return {
                id: item.id,
                title: item.title,
                author: userNick || '佚名',
                desc: item.description,
                update: formatTimeAgo(item.updated_at)
            };
        }));

        res.send({
            status: 200,
            msg: '获取成功',
            data
        });
    } catch (error) {
        console.error('获取最新更新小说失败:', error);
        res.status(500).send({
            status: 500,
            msg: '服务器内部错误'
        });
    }
});

// 收藏排行
router.get('/collects', async (req, res) => {
    try {
        const novelsBasic = await novelService.getCollectionRanking();

        const data = await Promise.all(novelsBasic.map(async (novel, index) => {
            const formattedCollect = novel.collection_count >= 10000
                ? `${(novel.collection_count / 10000).toFixed(1)}万`
                : `${novel.collection_count}`;

            const [chapterCount, avgRating, tags, userNick] = await Promise.all([
                chapterService.getChapterCountByNovelId(novel.id),
                userScoreService.getAverageScoreByNovelId(novel.id),
                tagService.getNovelTags(novel.id).then(rows => rows.map(t => t.name)),
                userService.getUserNickById(novel.user_id)
            ]);

            const avgRatingDisplay = avgRating ? Number(avgRating).toFixed(1) : '0.0';

            return {
                id: novel.id,
                cover: novel.cover || '暂无封面',
                title: novel.title || '暂无标题',
                author: userNick || '佚名',
                stats: [
                    `🔥 ${novel.hot ? (novel.hot / 10000).toFixed(1) + '万' : '0'}`,
                    `📖 ${chapterCount || 0}章`,
                    `⭐ ${avgRatingDisplay || 0}评分`
                ],
                tag: tags,
                desc: novel.description || '暂无简介',
                collects: formattedCollect
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

// 小说平均分排行
router.get('/score', async (req, res) => {
    try {
        const novelsBasic = await novelService.getScoreRanking();

        const data = await Promise.all(novelsBasic.map(async (novel, index) => {
            const [chapterCount, tags, userNick] = await Promise.all([
                chapterService.getChapterCountByNovelId(novel.id),
                tagService.getNovelTags(novel.id).then(rows => rows.map(t => t.name)),
                userService.getUserNickById(novel.user_id)
            ]);
            
            const avgScore = Number(novel.avg_score) || 0;
            const avgRatingDisplay = avgScore ? Number(avgScore).toFixed(1) : '0.0';

            return {
                id: novel.id,
                cover: novel.cover || '暂无封面',
                title: novel.title || '暂无标题',
                author: userNick || '佚名',
                stats: [
                    `🔥 ${novel.hot ? (novel.hot / 10000).toFixed(1) + '万' : '0'}`,
                    `📖 ${chapterCount || 0}章`,
                    `⭐ ${avgRatingDisplay || 0}评分`
                ],
                tag: tags,
                desc: novel.description || '暂无简介',
                score: avgRatingDisplay
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

// 完结热度排行
router.get('/finished', async (req, res) => {
    try {
        const novelsBasic = await novelService.getHotRankingByCompleted();

        const data = await Promise.all(novelsBasic.map(async (novel, index) => {
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
                desc: novel.description,
                update: novel.updated_at,
                rank: index + 1,
                hot: hotDisplay,
                chapters: chapterCount,
                average_score: avgRatingDisplay,
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

module.exports = router