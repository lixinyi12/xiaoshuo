const { query } = require('../config');

/**
 * 获取用户的所有权限（去重）
 * @param {number} userId 用户ID
 * @returns {Promise<Array>} 权限列表，包含 name, resource, action 等字段
 */
exports.getUserPermissions = async (userId) => {
    const sql = `
        SELECT DISTINCT p.*
        FROM user_roles ur
        INNER JOIN role_permissions rp ON ur.role_id = rp.role_id
        INNER JOIN permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = ?
    `;
    const rows = await query(sql, [userId]);
    return rows || [];
};

/**
 * 检查用户是否拥有指定权限
 * @param {number} userId 用户ID
 * @param {string} permissionName 权限名称，如 'novel:create'
 * @returns {Promise<boolean>} 是否拥有该权限
 */
exports.checkUserPermission = async (userId, permissionName) => {
    const sql = `
        SELECT COUNT(*) AS count
        FROM user_roles ur
        INNER JOIN role_permissions rp ON ur.role_id = rp.role_id
        INNER JOIN permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = ? AND p.name = ?
    `;
    const [result] = await query(sql, [userId, permissionName]);
    return result && result.count > 0;
};

/**
 * 获取用户的所有角色
 * @param {number} userId 用户ID
 * @returns {Promise<Array>} 角色列表
 */
exports.getUserRoles = async (userId) => {
    const sql = `
        SELECT r.*
        FROM user_roles ur
        INNER JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = ?
    `;
    const rows = await query(sql, [userId]);
    return rows || [];
};

/**
 * 为用户分配角色
 * @param {number} userId 用户ID
 * @param {string} roleName 角色名称（'reader', 'author', 'admin'）
 * @returns {Promise<void>}
 */
exports.assignRoleToUser = async (userId, roleName) => {
    // 根据角色名查询角色ID
    const roleSql = 'SELECT id FROM roles WHERE name = ?';
    const roles = await query(roleSql, [roleName]);
    if (roles.length === 0) {
        throw new Error(`Role not found: ${roleName}`);
    }
    const roleId = roles[0].id;

    // 插入用户-角色关联记录
    const insertSql = 'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)';
    await query(insertSql, [userId, roleId]);
};

/**
 * 移除用户的角色
 * @param {number} userId 用户ID
 * @param {string} roleName 角色名称（'reader', 'author', 'admin'）
 * @returns {Promise<void>}
 */
exports.removeRoleFromUser = async (userId, roleName) => {
    // 根据角色名查询角色ID
    const roleSql = 'SELECT id FROM roles WHERE name = ?';
    const roles = await query(roleSql, [roleName]);
    if (roles.length === 0) {
        throw new Error(`Role not found: ${roleName}`);
    }
    const roleId = roles[0].id;

    // 删除用户-角色关联记录
    const deleteSql = 'DELETE FROM user_roles WHERE user_id = ? AND role_id = ?';
    await query(deleteSql, [userId, roleId]);
};

/**
 * 获取所有权限列表
 * @returns {Promise<Array>} 所有权限
 */
exports.getAllPermissions = async () => {
    const sql = 'SELECT * FROM permissions ORDER BY resource, action';
    const rows = await query(sql);
    return rows || [];
};

/**
 * 获取所有角色列表
 * @returns {Promise<Array>} 所有角色
 */
exports.getAllRoles = async () => {
    const sql = 'SELECT * FROM roles';
    const rows = await query(sql);
    return rows || [];
};

/**
 * 创建新角色
 * @param {string} name 角色名称，如 'editor'
 * @param {string} description 角色描述
 * @returns {Promise<number>} 新角色的ID
 */
exports.createRole = async (name, description) => {
    const sql = 'INSERT INTO roles (name, description) VALUES (?, ?)';
    const result = await query(sql, [name, description]);
    return result.insertId;
};

/**
 * 删除角色（会级联删除 role_permissions 和 user_roles 中的关联）
 * @param {number} roleId 角色ID
 * @returns {Promise<void>}
 */
exports.deleteRole = async (roleId) => {
    const sql = 'DELETE FROM roles WHERE id = ?';
    await query(sql, [roleId]);
};

/**
 * 给角色分配权限
 * @param {number} roleId 角色ID
 * @param {number} permissionId 权限ID
 * @returns {Promise<void>}
 */
exports.assignPermissionToRole = async (roleId, permissionId) => {
    const sql = 'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)';
    await query(sql, [roleId, permissionId]);
};

/**
 * 移除角色的权限
 * @param {number} roleId 角色ID
 * @param {number} permissionId 权限ID
 * @returns {Promise<void>}
 */
exports.removePermissionFromRole = async (roleId, permissionId) => {
    const sql = 'DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?';
    await query(sql, [roleId, permissionId]);
};

/**
 * 创建新权限
 * @param {Object} permissionData 权限数据，包含 name, resource, action, description
 * @returns {Promise<number>} 新权限的ID
 */
exports.createPermission = async (permissionData) => {
    const { name, resource, action, description } = permissionData;
    const sql = 'INSERT INTO permissions (name, resource, action, description) VALUES (?, ?, ?, ?)';
    const result = await query(sql, [name, resource, action, description]);
    return result.insertId;
};

/**
 * 删除权限（会级联删除 role_permissions 中的关联）
 * @param {number} permissionId 权限ID
 * @returns {Promise<void>}
 */
exports.deletePermission = async (permissionId) => {
    const sql = 'DELETE FROM permissions WHERE id = ?';
    await query(sql, [permissionId]);
};

/**
 * 根据角色名查询角色Id
 * @param {*} name 
 * @returns 
 */
exports.getRoleByName = async (name) => {
    const sql = 'SELECT id FROM roles WHERE name = ?';
    const rows = await query(sql, [name]);
    return rows[0] || null;
};

/**
 * 获取拥有指定角色的所有用户ID
 * @param {string} roleName - 角色名
 * @returns {Promise<string[]>} 用户ID数组（可能为空）
 */
exports.getUserIdsByRole = async (roleName) => {
    try {
        // 根据角色名获取角色ID
        const roleSql = 'SELECT id FROM roles WHERE name = ?';
        const roleRows = await query(roleSql, [roleName]);
        if (!roleRows || roleRows.length === 0) {
            return []; // 角色不存在，返回空数组
        }
        const roleId = roleRows[0].id;

        // 根据角色ID查询所有关联的用户ID
        const userSql = 'SELECT DISTINCT user_id FROM user_roles WHERE role_id = ?';
        const userRows = await query(userSql, [roleId]);

        // 提取用户ID（如果查询结果中字段名为 user_id）
        return userRows.map(row => row.user_id);
    } catch (err) {
        // 抛出错误，由调用方处理
        throw new Error(`获取角色用户失败: ${err.message}`);
    }
};