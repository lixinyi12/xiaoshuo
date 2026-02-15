const { query } = require('../config');

/**
 * 根据 userId 获取用户所有信息
 * @param {number} userId
 * @returns {Promise<object|null>}
 */
exports.getUserById = async (userId) => {
  const sql = 'SELECT * FROM user WHERE id = ?';
  const rows = await query(sql, [userId]);
  return rows[0] || null;
};

/**
 * 根据手机号或邮箱查找用户所有信息
 * @param {*} phone 
 * @param {*} email 
 * @returns {Promise<object|null>}
 */
exports.getUserByPhoneOrEmail = async (phone, email) => {
  const sql = 'SELECT * FROM user WHERE phone = ? OR email = ?';
  const rows = await query(sql, [phone, email]);
  return rows[0] || null;
};

/**
 * 更新用户个人信息（动态字段）
 * @param {*} userId 
 * @param {*} fields 
 * fields: { nick, phone, email, gender, birthday, desc, password }
 * @returns {Promise<boolean>}
 */
exports.updateUserInfo = async (userId, fields) => {
  const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(fields), userId];
  const sql = `UPDATE user SET ${setClause}, updated_at = NOW() WHERE id = ?`;
  const result = await query(sql, values);
  return result.affectedRows > 0;
};

/**
 * 创建新用户
 * @param {object} userData - phone, email, password
 * @returns {Promise<object>} query 执行结果
 */
exports.createUser = async (userData) => {
  const { phone, email, password } = userData;
  const sql = 'INSERT INTO user (phone, email, password) VALUES (?, ?, ?)';
  const result = await query(sql, [phone, email, password]);
  return result;
};

/**
 * 根据手机号查询用户（返回id）
 * @param {string} phone
 * @returns {Promise<object|null>}
 */
 exports.findUserByPhone = async (phone) => {
  const sql = 'SELECT id FROM user WHERE phone = ?';
  const rows = await query(sql, [phone]);
  return rows[0] || null;
};

/**
 * 根据邮箱查询用户（返回id）
 * @param {string} email
 * @returns {Promise<object|null>}
 */
exports.findUserByEmail = async (email) => {
  const sql = 'SELECT id FROM user WHERE email = ?';
  const rows = await query(sql, [email]);
  return rows[0] || null;
};

/**
 * 根据用户ID获取昵称
 * @param {number} userId
 * @returns {Promise<string|null>}
 */
exports.getUserNickById = async (userId) => {
    const user = await exports.getUserById(userId);
    return user?.nick || null;
};