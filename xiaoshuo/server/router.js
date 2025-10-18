const express = require("express")
const router = express.Router()
var validator = require('validator')
// 检查 value 是否为一个空对象，集合，映射或者set
var isEmpty = require('lodash/isEmpty')
const sqlFn = require('./config')

// 发生错误：返回错误信息
const validatorInput = (data) => {
    let errors = {}
    if(validator.isEmpty(data.password)){
        errors.password = "密码不能为空"
    }
    if(validator.isEmpty(data.email)){
        errors.email = "邮箱不能为空"
    }else if(!validator.isEmail(data.email)){
        errors.email = "不符合邮箱格式"
    }
    if(validator.isEmpty(data.phone)){
        errors.phone = "电话号码不能为空"
    }
    if(!validator.equals(data.password,data.password2)){
        errors.password2 = "两次密码不相同"
    }
    return{
        // 有错误：true，无错误：false
        isValid:!isEmpty(errors),
        errors
    }
}

// 注册
router.post('/register',(req,res)=>{
    const {isValid,errors} = validatorInput(req.body)
    console.log(req.body);
    
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
    console.log(req.body);
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

module.exports = router;