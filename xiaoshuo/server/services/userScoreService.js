const { query } = require('../config');

/**
 * 根据小说ID计算平均得分
 * @param {number} novelId 小说ID
 * @returns {Promise<Object>} { avg_score: number }
 */
exports.getAverageScoreByNovelId = async (novelId) => {
    const sql = `
        SELECT COALESCE(AVG(score), 0) as avg_score
        FROM user_score
        WHERE novel_id = ?
    `;
    const rows = await query(sql, [novelId]);
    return rows[0]?.avg_score ?? 0;
};

/**
 * 根据用户ID和小说ID查询用户的评分记录
 * @param {number} userId - 用户ID
 * @param {number} novelId - 小说ID
 * @returns {Promise<Object|null>} {id, user_id, novel_id, score, created_at, updated_at}
 */
exports.getUserScoreByUserIdAndNovelId = async (userId, novelId) => {
    const sql = `
        SELECT *
        FROM user_score
        WHERE user_id = ? AND novel_id = ?
    `;
    const rows = await query(sql, [userId, novelId]);
    return rows[0] || null;
};