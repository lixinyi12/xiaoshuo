const { query } = require('../config');

/**
 * 根据小说ID查询评论总数
 * @param {number} novelId - 小说ID
 * @returns {Promise<Object>} { comment_count: number }
 */
 exports.getCommentCountByNovelId = async (novelId) => {
    const sql = `
        SELECT COUNT(*) as comment_count
        FROM comments
        WHERE novel_id = ?
    `;
    const [result] = await query(sql, [novelId]);
    return result?.comment_count ?? 0;
};