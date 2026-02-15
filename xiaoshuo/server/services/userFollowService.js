const { query } = require('../config');

/**
 * 获取用户的关注列表
 * @param {number} uid 用户ID
 * @returns {Promise<Array>} 关注列表
 */
exports.getFollowingList = async (uid) => {
    const sql = `
        SELECT *, uf.created_at AS follow_time
        FROM user_follow uf
        INNER JOIN user u ON uf.followee_id = u.id
        WHERE uf.follower_id = ?
    `;
    const rows = await query(sql, [uid]);
    return rows || [];
};

/**
 * 获取关注人数
 * @param {number} uid 用户ID
 * @returns {Promise<number>}
 */
exports.getFollowingCount = async (uid) => {
    const sql = `SELECT COUNT(*) AS count FROM user_follow WHERE follower_id = ?`;
    const [result] = await query(sql, [uid]);
    return result?.count || 0;
};

/**
 * 获取用户的粉丝列表
 * @param {number} uid 用户ID
 * @returns {Promise<Array>} 粉丝列表
 */
exports.getFollowersList = async (uid) => {
    const sql = `
        SELECT 
            u.id,
            u.phone,
            u.email,
            u.nick,
            uf.created_at AS follow_time
        FROM user_follow uf
        INNER JOIN user u ON uf.follower_id = u.id
        WHERE uf.followee_id = ?
    `;
    const rows = await query(sql, [uid]);
    return rows || [];
};

/**
 * 获取粉丝人数
 * @param {number} uid 用户ID
 * @returns {Promise<number>}
 */
exports.getFollowersCount = async (uid) => {
    const sql = `SELECT COUNT(*) AS count FROM user_follow WHERE followee_id = ?`;
    const [result] = await query(sql, [uid]);
    return result?.count || 0;
};

/**
 * 切换关注状态（关注/取消关注）
 * @param {number} followerId 关注者
 * @param {number} followeeId 被关注者
 * @returns {Promise<string>} 'follow' 或 'unfollow'
 */
exports.toggleFollow = async (followerId, followeeId) => {
    const userCheckSql = `SELECT id FROM user WHERE id IN (?, ?)`;
    const [userRows] = await query(userCheckSql, [followerId, followeeId]);
    if (userRows.length < 2) {
        throw new Error('用户不存在');
    }

    // 检查是否已关注
    const checkSql = `SELECT * FROM user_follow WHERE follower_id=? AND followee_id=?`;
    const [existRows] = await query(checkSql, [followerId, followeeId]);

    if (existRows.length > 0) {
        // 取消关注
        const deleteSql = `DELETE FROM user_follow WHERE follower_id=? AND followee_id=?`;
        await query(deleteSql, [followerId, followeeId]);
        return 'unfollow';
    } else {
        // 添加关注
        const insertSql = `INSERT INTO user_follow VALUES (null, ?, ?)`;
        await query(insertSql, [followerId, followeeId]);
        return 'follow';
    }
};