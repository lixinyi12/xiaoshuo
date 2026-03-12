var validator = require('validator')
var isEmpty = require('lodash/isEmpty')

interface IError {
    password?: string,
    username?: string,
    email?: string,
    phone?: string,
    password2?: string,
    nick?: string,
}

// 发生错误：返回错误信息
module.exports = function validatorInput(data: any) {
    let errors: IError = {}
    if ('password' in data) {
        if (validator.isEmpty(data.password)) {
            errors.password = "密码不能为空"
        }
    }
    if ('username' in data) {
        if (validator.isEmpty(data.username)) {
            errors.username = "用户名不能为空"
        }
    }
    if ('email' in data) {
        if (validator.isEmpty(data.email)) {
            errors.email = "邮箱不能为空"
        } else if (!validator.isEmail(data.email)) {
            errors.email = "不符合邮箱格式"
        }
    }
    if ('phone' in data) {
        if (validator.isEmpty(data.phone)) {
            errors.phone = "电话号码不能为空"
        }
    }
    if ('password2' in data && 'password' in data) {
        if (!validator.equals(data.password, data.password2)) {
            errors.password2 = "两次密码不相同"
        }
    }
    if ('nick' in data) {
        if (validator.isEmpty(data.nick)) {
            errors.nick = "昵称不能为空"
        }
    }
    return {
        // 有错误：true，无错误：false
        isValid: !isEmpty(errors),
        errors
    }
}