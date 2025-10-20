const express = require("express")
const router = express.Router()
var validator = require('validator')
// 检查 value 是否为一个空对象，集合，映射或者set
var isEmpty = require('lodash/isEmpty')
const sqlFn = require('./config')
const validatorInput = require('../src/utils/validator')
const jwt = require('jsonwebtoken')
const secretKey = require('./secretKey')

// 注册
router.post('/register',(req,res)=>{
    const {isValid,errors} = validatorInput(req.body)
    if(isValid){
        res.send({
            errors,
            status:400
        })
    }else{
        // 写入数据库
        const {phone,email,password,password2} = req.body
        const sql = 'insert into user values (null,?,?,?)'
        const arr = [phone, email, password]
        sqlFn(sql,arr,result => {
            if(result.affectedRows>0){
                res.send({
                    msg:'注册成功',
                    status:200
                })
            }else{
                res.send({
                    msg:'注册失败',
                    status:401
                })
            }
        })
    }
})
// 邮箱是否可用
router.get('/repeat/email',(req,res)=>{
    const email = req.query.email;

    if (validator.isEmpty(email)) {
        res.send({
            status:200,
            msg:'邮箱不能为空',
            flag:false
        })
        return
    }else if(!validator.isEmail(email)){
        res.send({
            status:200,
            msg:'不符合邮箱格式',
            flag:false
        })
        return
    }

    const sql = 'select * from user where email=?';
    const arr = [email]
    sqlFn(sql,arr,result =>{
        if(result.length >0){
            res.send({
                status:200,
                msg:'该邮箱已注册',
                flag:false
            })
        }else {
            res.send({
                status:200,
                msg:'邮箱可用',
                flag:true
            })
        }
    })
})
// 手机号是否可用
router.get('/repeat/phone',(req,res)=>{
    const phone = req.query.phone;

    if(validator.isEmpty(phone)){
        res.send({
            status:200,
            msg:'电话号码不能为空',
            flag:false
        })
        return
    }

    const sql = 'select * from user where phone=?';
    const arr = [phone]
    sqlFn(sql,arr,result =>{
        if(result.length >0){
            res.send({
                status:200,
                msg:'该手机号已注册',
                flag:false
            })
        }else {
            res.send({
                status:200,
                msg:'手机号可用',
                flag:true
            })
        }
    })
})
// 密码是否可用
router.get('/repeat/password',(req,res)=>{
    const password = req.query.password;

    if(validator.isEmpty(password)){
        res.send({
            status:200,
            msg:'密码不能为空',
            flag:false
        })
        return
    }

    res.send({
        status:200,
        msg:'密码可用',
        flag:true
    })
})
// 重复密码是否可用
router.get('/repeat/password2',(req,res)=>{
    const password2 = req.query.password2;
    const password = req.query.password;

    if(validator.isEmpty(password2)){
        res.send({
            status:200,
            msg:'密码不能为空',
            flag:false
        })
        return
    }else if(!validator.equals(password,password2)){
        res.send({
            status:200,
            msg:'两次密码不相同',
            flag:false
        })
        return
    }
    res.send({
        status:200,
        msg:'重复密码可用',
        flag:true
    })
})


// 登录
router.post('/login',(req,res)=>{
    const {isValid,errors} = validatorInput(req.body)
    if(isValid){
        res.send({
            errors,
            status:400
        })
    }else{
        const phone = req.body.username
        const email = req.body.username
        const password = req.body.password
        const sql = 'select * from user where (phone = ? or email = ?) and password = ?'
        const arr = [phone,email,password]
        sqlFn(sql,arr,result =>{
            if(result.length>0){
                //生成token
                const token = jwt.sign({
                    uid:result[0].id,
                    username:result[0].username
                },secretKey.secretKey)
                res.send({
                    token,
                    status:200
                })
            }else{
                res.send({
                    status:401,
                    msg:'用户名或密码错误'
                })
            }
        })
    }
    
})
// 用户名是否可用
router.get('/repeat/username',(req,res)=>{
    console.log(req)
    const username = req.query.username;
    if (validator.isEmpty(username)) {
        res.send({
            status:200,
            msg:'用户名不能为空',
            flag:false
        })
        return
    }
    res.send({
        status:200,
        msg:'用户名可用',
        flag:true
    })
})


//首页列表数据
router.get('/list',(req,res)=>{
    //读取token
    const token = req.headers.authorization;
    if(token){
        res.send({
            list:[
                {
                    id:1001,
                    name:'测试1'
                },
                {
                    id:1002,
                    name:'测试2'
                }
            ],
            status:200
        })
    }else{
        res.send({
            status:401,
            msg:'请先登录'
        })
    }
})


//小说分类列表数据
router.get('/category', (req, res) => {
  const sql = `
    SELECT 
      n.id,
      n.cover,
      n.title,
      n.author,
      n.hot,
      n.chapters,
      n.description,
      GROUP_CONCAT(t.name) AS tags
    FROM novels n
    LEFT JOIN novel_tags nt ON n.id = nt.novel_id
    LEFT JOIN tags t ON t.id = nt.tag_id
    GROUP BY n.id
  `;
  sqlFn(sql, null, result => {
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
    }));
    res.send({
      status: 200,
      msg: '获取成功',
      data
    });
  });
});


module.exports = router;