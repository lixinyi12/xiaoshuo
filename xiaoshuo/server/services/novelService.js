const { query } = require('../config');

/**
 * 插入小说主记录，返回新生成的 novelId
 * @param {*} novelData 
 * { title, author, userId, wordCount = 0, hot = 0, description = '', cover = '' }
 * @returns 
 */
exports.insertNovel = async (novelData) => {
  const { title, author, userId, wordCount = 0, hot = 0, description = '', cover = '' } = novelData;
  const sql = `
    INSERT INTO novels 
      (category_id, title, author, user_id, word_count, hot, view_count, description, created_at, updated_at, cover)
    VALUES (?, ?, ?, ?, ?, 0, ?, NOW(), NOW(), ?)
  `;
  const result = await query(sql, [title, author, userId, wordCount, hot, description, cover]);
  return result.insertId;
};

/**
 * 根据小说ID获取全部信息
 * @param {*} novelId 
 * @returns
 * {id, title, author, user_id, word_count, hot, description, created_at, updated_at, cover}
 */
exports.getNovelById = async (novelId) => {
  const sql = 'SELECT * FROM novels WHERE id = ?';
  const rows = await query(sql, [novelId]);
  return rows[0] || null;
};

/**
 * 获取全部小说信息
 * @returns 
 */
exports.getAllNovel = async () => {
  const sql = 'SELECT * FROM novels';
  const rows = await query(sql, null);
  return rows;
};

/**
 * 根据搜索关键词模糊搜索
 * @param {*} searchKey 
 * @returns
 * {id, title, author, user_id, word_count, hot, description, created_at, updated_at, cover}
 */
exports.searchNovels = async (searchKey) => {
  const sql = `
    SELECT *
    FROM novels n
    WHERE n.title LIKE CONCAT('%', ?, '%')
       OR n.author LIKE CONCAT('%', ?, '%')
    GROUP BY n.id
  `;
  const rows = await query(sql, [searchKey, searchKey]);
  return rows;
};

/**
 * 更新小说基本信息
 * @param {*} novelId 
 * @param {*} data 
 * @param {*} connection 
 * @returns 
 */
exports.updateNovel = async (novelId, data, connection) => {
  const { title, description, cover, wordCount, hot } = data;
  const fields = [];
  const params = [];
  if (title !== undefined) { fields.push('title = ?'); params.push(title); }
  if (description !== undefined) { fields.push('description = ?'); params.push(description); }
  if (cover !== undefined) { fields.push('cover = ?'); params.push(cover); }
  if (wordCount !== undefined) { fields.push('word_count = ?'); params.push(wordCount); }
  if (hot !== undefined) { fields.push('hot = ?'); params.push(hot); }
  if (fields.length === 0) return;
  fields.push('updated_at = NOW()');
  const sql = `UPDATE novels SET ${fields.join(', ')} WHERE id = ?`;
  params.push(novelId);
  const exec = connection ? connection.execute : query;
  await exec(sql, params);
};

/**
 * 删除小说
 * @param {*} novelId 
 * @param {*} connection 
 */
exports.deleteNovel = async (novelId, connection) => {
  const sql = 'DELETE FROM novels WHERE id = ?';
  const exec = connection ? connection.execute : query;
  await exec(sql, [novelId]);
};

/**
 * 热度排行榜
 * @returns 
 */
exports.getHotRanking = async () => {
  const sql = `
      SELECT *
      FROM novels n
      ORDER BY n.hot DESC
  `;
  return await query(sql);
};