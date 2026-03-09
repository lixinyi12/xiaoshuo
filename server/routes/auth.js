const { createToken } = require('../utils/token');
const express = require('express');
const router = express.Router();
const validatorInput = require('../utils/validator');
const {
  findUserByPhone,
  findUserByEmail,
  createUser,
  getUserByPhoneOrEmail,
  updateUserInfo
} = require('../services/userService');
const { checkAuth } = require('../middleware/auth');
const userRolesService = require('../services/userRolesService');
const ROLE_NAME = require('../constants/role');

/**
 * 用户注册接口
 * @route POST /register
 * @param {string} req.body.phone - 手机号
 * @param {string} req.body.email - 邮箱
 * @param {string} req.body.password - 密码
 * @returns {object} 注册成功，返回 { msg: '注册成功', status: 200 }
 */
router.post('/register', async (req, res) => {
  try {
    // 参数校验
    const { isValid, errors } = validatorInput(req.body);
    if (isValid) {
      return res.status(400).send({ errors, status: 400 });
    }

    const { phone, email, password } = req.body;

    // 检查手机号是否已存在
    const existingPhone = await findUserByPhone(phone);
    if (existingPhone) {
      return res.status(409).send({
        msg: '该手机号已被注册',
        field: 'phone',
        status: 409
      });
    }

    // 检查邮箱是否已存在
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(409).send({
        msg: '该邮箱已被注册',
        field: 'email',
        status: 409
      });
    }

    // 创建用户
    const result = await createUser({ phone, email, password });
    if (result.affectedRows > 0) {
      const newUserId = result.insertId;

      // 获取 reader 角色 ID（建议根据角色名查询，避免硬编码）
      const readerRole = await userRolesService.getRoleByName(ROLE_NAME.READER); // 需要实现此函数
      if (readerRole) {
        await assignRoleToUser(newUserId, readerRole.id);
      }
      res.send({ msg: '注册成功', status: 200 });
    } else {
      res.status(500).send({ msg: '注册失败', status: 500 });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: '服务器错误', status: 500 });
  }
});

/**
 * 用户登录接口
 * @route POST /login
 * @param {string} req.body.username - 用户名
 * @param {string} req.body.password - 密码
 * @returns {object} 登录成功，返回 { user, status: 200, msg: '登录成功' }
 */
router.post('/login', async (req, res) => {
  try {
    // 参数校验
    const { isValid, errors } = validatorInput(req.body);
    if (isValid) {
      return res.status(400).send({ errors, status: 400 });
    }

    const { username, password } = req.body;

    // 通过手机号或邮箱查找用户
    const user = await getUserByPhoneOrEmail(username, username);
    if (!user) {
      return res.status(401).send({
        status: 401,
        msg: '用户名不存在'
      });
    }

    // 验证密码
    if (user.password !== password) {
      return res.status(401).send({
        status: 401,
        msg: '密码错误'
      });
    }

    const roles = await userRolesService.getUserRoles(user.id);
    const permissions = await userRolesService.getUserPermissions(user.id);
    const roleNames = roles.map(r => r.name);
    const permissionNames = permissions.map(p => p.name);

    // 生成token
    const token = createToken(user.id, user.phone, user.email, roleNames, permissionNames);
    // 剔除密码字段
    const { password: _, ...userWithoutPassword } = user;

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 * 24
    });

    res.send({
      user: userWithoutPassword,
      status: 200,
      msg: '登录成功'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: '服务器错误', status: 500 });
  }
});

/**
 * 用户登出接口
 * @route POST /logout
 * @returns {object} 登出成功信息
 */
router.post('/logout', checkAuth, (req, res) => {
  try {
    // 清除 token Cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });

    res.send({ status: 200, msg: '登出成功' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: '服务器错误', status: 500 });
  }
});

/**
 * 重置密码接口（部分更新）
 * @route PATCH /reset
 * @param {string} req.body.username - 用户名
 * @param {string} req.body.password - 新密码
 * @returns {object} 密码重置成功，返回 { msg: '密码重置成功', status: 200 }
 */
router.patch('/reset', async (req, res) => {
  try {
    // 参数校验
    const { isValid, errors } = validatorInput(req.body);
    if (isValid) {
      return res.status(400).send({ errors, status: 400 });
    }

    const { username, password } = req.body;

    // 查找用户是否存在
    const user = await getUserByPhoneOrEmail(username, username);
    if (!user) {
      return res.status(404).send({
        status: 404,
        msg: '用户不存在'
      });
    }

    // 更新密码
    const success = await updateUserInfo(user.id, { password });
    if (success) {
      res.send({ msg: '密码重置成功', status: 200 });
    } else {
      res.status(500).send({ msg: '密码重置失败', status: 500 });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: '服务器错误', status: 500 });
  }
});

module.exports = router;