const express = require("express")
const router = express.Router()
var validator = require('validator')
// 检查 value 是否为一个空对象，集合，映射或者set
var isEmpty = require('lodash/isEmpty')
const sqlFn = require('./config')

// 发生错误：返回错误信息；不发生错误：返回字段
const validatorInput = (data) => {
    let errors = {}
    if(validator.isEmpty(data.password)){
        errors.password = "密码不能为空"
    }
    if(!validator.isEmail(data.email)){
        errors.email = "不符合邮箱格式"
    }
    if(validator.isEmpty(data.phone)){
        errors.phone = "电话号码不能为空"
    }
    if(!validator.equals(data.password,data.password2)){
        errors.password2 = "两次密码不相同"
    }

    return{
        isValid:!isEmpty(errors),
        errors
    }
}

router.post('/register',(req,res)=>{
    const password = req.body.password;
    const email = req.body.email;
    const phone = req.body.phone;
    const password2= req.body.password2;
    const {isValid,errors} = validatorInput(req.body)
    if(isValid){
        res.status(400).send(errors)
    }else{
        // 写入数据库
        const {phone,email,password,password2} = req.body
        const sql = 'insert into user values (null,?,?,?)'
        const arr = [phone, email, password]
        sqlFn(sql,arr,result => {
            if(result.affectedRows>0){
                res.status(200).send({
                    msg:'注册成功'
                })
            }else{
                res.status(401).send({
                    msg:'注册失败'
                })
            }
        })
    }
})

module.exports = router;