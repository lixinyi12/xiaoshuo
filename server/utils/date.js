/**
 * 将日期格式转化为“*前”
 * @param {*} datetime 
 * @returns 
 */
exports.formatTimeAgo = (datetime) => {
    const now = new Date();
    const updated = new Date(datetime);
    const diff = Math.floor((now - updated) / 1000); // 秒

    if (diff < 60) return `${diff}秒前`;
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
    return `${Math.floor(diff / 86400)}天前`;
}

// 日期格式化函数
// `2020-12-21 12:59:59`
exports.formatDate = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString; // 无效日期保持原样

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};