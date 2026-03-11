const express = require('express');
const { PERMISSION_NAME } = require('../constants/role');
const { checkAuth, checkPermission } = require('../middleware/auth');
const router = express.Router()
const { assignRoleToUser, removeRoleFromUser } = require('../services/userRolesService');

/**
 * 添加用户角色（需要管理员权限）
 * @route POST /addRoles
 * @param {string} req.body.roleName - 角色名
 * @param {string} req.body.userId - 用户Id
 * @returns {object} { status: 200, msg: '角色添加成功' }
 */
router.post('/addRoles', checkAuth, checkPermission(PERMISSION_NAME.USER_MANAGE), async (req, res) => {
  const { roleName, userId } = req.body;
  try {
    await assignRoleToUser(userId, roleName);
    res.send({ status: 200, msg: '角色添加成功' });
  } catch (err) {
    res.status(500).send({ status: 500, msg: err.message });
  }
});

/**
 * 移除用户角色
 * @route POST /deleteRoles
 * @param {string} req.body.roleName - 角色名
 * @param {string} req.body.userId - 用户Id
 * @returns {object} { status: 200, msg: '角色移除成功' }
 */
router.delete('/deleteRoles', checkAuth, checkPermission('user:manage'), async (req, res) => {
  const { roleName, userId } = req.body;
  try {
    await removeRoleFromUser(userId, roleName);
    res.send({ status: 200, msg: '角色移除成功' });
  } catch (err) {
    res.status(500).send({ status: 500, msg: err.message });
  }
});

module.exports = router;