const {query} = require('../../config'); // MySQL 连接池

module.exports = {
    async onLoadDocument({ documentName }) {
        // 从数据库加载已有内容
        const [rows] = await query(
            'SELECT content FROM documents WHERE name = ?',
            [documentName]
        );
        if (rows.length > 0) {
            // 返回 Y.Doc 的二进制快照（需存储时序列化，加载时反序列化）
            return Y.encodeStateAsUpdate(new Y.Doc()); // 实际需将 content 转为更新
        }
        return null;
    },

    async onStoreDocument({ documentName, state }) {
        // state 是 Y.Doc 的二进制更新（Buffer）
        // 可以存储到 MySQL（使用 BLOB 类型）
        await query(
            'INSERT INTO documents (name, content, updated_at) VALUES (?, ?, NOW()) ' +
            'ON DUPLICATE KEY UPDATE content = ?, updated_at = NOW()',
            [documentName, state, state]
        );
    }
};