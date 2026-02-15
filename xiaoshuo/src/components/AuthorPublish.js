import React, { useEffect, useState } from 'react';
import './AuthorPublish.css';
import api from '../api'
import { FaBookOpen } from 'react-icons/fa';
import { TOKEN } from '../constants';
import { decodeToken } from '../utils/token'

const AuthorPublish = () => {
  const [formData, setFormData] = useState({
    title: '',
    tags: [],
    cover: null,
    description: ''
  });
  const [predefinedTags, setPredefinedTags] = useState([]);
  const token = localStorage.getItem(TOKEN);
  const { uid } = decodeToken(token);

  useEffect(() => {
    api.tags().then(res => {
      const tags = res.data.result;
      setPredefinedTags(tags)
    })
  }, [])

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理标签选择/取消选择
  const handleTagToggle = (tag) => {
    setFormData(prev => {
      const currentTags = [...prev.tags];
      const existingIndex = currentTags.findIndex(t => t.id === tag.id);

      if (existingIndex > -1) {
        // 取消选择
        currentTags.splice(existingIndex, 1);
      } else {
        // 添加选中
        currentTags.push(tag);
      }

      return { ...prev, tags: currentTags };
    });
  };

  // 处理封面上传
  const handleCoverUpload = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({ ...prev, cover: URL.createObjectURL(e.target.files[0]) }));
    }
  };

  // 提交发布
  const handlePublish = () => {
    console.log('发布数据:', formData);
    api.publishNovel({
      title: formData.title,
      userId: uid,
      tags: formData.tags.map(tag => tag.id),
      cover: formData.cover,
      description: formData.description
    })
    alert('小说发布成功！');
  };

  return (
    <div className="author-publish-container">
      <div className="publish-header">
        <h1>发布新小说</h1>
      </div>
      <div className="form-group">
        <label className="form-label">小说标题 <span className="required">*</span></label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="请输入小说标题"
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          选择标签 <span className="required">*</span>
          <span className="tag-hint">（请至少选择一个标签）</span>
        </label>

        {/* 分类标签 */}
        <div className="tags-section">
          <div className="tags-container-selectable">
            {predefinedTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag)}
                className={`tag-selectable ${formData.tags.some(t => t.id === tag.id) ? 'selected' : ''
                  } category-tag`}
              >
                {tag.name}
                {formData.tags.some(t => t.id === tag.id) && (
                  <span className="tag-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 已选标签显示 */}
        <div className="selected-tags-section">
          <h4 className="selected-tags-title">已选标签 ({formData.tags.length})</h4>
          <div className="selected-tags-container">
            {formData.tags.length > 0 ? (
              formData.tags.map(tag => (
                <span key={tag.id} className={`selected-tag category`}>
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <p className="no-tags-hint">请从上方选择标签</p>
            )}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">小说封面</label>
        <div className="cover-upload">
          <label className="cover-label">
            {formData.cover ? (
              <img src={formData.cover} alt="预览" className="cover-preview" />
            ) : (
              <div className="cover-placeholder">
                <FaBookOpen className="cover-icon" />
                <span>点击上传封面图</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="cover-input"
            />
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">小说简介</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="请简要介绍小说的主要内容、亮点..."
          className="form-textarea"
          rows={6}
        ></textarea>
        <p className="form-hint">不超过1000字</p>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={handlePublish}
          className="btn btn-primary publish-btn"
        >
          确认发布
        </button>
      </div>
    </div>
  );
};

export default AuthorPublish;