const { query } = require('../config');

/**
 * 根据小说ID查询评论总数
 * @param {number} novelId - 小说ID
 * @returns {Promise<Object>} { comment_count: number }
 */
 exports.getCommentCountByNovelId = async (novelId) => {
    const sql = `
        SELECT COUNT(*) as comment_count
        FROM comments
        WHERE novel_id = ?
    `;
    const [result] = await query(sql, [novelId]);
    return result?.comment_count ?? 0;
};

/**
 * 根据用户ID获取用户的评论列表，每条评论包含点赞数
 * @param {number} uid 用户ID
 * @returns {Promise<Array>} 评论列表
 */
exports.getUserCommentsWithLikes = async (uid) => {
    const sql = `
        SELECT 
            c.id AS comment_id,
            c.content,
            c.user_id AS commenter_id,
            u.nick,
            u.phone,
            u.email,
            COUNT(cl.id) AS like_count
        FROM comments c
        INNER JOIN user u ON c.user_id = u.id
        LEFT JOIN comment_likes cl ON cl.comment_id = c.id
        WHERE c.user_id = ?
        GROUP BY c.id
    `;
    const rows = await query(sql, [uid]);
    return rows.map(row => ({
        commentId: row.comment_id,
        content: row.content,
        likeCount: row.like_count,
        user: {
            id: row.commenter_id,
            nick: row.nick,
            phone: row.phone,
            email: row.email
        }
    }));
};

/**
 * 根据用户ID获取用户收到的总点赞数
 * @param {number} uid 用户ID
 * @returns {Promise<number>} 总点赞数
 */
exports.getUserTotalLikes = async (uid) => {
    const sql = `
        SELECT COUNT(cl.id) AS total_likes
        FROM comments c
        LEFT JOIN comment_likes cl ON cl.comment_id = c.id
        WHERE c.user_id = ?
    `;
    const rows = await query(sql, [uid]);
    return rows[0]?.total_likes || 0;
};

/**
 * 获取用户的评论总数
 * @param {number} uid 用户ID
 * @returns {Promise<number>} 评论总数
 */
exports.getUserCommentCount = async (uid) => {
    const sql = 'SELECT COUNT(*) AS total FROM comments WHERE user_id = ?';
    const rows = await query(sql, [uid]);
    return rows[0]?.total || 0;
};

/**
 * 获取用户评论的基本信息（不包含关联数据）
 * @param {number} uid 用户ID
 * @returns {Promise<Array>} 评论列表，包含 id, content, created_at, novel_id, parent_id
 */
exports.getUserCommentsBasic = async (uid) => {
    const sql = `
        SELECT id, content, created_at, novel_id, parent_id
        FROM comments
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;
    return await query(sql, [uid]);
};

/**
 * 批量获取评论的点赞数
 * @param {number[]} commentIds
 * @returns {Promise<Map<number, number>>} 评论ID -> 点赞数
 */
exports.getLikesCountMap = async (commentIds) => {
    if (commentIds.length === 0) return new Map();
    const sql = `
        SELECT comment_id, COUNT(*) AS likes
        FROM comment_likes
        WHERE comment_id IN (?)
        GROUP BY comment_id
    `;
    const rows = await query(sql, [commentIds]);
    const map = new Map();
    rows.forEach(row => map.set(row.comment_id, row.likes));
    return map;
};

/**
 * 批量获取评论的回复数
 * @param {number[]} commentIds
 * @returns {Promise<Map<number, number>>} 评论ID -> 回复数
 */
exports.getRepliesCountMap = async (commentIds) => {
    if (commentIds.length === 0) return new Map();
    const sql = `
        SELECT parent_id, COUNT(*) AS replies
        FROM comments
        WHERE parent_id IN (?)
        GROUP BY parent_id
    `;
    const rows = await query(sql, [commentIds]);
    const map = new Map();
    rows.forEach(row => map.set(row.parent_id, row.replies));
    return map;
};

/**
 * 批量获取父评论的作者昵称
 * @param {number[]} parentIds 父评论ID列表
 * @returns {Promise<Map<number, string>>} 父评论ID -> 作者昵称
 */
exports.getParentAuthorsMap = async (parentIds) => {
    if (parentIds.length === 0) return new Map();
    const sql = `
        SELECT c.id AS parent_id, u.nick AS author_nick
        FROM comments c
        JOIN user u ON c.user_id = u.id
        WHERE c.id IN (?)
    `;
    const rows = await query(sql, [parentIds]);
    const map = new Map();
    rows.forEach(row => map.set(row.parent_id, row.author_nick));
    return map;
};

/**
 * 递归获取指定评论的所有子评论（包括子回复）
 * @param {number} parentId 父评论ID
 * @returns {Promise<Array>} 子评论列表，每条包含 id, user_id, content, created_at, parent_id, nickname, parentAuthor
 */
exports.getCommentReplies = async (parentId) => {
    const sql = `
        WITH RECURSIVE comment_tree AS (
          SELECT 
            c.id,
            c.user_id,
            c.content,
            c.created_at,
            c.parent_id,
            u.nick AS nickname
          FROM comments c
          JOIN user u ON c.user_id = u.id
          WHERE c.parent_id = ?
          UNION ALL
          SELECT 
            c.id,
            c.user_id,
            c.content,
            c.created_at,
            c.parent_id,
            u.nick AS nickname
          FROM comments c
          JOIN comment_tree ct ON c.parent_id = ct.id
          JOIN user u ON c.user_id = u.id
        )
        SELECT 
          ct.*,
          pu.nick AS parentAuthor
        FROM comment_tree ct
        LEFT JOIN comments pc ON ct.parent_id = pc.id
        LEFT JOIN user pu ON pc.user_id = pu.id
        ORDER BY ct.created_at ASC
    `;
    const rows = await query(sql, [parentId]);
    return rows;
};

/**
 * 根据小说ID获取小说的所有评论、点赞数以及评论用户信息
 * @param {number} novelId 小说ID
 * @returns {Promise<Array>} 评论列表
 */
exports.getCommentsByNovelId = async (novelId) => {
    const sql = `
        SELECT 
            c.id AS comment_id,
            c.content,
            c.user_id AS commenter_id,
            c.parent_id,
            c.created_at,
            u.nick,
            u.phone,
            u.email,
            COUNT(cl.id) AS like_count
        FROM comments c
        INNER JOIN user u ON c.user_id = u.id
        LEFT JOIN comment_likes cl ON cl.comment_id = c.id
        WHERE c.novel_id = ?
        GROUP BY c.id
        ORDER BY c.created_at DESC
    `;
    const rows = await query(sql, [novelId]);
    return rows.map(row => ({
        commentId: row.comment_id,
        content: row.content,
        parentId: row.parent_id,
        likeCount: row.like_count,
        createdAt: row.created_at,
        user: {
            id: row.commenter_id,
            nick: row.nick,
            phone: row.phone,
            email: row.email
        }
    }));
};

/**
 * 插入评论，返回新生成的 commentId
 * @param {Object} commentData - 评论数据
 * @param {number} commentData.user_id - 评论用户ID
 * @param {number} commentData.novel_id - 所属小说ID
 * @param {string} commentData.content - 评论内容
 * @param {number|null} [commentData.parent_id=null] - 父评论ID（可选，默认为 null）
 * @returns {Promise<number>} 新插入的评论ID
 */
exports.insertComment = async (commentData) => {
  const { user_id, novel_id, content, parent_id = null } = commentData;
  const sql = `
    INSERT INTO comments 
      (user_id, novel_id, content, created_at, parent_id)
    VALUES (?, ?, ?, NOW(), ?)
  `;
  const result = await query(sql, [user_id, novel_id, content, parent_id]);
  return result.insertId;
};