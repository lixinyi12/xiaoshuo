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
 * data: { title, description, cover, wordCount, hot }
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
 * 按热度大小降序返回所有小说全部信息
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

/**
 * 按更新时间先后降序返回所有小说全部信息
 * @returns 
 */
exports.getLatestNovels = async () => {
  const sql = `
      SELECT *
      FROM novels n
      ORDER BY n.updated_at DESC
  `;
  return await query(sql);
};

/**
 * 按收藏数降序返回所有小说的全部信息
 * @returns {Promise<Array>} novels 表所有字段及收藏数字段 collection_count
 */
exports.getCollectionRanking = async () => {
  const sql = `
    SELECT n.*, COALESCE(t.collect_count, 0) AS collection_count
    FROM novels n
    LEFT JOIN (
        SELECT novel_id, COUNT(*) AS collect_count
        FROM user_collect
        GROUP BY novel_id
    ) t ON n.id = t.novel_id
    ORDER BY collection_count DESC
  `;
  return await query(sql);
};

/**
 * 按平均分降序返回所有小说的全部信息
 * @returns {Promise<Array>} novels 表所有字段及平均分字段 avg_score
 */
exports.getScoreRanking = async () => {
  const sql = `
    SELECT n.*, COALESCE(t.avg_score, 0) AS avg_score
    FROM novels n
    LEFT JOIN (
        SELECT novel_id, AVG(score) AS avg_score
        FROM user_score
        GROUP BY novel_id
    ) t ON n.id = t.novel_id
    ORDER BY avg_score DESC
  `;
  return await query(sql);
};

/**
 * 返回标签为“完结”的小说，按热度降序排列
 * @returns {Promise<Array>} 符合条件的小说列表
 */
exports.getHotRankingByCompleted = async () => {
  const sql = `
    SELECT n.*
    FROM novels n
    WHERE EXISTS (
        SELECT 1
        FROM novel_tags nt
        JOIN tags t ON nt.tag_id = t.id
        WHERE nt.novel_id = n.id AND t.name = '完结'
    )
    ORDER BY n.hot DESC
  `;
  return await query(sql);
};

/**
 * 批量获取小说标题
 * @param {number[]} novelIds
 * @returns {Promise<Map<number, string>>} 小说ID -> 标题
 */
exports.getNovelTitleMap = async (novelIds) => {
    if (novelIds.length === 0) return new Map();
    const sql = `SELECT id, title FROM novels WHERE id IN (?)`;
    const rows = await query(sql, [novelIds]);
    const map = new Map();
    rows.forEach(row => map.set(row.id, row.title));
    return map;
};

/**
 * 根据用户ID获取所有小说全部信息
 * @param {*} userId 
 * @returns {Promise<Array>} 符合条件的小说列表
 */
exports.getNovelsListByUserId = async (userId) => {
  const sql = 'SELECT * FROM novels WHERE user_id = ?';
  const rows = await query(sql, [userId]);
  return rows;
};