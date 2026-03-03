const { query } = require('../config');

/**
 * 查询用户是否已收藏某小说
 * @param {*} userId 
 * @param {*} novelId 
 * @returns 
 */
exports.isCollected = async (userId, novelId) => {
  const sql = 'SELECT id FROM user_collect WHERE user_id = ? AND novel_id = ?';
  const rows = await query(sql, [userId, novelId]);
  return rows.length > 0;
};

/**
 * 添加收藏（若已存在则取消收藏）
 * @param {*} userId 
 * @param {*} novelId 
 * @returns 
 */
exports.toggleCollect = async (userId, novelId) => {
  const existed = await exports.isCollected(userId, novelId);
  if (existed) {
    const sql = 'DELETE FROM user_collect WHERE user_id = ? AND novel_id = ?';
    await query(sql, [userId, novelId]);
    return { action: 'remove', collected: false };
  } else {
    const sql = 'INSERT INTO user_collect (user_id, novel_id, created_at) VALUES (?, ?, NOW())';
    await query(sql, [userId, novelId]);
    return { action: 'add', collected: true };
  }
};

/**
 * 获取用户收藏的小说列表
 * @param {number} userId 用户ID
 * @returns {*} 小说数组
 */
exports.getUserCollectNovels = async (userId) => {
    const sql = `
        SELECT n.*
        FROM user_collect uc 
        JOIN novels n ON uc.novel_id = n.id 
        WHERE uc.user_id = ?
        ORDER BY uc.created_at DESC
    `;
    const rows = await query(sql, [userId]);
    return rows;
};