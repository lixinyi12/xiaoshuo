const { query } = require('../config');

/**
 * 根据小说Id和章节序号查询章节全部信息
 * @param {*} novelId 
 * @param {*} chapterNumber 
 * @returns 
 */
exports.getChapterByIdAndNumber = async (novelId, chapterNumber) => {
    const sql = `
        SELECT *
        FROM chapters 
        WHERE novel_id = ? AND chapter_number = ?
    `;
    const rows = await query(sql, [novelId, chapterNumber]);
    return rows[0] || null;
};

/**
 * 根据小说Id查询所有章节全部信息
 * @param {*} novelId 
 * @returns 
 */
exports.getChaptersById = async (novelId) => {
    const sql = `SELECT * FROM chapters WHERE novel_id = ?`;
    const rows = await query(sql, [novelId]);
    return rows;
};

/**
 * 根据小说Id返回章节总数
 * @param {*} novelId 
 * @returns 
 */
exports.getChapterCountByNovelId = async (novelId) => {
    const sql = `SELECT COUNT(*) as count FROM chapters WHERE novel_id = ?`;
    const [result] = await query(sql, [novelId]);
    return result?.count ?? 0;
};

/**
 * 根据小说Id返回最新更新时间
 * @param {*} novelId 
 * @returns 
 */
exports.getLastUpdateByNovelId = async (novelId) => {
    const sql = `
        SELECT MAX(updated_at) as last_update
        FROM chapters
        WHERE novel_id = ?
    `;
    const rows = await query(sql, [novelId]);
    return rows[0] || null;
};

/**
 * 根据章节ID删除章节，并调整同小说中后续章节的序号
 * @param {number} chapterId 要删除的章节ID
 * @returns {Promise<boolean>} 删除成功返回 true
 */
exports.deleteChapter = async (chapterId) => {
    const selectSql = 'SELECT novel_id, chapter_number FROM chapters WHERE id = ?';
    const [chapter] = await query(selectSql, [chapterId]);
    if (!chapter) {
        throw new Error('章节不存在');
    }
    const { novel_id: novelId, chapter_number } = chapter;

    const deleteSql = 'DELETE FROM chapters WHERE id = ?';
    const deleteResult = await query(deleteSql, [chapterId]);
    if (deleteResult.affectedRows === 0) {
        throw new Error('删除失败');
    }

    const updateSql = `
        UPDATE chapters 
        SET chapter_number = chapter_number - 1 
        WHERE novel_id = ? AND chapter_number > ?
    `;
    await query(updateSql, [novelId, chapter_number]);

    const updateNovelSql = 'UPDATE novels SET updated_at = NOW() WHERE id = ?';
    await query(updateNovelSql, [novelId]);

    return true;
};

/**
 * 新增章节，可指定章节序号（自动调整后续章节），若不指定则追加到末尾
 * @param {Object} chapterData 章节数据
 * @param {number} chapterData.novel_id 小说ID
 * @param {string} chapterData.title 章节标题
 * @param {string} chapterData.content 章节内容
 * @param {number} chapterData.chapter_number 指定的章节序号（正整数）（可选）
 * @returns {Promise<number>} 返回新插入章节的ID
 */
exports.addChapter = async (chapterData) => {
    const { novel_id, title, content, chapter_number } = chapterData;
    if (!novel_id || !title || content === undefined) {
        throw new Error('缺少必要参数：novel_id, title, content');
    }

    const word_count = content.length;

    // 查询当前小说最大章节序号
    const maxSql = 'SELECT MAX(chapter_number) as maxNum FROM chapters WHERE novel_id = ?';
    const [maxResult] = await query(maxSql, [novel_id]);
    const currentMax = maxResult.maxNum || 0;

    let newNumber;
    if (chapter_number === undefined || chapter_number === null) {
        // 未指定序号，追加到最后
        newNumber = currentMax + 1;
    } else {
        // 验证提供的序号为正整数
        if (!Number.isInteger(chapter_number) || chapter_number <= 0) {
            throw new Error('章节序号必须为正整数');
        }
        if (chapter_number > currentMax + 1) {
            // 若指定序号超出当前最大+1，自动设为追加
            newNumber = currentMax + 1;
        } else {
            newNumber = chapter_number;
        }
    }

    // 如果需要插入到中间，则先将后续章节序号+1
    if (newNumber <= currentMax) {
        const updateSql = `
            UPDATE chapters 
            SET chapter_number = chapter_number + 1 
            WHERE novel_id = ? AND chapter_number >= ?
        `;
        await query(updateSql, [novel_id, newNumber]);
    }

    // 插入新章节
    const insertSql = `
        INSERT INTO chapters 
        (novel_id, chapter_number, title, content, word_count, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const insertResult = await query(insertSql, [novel_id, newNumber, title, content, word_count]);

    // 更新小说的 updated_at
    const updateNovelSql = 'UPDATE novels SET updated_at = NOW() WHERE id = ?';
    await query(updateNovelSql, [novel_id]);

    // 返回新插入的章节ID
    return {
        chapterId: insertResult.insertId,
        chapterNumber: newNumber
    };
};

/**
 * 更新章节信息，若修改序号则自动调整同小说内其他章节的序号
 * @param {number} chapterId 章节ID
 * @param {Object} updateData 要更新的字段
 * @param {string} updateData.title 新标题（可选）
 * @param {string} updateData.content 新内容（可选）
 * @returns {Promise<boolean>} 更新成功返回 true
 */
exports.updateChapter = async (chapterId, updateData) => {
    // 查询原章节信息
    const selectSql = 'SELECT novel_id, chapter_number FROM chapters WHERE id = ?';
    const [chapter] = await query(selectSql, [chapterId]);
    if (!chapter) {
        throw new Error('章节不存在');
    }
    const { novel_id: novelId, chapter_number: oldNumber } = chapter;

    const updates = [];
    const params = [];

    // 处理标题
    if (updateData.title !== undefined) {
        updates.push('title = ?');
        params.push(updateData.title);
    }

    // 处理内容
    if (updateData.content !== undefined) {
        updates.push('content = ?');
        params.push(updateData.content);
        // 更新字数
        const wordCount = updateData.content.length;
        updates.push('word_count = ?');
        params.push(wordCount);
    }

    // 如果没有要更新的字段，则仅更新时间戳
    if (updates.length === 0) {
        const touchSql = 'UPDATE chapters SET updated_at = NOW() WHERE id = ?';
        await query(touchSql, [chapterId]);
    } else {
        updates.push('updated_at = NOW()');
        const updateSql = `UPDATE chapters SET ${updates.join(', ')} WHERE id = ?`;
        params.push(chapterId);
        const updateResult = await query(updateSql, params);
        if (updateResult.affectedRows === 0) {
            throw new Error('更新失败');
        }
    }

    // 更新小说的 updated_at
    const updateNovelSql = 'UPDATE novels SET updated_at = NOW() WHERE id = ?';
    await query(updateNovelSql, [novelId]);

    return true;
};