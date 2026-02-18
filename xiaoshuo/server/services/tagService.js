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

/**
 * 根据小说ID和新的tags数组更新小说标签
 * @param {*} novelId 
 * @param {*} tags ['连载','玄幻']
 */
exports.updateNovelTags = async (novelId, tags) => {
  const tagNames = tags || [];

  const currentRows = await query(
    'SELECT tag_id FROM novel_tags WHERE novel_id = ?',
    [novelId]
  );
  const currentTagIds = currentRows.map(row => row.tag_id);
  let existingTags = [];
  if (tagNames.length > 0) {
    const placeholders = tagNames.map(() => '?').join(',');
    existingTags = await query(
      `SELECT id, name FROM tags WHERE name IN (${placeholders})`,
      tagNames
    );
  }

  const existingMap = new Map(existingTags.map(t => [t.name, t.id]));
  const targetTagIds = tagNames.map(name => existingMap.get(name));

  const targetSet = new Set(targetTagIds);
  const currentSet = new Set(currentTagIds);

  const toDelete = currentTagIds.filter(id => !targetSet.has(id));
  const toInsert = targetTagIds.filter(id => !currentSet.has(id));

  if (toDelete.length > 0) {
    const deletePlaceholders = toDelete.map(() => '?').join(',');
    await query(
      `DELETE FROM novel_tags WHERE novel_id = ? AND tag_id IN (${deletePlaceholders})`,
      [novelId, ...toDelete]
    );
  }

  if (toInsert.length > 0) {
    const values = toInsert.map(tagId => `(${novelId}, ${tagId}, NOW())`).join(',');
    await query(
      `INSERT INTO novel_tags (novel_id, tag_id, created_at) VALUES ${values}`
    );
  }
};