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

/**
 * 添加用户评分，返回新生成的评分ID
 * @param {Object} scoreData 
 * @param {number} scoreData.userId   - 用户ID
 * @param {number} scoreData.novelId  - 小说ID
 * @param {number} scoreData.score    - 评分值
 * @returns {Promise<number>} 插入的评分记录ID
 */
exports.insertUserScore = async (scoreData) => {
  const { userId, novelId, score } = scoreData;
  const sql = `
    INSERT INTO user_score 
      (user_id, novel_id, score, created_at, updated_at)
    VALUES (?, ?, ?, NOW(), NOW())
  `;
  const result = await query(sql, [userId, novelId, score]);
  return result.insertId;
};

/**
 * 根据userId和novelId更新评分
 * @param {Object} scoreData 
 * @param {number} scoreData.userId   - 用户ID
 * @param {number} scoreData.novelId  - 小说ID
 * @param {number} scoreData.score    - 新评分值
 * @returns {Promise<number>} 影响的行数（0表示记录不存在，1表示更新成功）
 */
exports.updateUserScore = async ({ userId, novelId, score }) => {
  const sql = `
    UPDATE user_score
    SET score = ?, updated_at = NOW()
    WHERE user_id = ? AND novel_id = ?
  `;
  const result = await query(sql, [score, userId, novelId]);
  return result.affectedRows;
};