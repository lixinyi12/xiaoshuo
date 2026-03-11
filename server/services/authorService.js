const { query } = require('../config');

/**
 * 添加一条作者信息
 * @param {Object} authorData 作者数据对象
 * @returns {Promise<Object>} 插入操作的结果
 */
exports.addAuthor = async (authorData) => {
    const { user_id, real_name, id_card, pen_name } = authorData;
    const sql = `
        INSERT INTO authors (user_id, real_name, id_card, pen_name, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
    `;
    const result = await query(sql, [user_id, real_name, id_card, pen_name]);
    return result;
};

/**
 * 根据作者ID删除一条作者信息
 * @param {number} authorId 作者ID
 * @returns {Promise<Object>} 删除操作的结果
 */
exports.deleteAuthorById = async (authorId) => {
    const sql = `
        DELETE FROM authors
        WHERE id = ?
    `;
    const result = await query(sql, [authorId]);
    return result;
};

/**
 * 获取所有作者的所有信息
 * @returns {Promise<Array>}
 */
exports.getAllAuthors = async () => {
    const sql = 'SELECT * FROM authors';
    const results = await query(sql);
    return results;
};

/**
 * 根据作者ID获取单个作者信息
 * @param {number|string} id 作者ID
 * @returns {Promise<Object|null>} 作者信息对象，不存在则返回null
 */
exports.getAuthorById = async (id) => {
    const sql = 'SELECT * FROM authors WHERE id = ?';
    const results = await query(sql, [id]);
    return results.length ? results[0] : null;
};

/**
 * 更新作者信息
 * @param {number|string} id 作者ID
 * @param {Object} authorData 包含要更新的字段 (real_name, id_card, pen_name)
 * @returns {Promise<Object>} 更新操作的结果
 */
exports.updateAuthor = async (id, authorData) => {
    const { real_name, id_card, pen_name } = authorData;
    const sql = `
        UPDATE authors 
        SET real_name = ?, id_card = ?, pen_name = ?, updated_at = NOW()
        WHERE id = ?
    `;
    const result = await query(sql, [real_name, id_card, pen_name, id]);
    return result;
};