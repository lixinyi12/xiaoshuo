const express = require("express")
const router = express.Router()
const sqlFn = require('../config')
const novelService = require('../services/novelService')
const tagService = require('../services/tagService')
const userScoreService = require('../services/userScoreService')
const chapterService = require('../services/chapterService')

// 热度排行
router.get('/hot', async (req, res) => {
    try {
        const novelsBasic = await novelService.getHotRanking();

        const data = await Promise.all(novelsBasic.map(async (novel, index) => {
            let hotDisplay = novel.hot;
            if (novel.hot >= 10000) {
                hotDisplay = (novel.hot / 10000).toFixed(1) + '万';
            }

            const [chapterCount, avgRating, tags] = await Promise.all([
                chapterService.getChapterCountByNovelId(novel.id),
                userScoreService.getAverageScoreByNovelId(novel.id),
                tagService.getNovelTags(novel.id)
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
router.get('/latest', (req, res) => {
    function formatTimeAgo(datetime) {
        const now = new Date();
        const updated = new Date(datetime);
        const diff = Math.floor((now - updated) / 1000); // 秒

        if (diff < 60) return `${diff}秒前`;
        if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
        return `${Math.floor(diff / 86400)}天前`;
    }
    const sql = `
        SELECT 
        n.id,
        n.title,
        n.author,
        n.description,
        n.updated_at
        FROM novels n
        ORDER BY n.updated_at DESC
    `;

    sqlFn(sql, null, result => {
        const data = result.map(item => ({
            id: item.id,
            title: item.title,
            author: item.author,
            desc: item.description,
            update: formatTimeAgo(item.updated_at)
        }));

        res.send({
            status: 200,
            msg: '获取成功',
            data
        });
    });
});

// 收藏排行
router.get('/collects', (req, res) => {
    const sql = `
        SELECT 
            n.id,
            n.cover,
            n.title,
            n.author,
            n.hot,
            (
                SELECT COUNT(*) 
                FROM chapters c 
                WHERE c.novel_id = n.id
            ) as chapters,
            n.description,
            GROUP_CONCAT(DISTINCT t.name) AS tags,
            COUNT(DISTINCT uc.id) AS collect_count,
            COALESCE(ROUND(AVG(us.score), 1), 0) AS average_score
        FROM novels n
        LEFT JOIN user_collect uc ON n.id = uc.novel_id
        LEFT JOIN user_score us ON n.id = us.novel_id
        LEFT JOIN novel_tags nt ON n.id = nt.novel_id
        LEFT JOIN tags t ON nt.tag_id = t.id
        GROUP BY n.id
        ORDER BY collect_count DESC;
    `;

    sqlFn(sql, null, result => {
        const data = result.map(item => {
            // 格式化收藏数
            const formattedCollect = item.collect_count >= 10000
                ? `${(item.collect_count / 10000).toFixed(1)}万`
                : `${item.collect_count}`;

            return {
                id: item.id,
                cover: item.cover || '暂无封面',
                title: item.title || '暂无标题',
                author: item.author || '未知作者',
                stats: [
                    `🔥 ${item.hot ? (item.hot / 10000).toFixed(1) + '万' : '0'}`,
                    `📖 ${item.chapters || 0}章`,
                    `⭐ ${item.average_score || 0}评分`
                ],
                tag: item.tags ? item.tags.split(',') : [],
                desc: item.description || '暂无简介',
                collects: formattedCollect
            };
        });

        res.send({
            status: 200,
            msg: '获取成功',
            data
        });
    });
});

// 小说平均分排行
router.get('/score', (req, res) => {
    const sql = `
        SELECT 
            n.id,
            n.cover,
            n.title,
            n.author,
            n.hot,
            (
                SELECT COUNT(*) 
                FROM chapters c 
                WHERE c.novel_id = n.id
            ) as chapters,
            n.description,
            GROUP_CONCAT(DISTINCT t.name) AS tags,
            COUNT(DISTINCT uc.id) AS collect_count,
            COALESCE(ROUND(AVG(us.score), 1), 0) AS average_score
        FROM novels n
        LEFT JOIN user_score us ON n.id = us.novel_id
        LEFT JOIN user_collect uc ON n.id = uc.novel_id
        LEFT JOIN novel_tags nt ON n.id = nt.novel_id
        LEFT JOIN tags t ON nt.tag_id = t.id
        GROUP BY n.id
        ORDER BY average_score DESC;

    `;

    sqlFn(sql, null, result => {
        const data = result.map(item => {
            const avgScore = Number(item.average_score) || 0;
            return {
                id: item.id,
                cover: item.cover || '暂无封面',
                title: item.title || '暂无标题',
                author: item.author || '未知作者',
                stats: [
                    `🔥 ${item.hot ? (item.hot / 10000).toFixed(1) + '万' : '0'}`,
                    `📖 ${item.chapters || 0}章`,
                    `⭐ ${avgScore.toFixed(1)}评分`
                ],
                tag: item.tags ? item.tags.split(',') : [],
                desc: item.description || '暂无简介',
                score: avgScore.toFixed(1)
            };
        });


        res.send({
            status: 200,
            msg: '获取成功',
            data
        });
    });
});

// 完结热度排行
router.get('/finished', (req, res) => {
    const sql = `
        SELECT 
            n.id,
            n.cover,
            n.title,
            n.author,
            n.hot,
            (
                SELECT COUNT(*) 
                FROM chapters c 
                WHERE c.novel_id = n.id
            ) as chapters,
            n.description,
            COALESCE(ROUND(AVG(us.score),1),0) AS average_score,
            n.updated_at,
            GROUP_CONCAT(DISTINCT t.name) AS tags
        FROM novels n
        LEFT JOIN novel_tags nt ON n.id = nt.novel_id
        LEFT JOIN tags t ON t.id = nt.tag_id
        LEFT JOIN user_score us ON n.id = us.novel_id
        GROUP BY n.id
        HAVING tags LIKE '%完结%'
        ORDER BY n.hot DESC
    `;

    sqlFn(sql, null, result => {
        const data = result.map((item, index) => {
            let hotDisplay = item.hot;
            if (item.hot >= 10000) {
                hotDisplay = (item.hot / 10000).toFixed(1) + '万';
            }

            return {
                id: item.id,
                cover: item.cover,
                title: item.title,
                author: item.author,
                stats: [
                    `🔥 ${(item.hot / 10000).toFixed(1)}万`,
                    `📖 ${item.chapters}章`,
                    `⭐ ${item.average_score}评分`
                ],
                tag: item.tags ? item.tags.split(",") : [],
                desc: item.description,
                update: item.updated_at,
                rank: index + 1,
                hot: hotDisplay,
                chapters: item.chapters,
                average_score: item.average_score
            };
        });

        res.send({
            status: 200,
            msg: '获取成功',
            data
        });
    });
});

module.exports = router