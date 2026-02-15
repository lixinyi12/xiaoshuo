const { query } = require('../config');

/**
 * 获取所有标签
 * @returns {Promise<Array<{id: number, name: string, create_at: string}>>} 标签数组
 */
exports.getAllTags = async () => {
  const sql = 'SELECT * FROM tags';
  const rows = await query(sql);
  return rows;
};

/**
 * 根据小说ID获取小说的标签列表
 * @param {*} novelId 
 * @returns {Promise<Array<name: string>>}
 * ['tag1','tag2']
 */
exports.getNovelTags = async (novelId) => {
  const sql = `
    SELECT t.name
    FROM tags t
    JOIN novel_tags nt ON t.id = nt.tag_id
    WHERE nt.novel_id = ?
  `;
  const rows = await query(sql, [novelId]);
  return rows.map(tag => tag.name);
};