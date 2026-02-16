const { query } = require('../config');

/**
 * 获取所有标签
 * @returns {Promise<Array<{id: number, name: string, create_at: string, type: enum}>>} 标签数组
 */
exports.getAllTags = async () => {
  const sql = 'SELECT * FROM tags';
  const rows = await query(sql);
  return rows;
};

/**
 * 根据小说ID获取小说的标签列表（包含名称和类型）
 * @param {number} novelId - 小说ID
 * @returns {Promise<Array<{name: string, type: string}>>}
 * 示例返回: [{ name: 'tag1', type: 'genre' }, { name: 'tag2', type: 'theme' }]
 */
exports.getNovelTags = async (novelId) => {
  const sql = `
    SELECT t.name, t.type
    FROM tags t
    JOIN novel_tags nt ON t.id = nt.tag_id
    WHERE nt.novel_id = ?
  `;
  const rows = await query(sql, [novelId]);
  return rows.map(tag => ({
    name: tag.name,
    type: tag.type
  }));
};