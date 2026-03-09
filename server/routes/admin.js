const ROLE_NAME = require('../constants/role');
const { checkAuth, checkPermission } = require('../middleware/auth');
const { assignRoleToUser, removeRoleFromUser } = require('../services/userRolesService');

/**
 * 为用户添加角色（需要管理员权限）
 * @route POST /roles
 * @param {string} req.body.username - 用户名
 * @param {string} req.body.password - 密码
 * @returns {object} 登录成功，返回 { user, status: 200, msg: '登录成功' }
 */
router.post('/addRoles', checkAuth, checkPermission(ROLE_NAME.USER_MANAGE), async (req, res) => {
  const { userId } = req.params;
  const { roleId } = req.body;
  try {
    await assignRoleToUser(userId, roleId);
    res.send({ status: 200, msg: '角色添加成功' });
  } catch (err) {
    res.status(500).send({ status: 500, msg: err.message });
  }
});

/**
 * 移除用户角色
 * @route POST /login
 * @param {string} req.body.username - 用户名
 * @param {string} req.body.password - 密码
 * @returns {object} 登录成功，返回 { user, status: 200, msg: '登录成功' }
 */
router.delete('/user/:userId/roles/:roleId', checkAuth, checkPermission('user:manage'), async (req, res) => {
  const { userId, roleId } = req.params;
  try {
    await removeRoleFromUser(userId, roleId);
    res.send({ status: 200, msg: '角色移除成功' });
  } catch (err) {
    res.status(500).send({ status: 500, msg: err.message });
  }
});