const novelService = require('../services/novelService');
const chapterService = require('../services/chapterService');

/**
 * 检查用户是否有权操作指定小说（作者本人或管理员）
 * @param {string} idSource 小说ID的来源 'body.novelId'、'params.id'
 */
exports.checkNovelEditable = (idSource = 'body.novelId') => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).json({ status: 401, msg: '未登录' });

        // 解析小说ID
        const parts = idSource.split('.');
        let novelId;
        if (parts[0] === 'params') {
            novelId = req.params[parts[1]];
        } else if (parts[0] === 'body') {
            novelId = req.body[parts[1]];
        } else if (parts[0] === 'query') {
            novelId = req.query[parts[1]];
        } else {
            novelId = req.body.novelId || req.params.novelId || req.query.novelId;
        }

        if (!novelId) return res.status(400).json({ status: 400, msg: '小说ID缺失' });

        try {
            const novel = await novelService.getNovelById(novelId);
            if (!novel) return res.status(404).json({ status: 404, msg: '小说不存在' });

            const isAdmin = req.user.permissions.includes('novel:edit_any');
            const isOwner = novel.user_id == req.user.id;

            if (isAdmin || isOwner) {
                req.novel = novel; // 挂载小说对象
                next();
            } else {
                res.status(403).json({ status: 403, msg: '您没有权限操作此小说' });
            }
        } catch (err) {
            console.error('checkNovelEditable error:', err);
            res.status(500).json({ status: 500, msg: '服务器错误' });
        }
    };
};

/**
 * 检查用户是否有权操作指定章节（通过章节所属小说判断）
 * @param {string} idSource 章节ID的来源 'body.chapterId'
 */
exports.checkChapterEditable = (idSource = 'body.chapterId') => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).json({ status: 401, msg: '未登录' });

        const parts = idSource.split('.');
        let chapterId;
        if (parts[0] === 'params') {
            chapterId = req.params[parts[1]];
        } else if (parts[0] === 'body') {
            chapterId = req.body[parts[1]];
        } else if (parts[0] === 'query') {
            chapterId = req.query[parts[1]];
        } else {
            chapterId = req.body.chapterId || req.params.chapterId || req.query.chapterId;
        }

        if (!chapterId) return res.status(400).json({ status: 400, msg: '章节ID缺失' });

        try {
            const chapter = await chapterService.getChapterById(chapterId);
            if (!chapter) return res.status(404).json({ status: 404, msg: '章节不存在' });

            // 复用小说权限检查
            const novel = await novelService.getNovelById(chapter.novel_id);
            if (!novel) return res.status(404).json({ status: 404, msg: '所属小说不存在' });

            const isAdmin = req.user.permissions.includes('novel:edit_any');
            const isOwner = novel.user_id == req.user.id;

            if (isAdmin || isOwner) {
                req.novel = novel;
                req.chapter = chapter;
                next();
            } else {
                res.status(403).json({ status: 403, msg: '您没有权限操作此章节' });
            }
        } catch (err) {
            console.error('checkChapterEditable error:', err);
            res.status(500).json({ status: 500, msg: '服务器错误' });
        }
    };
};