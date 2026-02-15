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