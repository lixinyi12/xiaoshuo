const express = require("express")
const router = express.Router()
const sqlFn = require('../config')
const validatorInput = require('../../src/utils/validator')
const formatDate = require('../../src/utils/date')
const moment = require('moment')
const { decodeToken } = require("../utils/token")

// 用户信息（个人主页）
router.get('/user', (req, res) => {
    const { token } = req.query;

    const { uid, phone, email } = decodeToken(token)

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
            const date = result[0].birthday;
            const formattedDate = moment(date).format('YYYY-MM-DD');
            result[0].birthday = formattedDate;
            res.send({
                status: 200,
                msg: '获取成功',
                result: result[0] || null
            });
        }
    });
});

// 关注、粉丝
router.get('/follow', (req, res) => {
    const { token } = req.query;

    const { uid, phone, email } = decodeToken(token)

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
    sqlFn(followingSql, [uid], (followingResult) => {
        //获取粉丝列表
        sqlFn(followersSql, [uid], (followersResult) => {
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

// 点赞
router.get('/like', (req, res) => {
    const { token } = req.query;

    const { uid, phone, email } = decodeToken(token)

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

    sqlFn(userCommentsSql, [uid], (commentsResult) => {
        sqlFn(totalLikesSql, [uid], (totalResult) => {
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

// 用户评论数
router.get('/commentsCount', (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).send({ status: 400, msg: '请提供 token' });
    const { uid, phone, email } = decodeToken(token)
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

// 用户评论
router.get('/comments', (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send({ status: 400, msg: '请提供 token' });
    }

    const { uid, phone, email } = decodeToken(token)

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

// 用户评论的回复
router.get('/childComments', (req, res) => {
    let { parentId } = req.query;
    parentId = Number(parentId);
    if (!parentId) {
        return res.status(400).json({ error: '缺少parentId参数' });
    }

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

// 收藏小说数和小说名称列表
router.get('/collectCount', (req, res) => {
    const { token } = req.query;

    if (!token) return res.status(400).send({ status: 400, msg: '请提供 token' });

    const { uid, phone, email } = decodeToken(token)

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

// 获取收藏小说信息
router.get('/collect', (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send({ status: 400, msg: '请提供 token' });
    }

    const { uid, phone, email } = decodeToken(token)

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
                (
                    SELECT COUNT(*) 
                    FROM chapters c 
                    WHERE c.novel_id = n.id
                ) as chapters,
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

// 历史阅读数
router.get('/historyCount', (req, res) => {
    const { token } = req.query;

    if (!token) return res.status(400).send({ status: 400, msg: '请提供 token' });

    const { uid, phone, email } = decodeToken(token)

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

// 历史阅读
router.get('/history', (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send({ status: 400, msg: '请提供 token' });
    }

    const { uid, phone, email } = decodeToken(token)

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
                (
                    SELECT COUNT(*) 
                    FROM chapters c 
                    WHERE c.novel_id = n.id
                ) as chapters,
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
                id: item.id,
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

// 作品数量和作品名
router.get('/worksCount', (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send({ status: 400, msg: '请提供 token' });
    }

    const { uid, phone, email } = decodeToken(token)

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

// 关注、粉丝信息
router.get('/followFan', (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).send({
            status: 400,
            msg: '请提供 token'
        });
    }

    const { uid, phone, email } = decodeToken(token)

    if (!phone && !email) {
        return res.status(400).send({
            status: 400,
            msg: '请提供 phone 或 email 作为查询条件'
        });
    }

    // 先获取用户 id
    let userSql = 'SELECT id FROM user WHERE ';
    const params = [];
    if (phone) {
        userSql += 'phone = ?';
        params.push(phone);
    }
    if (email) {
        if (phone) userSql += ' AND ';
        userSql += 'email = ?';
        params.push(email);
    }

    sqlFn(userSql, params, userResult => {
        if (userResult.length === 0) {
            return res.send({
                status: 404,
                msg: '未找到用户',
                result: []
            });
        }

        const userId = userResult[0].id;

        // 获取粉丝信息
        const fanSql = `
            SELECT u.nick, u.desc, u.id
            FROM user_follow uf
            JOIN user u ON uf.follower_id = u.id
            WHERE uf.followee_id = ?
        `;

        // 获取关注的人信息
        const followSql = `
            SELECT u.nick, u.desc, u.id
            FROM user_follow uf
            JOIN user u ON uf.followee_id = u.id
            WHERE uf.follower_id = ?
        `;

        sqlFn(fanSql, [userId], fanResult => {
            sqlFn(followSql, [userId], followResult => {
                res.send({
                    status: 200,
                    msg: '获取成功',
                    result: {
                        fans: fanResult,
                        following: followResult
                    }
                });
            });
        });
    });
});

// 关注/取消关注
router.post('/follows', (req, res) => {
    const { follower_id, followee_id } = req.body;

    // 检查参数
    if (!follower_id || !followee_id) {
        return res.send({
            msg: '缺少必要参数',
            status: 400
        });
    }

    if (follower_id === followee_id) {
        return res.send({
            msg: '不能关注自己',
            status: 400
        });
    }

    // 检查用户是否存在
    const getUserSql = 'SELECT id FROM user WHERE id IN (?, ?)';
    sqlFn(getUserSql, [follower_id, followee_id], result => {
        if (result.length < 2) {
            return res.send({
                msg: '用户不存在',
                status: 404
            });
        }

        // 检查是否已关注
        const checkSql = 'SELECT * FROM user_follow WHERE follower_id=? AND followee_id=?';
        sqlFn(checkSql, [follower_id, followee_id], checkResult => {
            if (checkResult.length > 0) {
                // 已关注 -> 取消关注
                const deleteSql = 'DELETE FROM user_follow WHERE follower_id=? AND followee_id=?';
                sqlFn(deleteSql, [follower_id, followee_id], deleteResult => {
                    if (deleteResult.affectedRows > 0) {
                        res.send({
                            msg: '取消关注成功',
                            status: 200
                        });
                    } else {
                        res.send({
                            msg: '取消关注失败',
                            status: 500
                        });
                    }
                });
            } else {
                // 未关注 -> 执行关注
                const insertSql = 'INSERT INTO user_follow VALUES (null, ?, ?)';
                sqlFn(insertSql, [follower_id, followee_id], insertResult => {
                    if (insertResult.affectedRows > 0) {
                        res.send({
                            msg: '关注成功',
                            status: 200
                        });
                    } else {
                        res.send({
                            msg: '关注失败',
                            status: 500
                        });
                    }
                });
            }
        });
    });
});

// 作品
router.get('/works', (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send({ status: 400, msg: '请提供 token' });
    }

    const { uid, phone, email } = decodeToken(token)

    const userSql = `SELECT id, nick FROM user WHERE phone = ? OR email = ?`;
    sqlFn(userSql, [phone, email], users => {
        if (users.length === 0) {
            return res.status(404).send({
                status: 404,
                msg: '未找到用户',
                result: []
            });
        }
        const userId = users[0].id;
        const userNick = users[0].nick;

        // 查询用户所有发布的小说
        const novelsSql = `
            SELECT
                n.id,
                n.cover,
                n.title,
                n.author,
                n.hot,
                (
                    SELECT COUNT(*) 
                    FROM chapters c 
                    WHERE c.novel_id = n.id
                ) as chapters,
                n.description,
                GROUP_CONCAT(DISTINCT t.name) AS tags,
                IFNULL(AVG(us.score), 0) AS average_score
            FROM
                novels n
            LEFT JOIN
                novel_tags nt ON n.id = nt.novel_id
            LEFT JOIN
                tags t ON nt.tag_id = t.id
            LEFT JOIN
                user_score us ON n.id = us.novel_id
            WHERE
                n.author = ?  -- 获取该用户发布的所有小说，确认author对应的是user.nick
            GROUP BY
                n.id
            ORDER BY
                n.created_at DESC;  -- 按时间降序排列
        `;

        sqlFn(novelsSql, [userNick], (results) => {
            if (results.length === 0) {
                return res.status(404).send({
                    status: 404,
                    msg: '没有找到该用户发布的小说',
                    result: []
                });
            }

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
                msg: '获取用户作品成功',
                result: formattedResults
            });
        });
    });
});

// 修改个人信息
router.post('/changePersonalInfo', (req, res) => {
    const { nick, phone, email, gender, birthday, desc } = req.body;
    const token = req.headers['authorization'];
    const { uid } = decodeToken(token)

    const valid = validatorInput({
        nick: nick, phone: phone, email: email
    })
    if (valid.isValid) {
        res.send({
            msg: '数据验证失败',
            errors: valid.errors,
            status: 400
        });
        return
    }

    let fields = [];
    let values = [];

    if (nick) { fields.push('nick = ?'); values.push(nick); }
    if (phone) { fields.push('phone = ?'); values.push(phone); }
    if (email) { fields.push('email = ?'); values.push(email); }
    if (gender) { fields.push('gender = ?'); values.push(gender); }
    if (birthday) { fields.push('birthday = ?'); values.push(birthday); }
    if (desc) { fields.push('`desc` = ?'); values.push(desc); }

    const updateSql = `UPDATE user SET ${fields.join(', ')} WHERE id = ?`;
    values.push(uid);

    sqlFn(updateSql, values, updateResult => {
        if (updateResult.affectedRows > 0) {
            res.send({
                msg: '修改成功',
                status: 200
            });
        } else {
            res.send({
                msg: '修改失败',
                status: 400
            });
        }
    });
});

// 添加书架
router.post('/addToShelf', (req, res) => {
    const { userId, novelId } = req.body;

    if (!userId || !novelId) {
        return res.send({
            msg: '缺少必要参数',
            status: 400
        });
    }

    const checkUserSql = 'SELECT id FROM user WHERE id = ?';
    sqlFn(checkUserSql, [userId], userResult => {
        if (userResult.length === 0) {
            return res.send({
                msg: '用户不存在',
                status: 404
            });
        }

        const checkNovelSql = 'SELECT id FROM novels WHERE id = ?';
        sqlFn(checkNovelSql, [novelId], novelResult => {
            if (novelResult.length === 0) {
                return res.send({
                    msg: '小说不存在',
                    status: 404
                });
            }

            // 检查是否已收藏
            const checkCollectSql = 'SELECT * FROM user_collect WHERE user_id = ? AND novel_id = ?';
            sqlFn(checkCollectSql, [userId, novelId], collectResult => {
                if (collectResult.length > 0) {
                    // 已收藏  取消收藏
                    const deleteSql = 'DELETE FROM user_collect WHERE user_id = ? AND novel_id = ?';
                    sqlFn(deleteSql, [userId, novelId], deleteResult => {
                        if (deleteResult.affectedRows > 0) {
                            res.send({
                                msg: '取消收藏成功',
                                status: 200
                            });
                        } else {
                            res.send({
                                msg: '取消收藏失败',
                                status: 500
                            });
                        }
                    });
                } else {
                    // 未收藏  添加收藏
                    const insertSql = 'INSERT INTO user_collect (user_id, novel_id, created_at) VALUES (?, ?, NOW())';
                    sqlFn(insertSql, [userId, novelId], insertResult => {
                        if (insertResult.affectedRows > 0) {
                            res.send({
                                msg: '收藏成功',
                                status: 200
                            });
                        } else {
                            res.send({
                                msg: '收藏失败',
                                status: 500
                            });
                        }
                    });
                }
            });
        });
    });
});

module.exports = router;