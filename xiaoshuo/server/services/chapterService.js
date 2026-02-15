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