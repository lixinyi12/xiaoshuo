const { verifyToken } = require('../../utils/token')
module.exports = async ({ token, documentName: documentTitle }) => {
    try {
        // 验证 token 获取用户信息
        const decoded = verifyToken(token);
        const userId = decoded.uid;

        // 查询文档信息
        const [doc] = await db.query(
            'SELECT id, user_id FROM documents WHERE title = ?',
            [documentTitle]
        );
        if (!doc) {
            throw new Error('Document not found');
        }

        // 检查是否为文档所有者
        if (doc.user_id === userId) {
            return { userId, roles: decoded.roles };
        }

        // 查找该文档的协作空间
        const [space] = await db.query(
            'SELECT id FROM collaboration_spaces WHERE novel_id = ?',
            [doc.id]
        );
        if (space) {
            // 检查用户是否是该空间的成员
            const [member] = await db.query(
                'SELECT id FROM collaboration_members WHERE space_id = ? AND user_id = ?',
                [space.id, userId]
            );
            if (member) {
                return { userId, roles: decoded.roles };
            }
        }

        // 无权限
        throw new Error('Unauthorized');
    } catch (error) {
        // 任何错误（token无效、数据库异常、无权限等）均拒绝连接
        throw new Error('Unauthorized');
    }
};