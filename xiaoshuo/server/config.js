const mysql = require('mysql2')
const client = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yiliya0817',
    database: 'xiaoshuo'
})

// 执行数据库语句
// sql:数据库语句
// arr:数据库语句参数
// callback:响应结果的回调函数(error,result)
module.exports = function sqlFn(sql, arr, callback) {
    client.query(sql, arr, (error, result) => {
        if (error) {
            console.error(error)
            return;
        }
        callback(result)
    })
}