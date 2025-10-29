const mysql = require('mysql2');

// 创建数据库连接
const client = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'lixinyi7101347',
    database:'xiaoshuo'
});

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

// 执行数据库语句
// sql:数据库语句
// arr:数据库语句参数
// callback:响应结果的回调函数(error,result)
module.exports = function sqlFn(sql, arr, callback) {
    client.query(sql, arr, (error, result) => {
        if (error) {
            console.error('查询错误:', error);
            return;
        }
        callback(result);
    });
};
