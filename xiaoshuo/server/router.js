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
                    phone: result[0].phone,
                    email: result[0].email
                }, secretKey.secretKey)
                res.send({
                    token,
                    result: result[0],
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


//用户信息（个人主页）
router.get('/user', (req, res) => {
    const { token } = req.query;

    const decoded = jwt.decode(token);
    const phone = decoded.phone;
    const email = decoded.email;

    // 判断是否提供查询条件
    if (!phone && !email) {
        return res.status(400).send({
            status: 400,
            msg: '请提供 phone 或 email 作为查询条件'
        });
    }

    // 构建 SQL 条件
    let sql = 'SELECT * FROM user WHERE ';
    const params = [];

    if (phone) {
        sql += 'phone = ?';
        params.push(phone);
    }

    if (email) {
        if (phone) {
            sql += ' AND ';
        }
        sql += 'email = ?';
        params.push(email);
    }

    sqlFn(sql, params, result => {
        if (result.length === 0) {
            res.send({
                status: 404,
                msg: '未找到用户',
                result: []
            });
        } else {
            res.send({
                status: 200,
                msg: '获取成功',
                result: result[0] || null
            });
        }
    });
});
//关注、粉丝
router.get('/follow', (req, res) => {
    const { token } = req.query;

    const decoded = jwt.decode(token);
    const userId = decoded.uid;

    //获取关注列表
    const followingSql = `
        SELECT 
            u.id,
            u.phone,
            u.email,
            u.nick
        FROM user_follow uf
        INNER JOIN user u ON uf.followee_id = u.id
        WHERE uf.follower_id = ?
    `;

    //获取粉丝列表
    const followersSql = `
        SELECT 
            u.id,
            u.phone,
            u.email,
            u.nick
        FROM user_follow uf
        INNER JOIN user u ON uf.follower_id = u.id
        WHERE uf.followee_id = ?
    `;

    //获取关注列表
    sqlFn(followingSql, [userId], (followingResult) => {
        //获取粉丝列表
        sqlFn(followersSql, [userId], (followersResult) => {
            //处理关注列表数据
            const following = (followingResult || []).map(item => ({
                id: item.id,
                phone: item.phone,
                email: item.email,
                nick: item.nick,
                follow_time: item.follow_time
            }));
            //处理粉丝列表数据
            const followers = (followersResult || []).map(item => ({
                id: item.id,
                phone: item.phone,
                email: item.email,
                nick: item.nick,
                follow_time: item.follow_time
            }));

            res.send({
                status: 200,
                msg: '获取成功',
                data: {
                    following: following,
                    followers: followers,
                    followingCount: following.length,
                    followersCount: followers.length
                }
            });
        });
    });
});
//点赞
router.get('/like', (req, res) => {
    const { token } = req.query;

    const decoded = jwt.decode(token);
    const userId = decoded.uid;

    // 获取用户评论及每条评论获赞数
    const userCommentsSql = `
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
    // 获取用户收到的总点赞数
    const totalLikesSql = `
        SELECT 
            COUNT(cl.id) AS total_likes
        FROM comments c
        LEFT JOIN comment_likes cl ON cl.comment_id = c.id
        WHERE c.user_id = ?
    `;

    sqlFn(userCommentsSql, [userId], (commentsResult) => {
        sqlFn(totalLikesSql, [userId], (totalResult) => {
            const comments = (commentsResult || []).map(item => ({
                commentId: item.comment_id,
                content: item.content,
                likeCount: item.like_count,
                user: {
                    id: item.commenter_id,
                    nick: item.nick,
                    phone: item.phone,
                    email: item.email
                }
            }));

            const totalLikes = totalResult && totalResult[0] ? totalResult[0].total_likes : 0;

            res.send({
                status: 200,
                msg: '获取成功',
                data: {
                    totalLikes,
                    comments
                }
            });
        });
    });
});
//用户评论数
router.get('/commentsCount', (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).send({ status: 400, msg: '请提供 token' });
    const decoded = jwt.decode(token);
    const { phone, email } = decoded;
    if (!phone && !email) {
        return res.status(400).send({ status: 400, msg: '请提供 phone 或 email' });
    }
    // 构建用户查询条件
    const conditions = [];
    const params = [];
    if (phone) {
        conditions.push('phone = ?');
        params.push(phone);
    }
    if (email) {
        conditions.push('email = ?');
        params.push(email);
    }
    const userSql = `SELECT id FROM user WHERE ${conditions.join(' OR ')}`;

    sqlFn(userSql, params, users => {
        if (users.length === 0) {
            return res.status(404).send({
                status: 404,
                msg: '未找到用户',
                result: { total_comments: 0 }
            });
        }
        const userId = users[0].id;
        const countSql = 'SELECT COUNT(*) AS total FROM comments WHERE user_id = ?';
        sqlFn(countSql, [userId], countResult => {
            const total = countResult[0]?.total || 0;
            res.send({
                status: 200,
                msg: '获取成功',
                result: { total_comments: total }
            });
        });
    });
});
//用户评论
router.get('/comments', (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send({ status: 400, msg: '请提供 token' });
    }

    const decoded = jwt.decode(token);
    if (!decoded) {
        return res.status(401).send({ status: 401, msg: '无效的 token' });
    }
    const { phone, email } = decoded;

    const userSql = `SELECT id FROM user WHERE phone = ? OR email = ?`;
    sqlFn(userSql, [phone, email], users => {
        if (users.length === 0) {
            return res.status(404).send({
                status: 404,
                msg: '未找到用户',
                result: []
            });
        }
        const userId = users[0].id;

        const commentsSql = `
            SELECT
                c.id,
                u.nick AS nickname,
                c.content,
                n.title AS novel,
                c.created_at AS time,
                parent_user.nick AS parentAuthor,
                (SELECT COUNT(*) FROM comment_likes cl WHERE cl.comment_id = c.id) AS likes,
                (SELECT COUNT(*) FROM comments r WHERE r.parent_id = c.id) AS replies
            FROM
                comments c
            JOIN
                user u ON c.user_id = u.id
            JOIN
                novels n ON c.novel_id = n.id
            LEFT JOIN
                comments parent_comment ON c.parent_id = parent_comment.id
            LEFT JOIN
                user parent_user ON parent_comment.user_id = parent_user.id
            WHERE
                c.user_id = ?
            ORDER BY
                c.created_at DESC;
        `;

        sqlFn(commentsSql, [userId], (results) => {
            // 日期格式化函数
            const formatDate = (isoString) => {
                const date = new Date(isoString);
                if (isNaN(date.getTime())) return isoString; // 无效日期保持原样

                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');

                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            };

            const formattedResults = results.map(item => {
                return {
                    id: item.id,
                    nickname: item.nickname,
                    content: item.content,
                    novel: item.novel,
                    time: formatDate(item.time), // 应用日期格式化
                    stats: [
                        `👍 ${item.likes}`,
                        `💬 ${item.replies}`
                    ],
                    parentAuthor: item.parentAuthor
                };
            });

            res.send({
                status: 200,
                msg: '获取用户评论成功',
                result: formattedResults
            });
        });
    });
});
//用户评论的回复
router.get('/childComments', (req, res) => {
    let { parentId } = req.query;
    parentId = Number(parentId);
    if (!parentId) {
        return res.status(400).json({ error: '缺少parentId参数' });
    }

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return isoString;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const query = `
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
    LEFT JOIN user pu ON pc.user_id = pu.id;
    `;

    sqlFn(query, [parentId], (result) => {
        const formattedComments = result.map((comment) => ({
            id: comment.id,
            nickname: comment.nickname,
            content: comment.content,
            time: formatDate(comment.created_at),
            parentAuthor: comment.parentAuthor || null
        }));

        res.json({
            status: 200,
            msg: '获取评论回复成功',
            result: formattedComments,
        });
    });
});
//收藏小说数和小说名称列表
router.get('/collectCount', (req, res) => {
    const { token } = req.query;

    if (!token) return res.status(400).send({ status: 400, msg: '请提供 token' });

    const decoded = jwt.decode(token);
    const { phone, email } = decoded;

    if (!phone && !email) {
        return res.status(400).send({ status: 400, msg: '请提供 phone 或 email' });
    }

    const conditions = [];
    const params = [];

    if (phone) {
        conditions.push('phone = ?');
        params.push(phone);
    }
    if (email) {
        conditions.push('email = ?');
        params.push(email);
    }

    const userSql = `SELECT id FROM user WHERE ${conditions.join(' OR ')}`;

    sqlFn(userSql, params, users => {
        if (users.length === 0) {
            return res.status(404).send({
                status: 404,
                msg: '未找到用户',
                result: { total_collects: 0, novel_titles: [] }
            });
        }

        const userId = users[0].id;

        //查询收藏数量和小说名称列表
        const countSql = `
            SELECT n.title 
            FROM user_collect uc 
            JOIN novels n ON uc.novel_id = n.id 
            WHERE uc.user_id = ?
        `;

        sqlFn(countSql, [userId], collectResult => {
            const total = collectResult.length;
            const titles = collectResult.map(item => item.title);

            res.send({
                status: 200,
                msg: '获取成功',
                result: {
                    total_collects: total,
                    novel_titles: titles
                }
            });
        });
    });
});
//收藏小说
router.get('/collect', (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send({ status: 400, msg: '请提供 token' });
    }

    const decoded = jwt.decode(token);
    if (!decoded) {
        return res.status(401).send({ status: 401, msg: '无效的 token' });
    }
    const { phone, email } = decoded;

    const userSql = `SELECT id FROM user WHERE phone = ? OR email = ?`;
    sqlFn(userSql, [phone, email], users => {
        if (users.length === 0) {
            return res.status(404).send({
                status: 404,
                msg: '未找到用户',
                result: []
            });
        }
        const userId = users[0].id;

        const collectsSql = `
            SELECT
                n.id,
                n.cover,
                n.title,
                n.author,
                n.hot,
                n.chapters,
                n.description,
                GROUP_CONCAT(DISTINCT t.name) AS tags,
                IFNULL(AVG(us.score), 0) AS average_score
            FROM
                user_collect uc
            JOIN
                novels n ON uc.novel_id = n.id
            LEFT JOIN
                novel_tags nt ON n.id = nt.novel_id
            LEFT JOIN
                tags t ON nt.tag_id = t.id
            LEFT JOIN
                user_score us ON n.id = us.novel_id
            WHERE
                uc.user_id = ?
            GROUP BY
                n.id
            ORDER BY
                uc.created_at DESC;
        `;

        sqlFn(collectsSql, [userId], (results) => {
            const formattedResults = results.map(item => ({
                cover: item.cover,
                title: item.title,
                author: item.author,
                stats: [
                    `🔥 ${(item.hot / 10000).toFixed(1)}万`,
                    `📖 ${item.chapters}章`,
                    `⭐ ${parseFloat(item.average_score).toFixed(1)}评分`
                ],
                tag: item.tags ? item.tags.split(",") : [],
                desc: item.description,
            }));

            res.send({
                status: 200,
                msg: '获取用户收藏小说成功',
                result: formattedResults
            });
        });
    });
});
//历史阅读数
router.get('/historyCount', (req, res) => {
    const { token } = req.query;

    if (!token) return res.status(400).send({ status: 400, msg: '请提供 token' });

    const decoded = jwt.decode(token);
    const { phone, email } = decoded;

    if (!phone && !email) {
        return res.status(400).send({ status: 400, msg: '请提供 phone 或 email' });
    }

    const conditions = [];
    const params = [];

    if (phone) {
        conditions.push('phone = ?');
        params.push(phone);
    }
    if (email) {
        conditions.push('email = ?');
        params.push(email);
    }

    const userSql = `SELECT id FROM user WHERE ${conditions.join(' OR ')}`;

    sqlFn(userSql, params, users => {
        if (users.length === 0) {
            return res.status(404).send({
                status: 404,
                msg: '未找到用户',
                result: { total_reading: 0, novel_titles: [] }
            });
        }

        const userId = users[0].id;

        // 查询历史阅读数量和小说名称列表
        const countSql = `
            SELECT n.title 
            FROM user_reading_list rl
            JOIN novels n ON rl.novel_id = n.id
            WHERE rl.user_id = ?
        `;

        sqlFn(countSql, [userId], readingResult => {
            const total = readingResult.length;
            const titles = readingResult.map(item => item.title);

            res.send({
                status: 200,
                msg: '获取成功',
                result: {
                    total_reading: total,
                    novel_titles: titles
                }
            });
        });
    });
});
//历史阅读
router.get('/history', (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send({ status: 400, msg: '请提供 token' });
    }

    const decoded = jwt.decode(token);
    if (!decoded) {
        return res.status(401).send({ status: 401, msg: '无效的 token' });
    }
    const { phone, email } = decoded;

    // 日期格式化函数
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return isoString; // 无效日期保持原样

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const userSql = `SELECT id FROM user WHERE phone = ? OR email = ?`;
    sqlFn(userSql, [phone, email], users => {
        if (users.length === 0) {
            return res.status(404).send({
                status: 404,
                msg: '未找到用户',
                result: []
            });
        }
        const userId = users[0].id;

        const historySql = `
            SELECT
                n.id,
                n.cover,
                n.title,
                n.author,
                n.hot,
                n.chapters,
                n.description,
                GROUP_CONCAT(DISTINCT t.name) AS tags,
                IFNULL(AVG(us.score), 0) AS average_score,
                url.status,
                url.updated_at
            FROM
                user_reading_list url
            JOIN
                novels n ON url.novel_id = n.id
            LEFT JOIN
                novel_tags nt ON n.id = nt.novel_id
            LEFT JOIN
                tags t ON nt.tag_id = t.id
            LEFT JOIN
                user_score us ON n.id = us.novel_id
            WHERE
                url.user_id = ?
            GROUP BY
                n.id
            ORDER BY
                url.updated_at DESC;
        `;

        sqlFn(historySql, [userId], (results) => {
            const formattedResults = results.map(item => ({
                id:item.id,
                cover: item.cover,
                title: item.title,
                author: item.author,
                stats: [
                    `🔥 ${(item.hot / 10000).toFixed(1)}万`,
                    `📖 ${item.chapters}章`,
                    `⭐ ${parseFloat(item.average_score).toFixed(1)}评分`
                ],
                tag: item.tags ? item.tags.split(",") : [],
                desc: item.description,
                updated_at: formatDate(item.updated_at)
            }));

            res.send({
                status: 200,
                msg: '获取用户历史阅读小说成功',
                result: formattedResults
            });
        });
    });
});
//作品数量和作品名
router.get('/worksCount', (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send({ status: 400, msg: '请提供 token' });
    }

    const decoded = jwt.decode(token);
    if (!decoded) {
        return res.status(401).send({ status: 401, msg: '无效的 token' });
    }
    const { phone, email } = decoded;

    const userSql = `SELECT nick FROM user WHERE phone = ? OR email = ?`;
    sqlFn(userSql, [phone, email], users => {
        if (users.length === 0) {
            return res.status(404).send({
                status: 404,
                msg: '未找到用户',
                result: []
            });
        }
        const user = users[0].nick;

        // 查询该用户创作的所有作品
        const worksSql = `
            SELECT
                n.id,
                n.title
            FROM
                novels n
            WHERE
                n.author = ?
        `;

        sqlFn(worksSql, [user], (results) => {
            // 如果没有作品，返回 count 为 0 和空数组
            const works = results.length > 0 ? results.map(item => item.title) : [];
            const count = works.length;

            res.send({
                status: 200,
                msg: '获取用户作品成功',
                result: {
                    count: count,
                    works: works
                }
            });
        });
    });
});

module.exports = router;