const { verifyToken, decodeToken } = require('../utils/token');

/**
 * 认证中间件 - 验证用户是否登录
 */
exports.checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: 401, msg: '未登录' });
    }

    const { uid, phone, email, roles, permissions } = decodeToken(token)

    req.user = {
      id: uid,
      phone: phone,
      email: email,
      roles: roles || [],
      permissions: permissions || []
    };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ status: 500, msg: '服务器错误' });
  }
};

/**
 * 可选登录中间件 - 解析token但不强制，用于公开接口获取用户信息
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        req.user = {
          id: decoded.userId,
          phone: decoded.phone,
          email: decoded.email,
          roles: decoded.roles || [],
          permissions: decoded.permissions || []
        };
      }
    }
    next();
  } catch (err) {
    next();
  }
};

/**
 * 权限检查中间件 - 要求用户拥有指定权限
 * @param {string} permissionName 权限名称
 */
exports.checkPermission = (permissionName) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 401, msg: '未登录' });
    }
    if (req.user.permissions.includes(permissionName)) {
      next();
    } else {
      res.status(403).json({ status: 403, msg: '权限不足' });
    }
  };
};

/**
 * 角色检查中间件 - 要求用户拥有指定角色中的至少一个
 * @param {...string|string[]} allowedRoles - 允许的角色名
 * @returns {Function} Express 中间件
 */
exports.checkRole = (...allowedRoles) => {
  return async (req, res, next) => {
    // 用户已登录
    if (!req.user) {
      return res.status(401).json({ status: 401, msg: '未登录' });
    }

    const roles = Array.isArray(allowedRoles[0]) ? allowedRoles[0] : allowedRoles;
    const userRoles = req.user.roles || [];

    // 检查是否有交集
    const hasRole = roles.some(role => userRoles.includes(role));

    if (hasRole) {
      next();
    } else {
      res.status(403).json({ status: 403, msg: '，需要指定角色之一' });
    }
  };
};