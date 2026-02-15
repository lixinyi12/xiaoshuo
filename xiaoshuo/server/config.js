const mysql = require('mysql2');

const client = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'lixinyi7101347',
    database: 'novel_reading_system'
});

client.connect((err) => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    console.log('数据库连接成功');
    client.query("SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))", (err) => {
        if (err) console.error('关闭 ONLY_FULL_GROUP_BY 失败:', err);
        else console.log('已成功关闭 ONLY_FULL_GROUP_BY 模式');
    });
});

function sqlFn(sql, arr, callback) {
    client.query(sql, arr, (error, result) => {
        if (error) {
            console.error('查询错误:', error);
            return;
        }
        callback(result);
    });
}

function sqlFnPromise(sql, arr) {
    return new Promise((resolve, reject) => {
        client.query(sql, arr, (error, result) => {
            if (error) {
                console.error('查询错误:', error);
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = sqlFn;
module.exports.query = sqlFnPromise;