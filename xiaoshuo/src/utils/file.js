/**
 * 上传文件到服务器
 * @param {File} file - 要上传的文件对象
 * @param {Function} uploadApi - 执行上传的API函数，接收FormData并返回Promise
 * @param {Object} options - 可选配置
 * @param {string} options.fieldName - 表单字段名，默认 'cover'
 * @returns {Promise<string>} 返回上传成功的文件 URL
 */
export const uploadFile = async (file, uploadApi, options = {}) => {
    const { fieldName = 'cover' } = options;

    // 文件类型验证
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('不支持的文件类型，请上传图片（JPEG/PNG/GIF/WEBP）');
    }

    // 文件大小限制（例如 5MB）
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        throw new Error('文件大小不能超过 5MB');
    }

    const formData = new FormData();
    formData.append(fieldName, file);

    try {
        const response = await uploadApi(formData);
        // 假设后端返回的数据格式为 { url: '...' }
        const { url } = response.data.data;
        if (!url) {
            throw new Error('上传成功但未返回图片地址');
        }
        return url;
    } catch (error) {
        console.error('文件上传失败:', error);
        throw error;
    }
};

/**
 * 删除服务器上的文件
 * @param {string} fileUrl - 要删除的文件URL
 * @param {Function} deleteApi - 执行删除的API函数，接收参数（如{ url: fileUrl }）并返回Promise
 * @param {Object} options - 可选配置
 * @param {string} options.key - 后端期望的字段名，默认'url'
 * @returns {Promise<void>}
 */
export const deleteFile = async (fileUrl, deleteApi, options = {}) => {
    const { key = 'url' } = options;

    if (!fileUrl) {
        throw new Error('未提供要删除的文件标识');
    }

    try {
        // 传递参数{ url: fileUrl }
        await deleteApi({ [key]: fileUrl });
    } catch (error) {
        console.error('文件删除失败:', error);
        throw error;
    }
};