const express = require("express")
const router = express.Router()
var validator = require('validator')
// 检查 value 是否为一个空对象，集合，映射或者set
var isEmpty = require('lodash/isEmpty')
const sqlFn = require('./config')
const validatorInput = require('../src/utils/validator')
const jwt = require('jsonwebtoken')
const secretKey = require('./secretKey')
const { update, result } = require("lodash")

// 注册
router.post('/register', (req, res) => {
    const { isValid, errors } = validatorInput(req.body)
    if (isValid) {
        res.send({
            errors,
            status: 400
        })
    } else {
        // 写入数据库
        const { phone, email, password, password2 } = req.body
        const sql = 'insert into user values (null,?,?,?)'
        const arr = [phone, email, password]
        sqlFn(sql, arr, result => {
            if (result.affectedRows > 0) {
                res.send({
                    msg: '注册成功',
                    status: 200
                })
            } else {
                res.send({
                    msg: '注册失败',
                    status: 401
                })
            }
        })
    }
})
// 邮箱是否可用
router.get('/repeat/email', (req, res) => {
    const email = req.query.email;

    if (validator.isEmpty(email)) {
        res.send({
            status: 200,
            msg: '邮箱不能为空',
            flag: false
        })
        return
    } else if (!validator.isEmail(email)) {
        res.send({
            status: 200,
            msg: '不符合邮箱格式',
            flag: false
        })
        return
    }

    const sql = 'select * from user where email=?';
    const arr = [email]
    sqlFn(sql, arr, result => {
        if (result.length > 0) {
            res.send({
                status: 200,
                msg: '该邮箱已注册',
                flag: false
            })
        } else {
            res.send({
                status: 200,
                msg: '邮箱可用',
                flag: true
            })
        }
    })
})
// 手机号是否可用
router.get('/repeat/phone', (req, res) => {
    const phone = req.query.phone;

    if (validator.isEmpty(phone)) {
        res.send({
            status: 200,
            msg: '电话号码不能为空',
            flag: false
        })
        return
    }

    const sql = 'select * from user where phone=?';
    const arr = [phone]
    sqlFn(sql, arr, result => {
        if (result.length > 0) {
            res.send({
                status: 200,
                msg: '该手机号已注册',
                flag: false
            })
        } else {
            res.send({
                status: 200,
                msg: '手机号可用',
                flag: true
            })
        }
    })
})
// 密码是否可用
router.get('/repeat/password', (req, res) => {
    const password = req.query.password;

    if (validator.isEmpty(password)) {
        res.send({
            status: 200,
            msg: '密码不能为空',
            flag: false
        })
        return
    }

    res.send({
        status: 200,
        msg: '密码可用',
        flag: true
    })
})
// 重复密码是否可用
router.get('/repeat/password2', (req, res) => {
    const password2 = req.query.password2;
    const password = req.query.password;

    if (validator.isEmpty(password2)) {
        res.send({
            status: 200,
            msg: '密码不能为空',
            flag: false
        })
        return
    } else if (!validator.equals(password, password2)) {
        res.send({
            status: 200,
            msg: '两次密码不相同',
            flag: false
        })
        return
    }
    res.send({
        status: 200,
        msg: '重复密码可用',
        flag: true
    })
})


// 登录
router.post('/login', (req, res) => {
    const { isValid, errors } = validatorInput(req.body)
    if (isValid) {
        res.send({
            errors,
            status: 400
        })
    } else {
        const phone = req.body.username
        const email = req.body.username
        const password = req.body.password
        const sql = 'select * from user where (phone = ? or email = ?) and password = ?'
        const arr = [phone, email, password]
        sqlFn(sql, arr, result => {
            if (result.length > 0) {
                //生成token
                const token = jwt.sign({
                    uid: result[0].id,
                    username: result[0].username
                }, secretKey.secretKey)
                res.send({
                    token,
                    status: 200
                })
            } else {
                res.send({
                    status: 401,
                    msg: '用户名或密码错误'
                })
            }
        })
    }

})
// 用户名是否可用
router.get('/repeat/username', (req, res) => {
    console.log(req)
    const username = req.query.username;
    if (validator.isEmpty(username)) {
        res.send({
            status: 200,
            msg: '用户名不能为空',
            flag: false
        })
        return
    }
    res.send({
        status: 200,
        msg: '用户名可用',
        flag: true
    })
})


//首页列表数据
router.get('/list', (req, res) => {
    //读取token
    const token = req.headers.authorization;
    if (token) {
        res.send({
            list: [
                {
                    id: 1001,
                    name: '测试1'
                },
                {
                    id: 1002,
                    name: '测试2'
                }
            ],
            status: 200
        })
    } else {
        res.send({
            status: 401,
            msg: '请先登录'
        })
    }
})


//小说卡片数据
router.get('/card', (req, res) => {
    const sql = `
    SELECT 
    n.id,
    n.cover,
    n.title,
    n.author,
    n.hot,
    n.chapters,
    n.description,
    n.updated_at,
    GROUP_CONCAT(DISTINCT t.name ORDER BY t.name) AS tags,
    COALESCE(ROUND(AVG(us.score), 1), 0) AS average_score
    FROM novels n
    LEFT JOIN novel_tags nt ON n.id = nt.novel_id
    LEFT JOIN tags t ON t.id = nt.tag_id
    LEFT JOIN user_score us ON n.id = us.novel_id
    GROUP BY n.id;
    `;

    sqlFn(sql, null, result => {
        const data = result.map(item => {
            // Format hot value for display
            let hotDisplay = item.hot;
            if (item.hot >= 10000) {
                hotDisplay = (item.hot / 10000).toFixed(1) + '万'; // e.g., 12.3万
            } else {
                hotDisplay = item.hot;
            }

            return {
                cover: item.cover,
                title: item.title,
                author: item.author,
                stats: [
                    `🔥 ${hotDisplay}`,  // Display formatted hot value
                    `📖 ${item.chapters}章`,
                    `⭐ ${item.average_score}评分`
                ],
                tag: item.tags ? item.tags.split(",") : [],  // Split tags into an array
                desc: item.description,
                update: item.updated_at,
                hot: item.hot,  // Original hot value
                chapters: item.chapters,
                average_score: item.average_score
            };
        });

        res.send({
            status: 200,
            msg: '获取成功',
            data
        });
    });
});


//按名字或作者搜索小说
router.get('/search', (req, res) => {
    const searchKey = req.query.searchKey;
    console.log("搜索关键词：", searchKey);

    const sql = `
    SELECT 
      n.id,
      n.cover,
      n.title,
      n.author,
      n.hot,
      n.chapters,
      n.description,
      n.updated_at,
      GROUP_CONCAT(t.name) AS tags
    FROM novels n
    LEFT JOIN novel_tags nt ON n.id = nt.novel_id
    LEFT JOIN tags t ON t.id = nt.tag_id
    WHERE n.title LIKE CONCAT('%', ?, '%')
       OR n.author LIKE CONCAT('%', ?, '%')
    GROUP BY n.id
  `;

    const params = [searchKey, searchKey];

    sqlFn(sql, params, result => {
        const data = result.map(item => ({
            cover: item.cover,
            title: item.title,
            author: item.author,
            stats: [
                `🔥 ${(item.hot / 10000).toFixed(1)}万`,
                `📖 ${item.chapters}章`
            ],
            tag: item.tags ? item.tags.split(",") : [],
            desc: item.description,
            update: item.updated_at,
            hot: item.hot,
            chapters: item.chapters,
        }));

        res.send({
            status: 200,
            msg: '搜索成功',
            result: data
        });
    });
});


//热度排行
router.get('/hot', (req, res) => {
    const sql = `
        SELECT 
            n.id,
            n.cover,
            n.title,
            n.author,
            n.hot,
            n.chapters,
            n.description,
            COALESCE(ROUND(AVG(us.score),1),0) AS average_score,
            n.updated_at,
            GROUP_CONCAT(DISTINCT t.name ORDER BY t.name) AS tags
        FROM novels n
        LEFT JOIN novel_tags nt ON n.id = nt.novel_id
        LEFT JOIN tags t ON t.id = nt.tag_id
        LEFT JOIN user_score us ON n.id = us.novel_id
        GROUP BY n.id
        ORDER BY n.hot DESC

    `;

    sqlFn(sql, null, result => {
        const data = result.map((item, index) => {
            let hotDisplay = item.hot;
            if (item.hot >= 10000) {
                hotDisplay = (item.hot / 10000).toFixed(1) + '万';
            }

            return {
                cover: item.cover,
                title: item.title,
                author: item.author,
                stats: [
                    `🔥 ${(item.hot / 10000).toFixed(1)}万`,
                    `📖 ${item.chapters}章`,
                    `⭐ ${item.average_score}评分`
                ],
                tag: item.tags ? item.tags.split(",") : [],
                desc: item.description,
                update: item.updated_at,
                rank: index + 1,
                hot: hotDisplay,
                chapters: item.chapters,
                average_score: item.average_score
            };
        });

        res.send({
            status: 200,
            msg: '获取成功',
            data
        });
    });
});


//更新时间排行
router.get('/latest', (req, res) => {
    function formatTimeAgo(datetime) {
        const now = new Date();
        const updated = new Date(datetime);
        const diff = Math.floor((now - updated) / 1000); // 秒

        if (diff < 60) return `${diff}秒前`;
        if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
        return `${Math.floor(diff / 86400)}天前`;
    }
    const sql = `
        SELECT 
        n.id,
        n.title,
        n.author,
        n.description,
        n.updated_at
        FROM novels n
        ORDER BY n.updated_at DESC
    `;

    sqlFn(sql, null, result => {
        const data = result.map(item => ({
            title: item.title,
            author: item.author,
            desc: item.description,
            update: formatTimeAgo(item.updated_at)
        }));

        res.send({
            status: 200,
            msg: '获取成功',
            data
        });
    });
});


//tag数组
router.get('/tags', (req, res) => {
    const sql = `SELECT name FROM tags`;

    sqlFn(sql, null, result => {
        const tagsArray = result.map(item => item.name);
        res.send({
            status: 200,
            msg: '获取成功',
            tagsArray
        });
    });
});


//收藏排行
router.get('/collects', (req, res) => {
    const sql = `
        SELECT 
            n.id,
            n.cover,
            n.title,
            n.author,
            n.hot,
            n.chapters,
            n.description,
            GROUP_CONCAT(DISTINCT t.name) AS tags,
            COUNT(DISTINCT uc.id) AS collect_count,
            COALESCE(ROUND(AVG(us.score), 1), 0) AS average_score
        FROM novels n
        LEFT JOIN user_collect uc ON n.id = uc.novel_id
        LEFT JOIN user_score us ON n.id = us.novel_id
        LEFT JOIN novel_tags nt ON n.id = nt.novel_id
        LEFT JOIN tags t ON nt.tag_id = t.id
        GROUP BY n.id
        ORDER BY collect_count DESC;
    `;

    sqlFn(sql, null, result => {
        const data = result.map(item => {
            // 格式化收藏数
            const formattedCollect = item.collect_count >= 10000 
                ? `${(item.collect_count / 10000).toFixed(1)}万` 
                : `${item.collect_count}`;

            return {
                cover: item.cover || '暂无封面',
                title: item.title || '暂无标题',
                author: item.author || '未知作者',
                stats: [
                    `🔥 ${item.hot ? (item.hot / 10000).toFixed(1) + '万' : '0'}`,
                    `📖 ${item.chapters || 0}章`,
                    `⭐ ${item.average_score || 0}评分`
                ],
                tag: item.tags ? item.tags.split(',') : [],
                desc: item.description || '暂无简介',
                collects: formattedCollect
            };
        });

        res.send({
            status: 200,
            msg: '获取成功',
            data
        });
    });
});


//小说平均分排行
router.get('/score', (req, res) => {
    const sql = `
        SELECT 
            n.id,
            n.cover,
            n.title,
            n.author,
            n.hot,
            n.chapters,
            n.description,
            GROUP_CONCAT(DISTINCT t.name) AS tags,
            COUNT(DISTINCT uc.id) AS collect_count,
            COALESCE(ROUND(AVG(us.score), 1), 0) AS average_score
        FROM novels n
        LEFT JOIN user_score us ON n.id = us.novel_id
        LEFT JOIN user_collect uc ON n.id = uc.novel_id
        LEFT JOIN novel_tags nt ON n.id = nt.novel_id
        LEFT JOIN tags t ON nt.tag_id = t.id
        GROUP BY n.id
        ORDER BY average_score DESC;

    `;

    sqlFn(sql, null, result => {
        const data = result.map(item => {
            const avgScore = Number(item.average_score) || 0;
            return {
                cover: item.cover || '暂无封面',
                title: item.title || '暂无标题',
                author: item.author || '未知作者',
                stats: [
                    `🔥 ${item.hot ? (item.hot / 10000).toFixed(1) + '万' : '0'}`,
                    `📖 ${item.chapters || 0}章`,
                    `⭐ ${avgScore.toFixed(1)}评分`
                ],
                tag: item.tags ? item.tags.split(',') : [],
                desc: item.description || '暂无简介',
                score: avgScore.toFixed(1)
            };
        });


        res.send({
            status: 200,
            msg: '获取成功',
            data
        });
    });
});


//完结热度排行
router.get('/finished', (req, res) => {
    const sql = `
        SELECT 
            n.id,
            n.cover,
            n.title,
            n.author,
            n.hot,
            n.chapters,
            n.description,
            COALESCE(ROUND(AVG(us.score),1),0) AS average_score,
            n.updated_at,
            GROUP_CONCAT(DISTINCT t.name) AS tags
        FROM novels n
        LEFT JOIN novel_tags nt ON n.id = nt.novel_id
        LEFT JOIN tags t ON t.id = nt.tag_id
        LEFT JOIN user_score us ON n.id = us.novel_id
        GROUP BY n.id
        HAVING tags LIKE '%完结%'
        ORDER BY n.hot DESC
    `;

    sqlFn(sql, null, result => {
        const data = result.map((item, index) => {
            let hotDisplay = item.hot;
            if (item.hot >= 10000) {
                hotDisplay = (item.hot / 10000).toFixed(1) + '万';
            }

            return {
                cover: item.cover,
                title: item.title,
                author: item.author,
                stats: [
                    `🔥 ${(item.hot / 10000).toFixed(1)}万`,
                    `📖 ${item.chapters}章`,
                    `⭐ ${item.average_score}评分`
                ],
                tag: item.tags ? item.tags.split(",") : [],
                desc: item.description,
                update: item.updated_at,
                rank: index + 1,
                hot: hotDisplay,
                chapters: item.chapters,
                average_score: item.average_score
            };
        });

        res.send({
            status: 200,
            msg: '获取成功',
            data
        });
    });
});


module.exports = router;