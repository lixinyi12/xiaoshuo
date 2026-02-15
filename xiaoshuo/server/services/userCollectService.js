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