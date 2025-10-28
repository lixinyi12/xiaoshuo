const mysql = require('mysql2');

// 创建数据库连接
const client = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yiliya0817',
    database: 'xiaoshuo'
});

// 连接成功后，立即关闭 ONLY_FULL_GROUP_BY 模式
client.connect((err) => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    console.log('数据库连接成功');

    // 执行关闭 ONLY_FULL_GROUP_BY 的 SQL
    client.query("SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))", (err) => {
        if (err) {
            console.error('关闭 ONLY_FULL_GROUP_BY 失败:', err);
        } else {
            console.log('已成功关闭 ONLY_FULL_GROUP_BY 模式');
        }
    });
});

// 封装查询函数
module.exports = function sqlFn(sql, arr, callback) {
    client.query(sql, arr, (error, result) => {
        if (error) {
            console.error('查询错误:', error);
            return;
        }
        callback(result);
    });
};