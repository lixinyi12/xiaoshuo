import React, { useEffect, useState } from 'react';
import './AuthorPublish.css';
import api from '../api'
import { FaBookOpen } from 'react-icons/fa';
import { TOKEN } from '../constants';
import { decodeToken } from '../utils/token'
import { TAG_STATUS, TAG_TYPE_CATEGORY, TAG_TYPE_CHANNEL, TAG_TYPE_STATUS } from '../constants/tags';
import { useNavigate } from "react-router-dom";
import { ROUTES } from '../constants/link';

const AuthorPublish = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    tags: [],
    cover: null,
    description: ''
  });
  const [predefinedTags, setPredefinedTags] = useState([]);
  const [categoryTags, setCategoryTags] = useState([]);
  const [channelTags, setChannelTags] = useState([]);
  const token = localStorage.getItem(TOKEN);
  const { uid } = decodeToken(token);

  useEffect(() => {
    api.tags().then(res => {
      const tags = res.data.result;
      setPredefinedTags(tags)
    })
  }, [])

  useEffect(() => {
    setCategoryTags(predefinedTags.filter(tag => tag.type === TAG_TYPE_CATEGORY))
    setChannelTags(predefinedTags.filter(tag => tag.type === TAG_TYPE_CHANNEL))
  }, [predefinedTags])

  useEffect(() => {
    if (predefinedTags.length > 0) {
      const defaultStatus = predefinedTags.find(
        tag => tag.type === TAG_TYPE_STATUS && tag.name === TAG_STATUS.SERIAL
      );
      if (defaultStatus) {
        setFormData(prev => ({
          ...prev,
          tags: [defaultStatus]
        }));
      }
    }
  }, [predefinedTags]);

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理标签选择/取消选择
  const handleTagToggle = (clickedTag) => {
    setFormData(prev => {
      const currentTags = prev.tags;
      const isSelected = currentTags.some(t => t.id === clickedTag.id);

      if (clickedTag.type === TAG_TYPE_CATEGORY) {
        if (isSelected) {
          const remaining = currentTags.filter(t => t.id !== clickedTag.id);
          const categoryRemaining = remaining.filter(t => t.type === TAG_TYPE_CATEGORY).length;
          if (categoryRemaining === 0) {
            return prev;
          }
          return { ...prev, tags: remaining };
        } else {
          return { ...prev, tags: [...currentTags, clickedTag] };
        }
      }

      if (clickedTag.type === TAG_TYPE_CHANNEL) {
        if (isSelected) {
          return prev;
        } else {
          const otherTags = currentTags.filter(t => t.type !== TAG_TYPE_CHANNEL);
          return { ...prev, tags: [...otherTags, clickedTag] };
        }
      }
      return prev;
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
    const selectedCategory = formData.tags.filter(t => t.type === TAG_TYPE_CATEGORY);
    const selectedChannel = formData.tags.filter(t => t.type === TAG_TYPE_CHANNEL);

    if (selectedCategory.length < 1) {
      alert('请选择一个分类');
      return;
    }
    if (selectedChannel.length !== 1) {
      alert('请选择一个频道');
      return;
    }

    let finalTags = [...formData.tags];
    const selectedStatus = formData.tags.filter(t => t.type === TAG_TYPE_STATUS);
    if (selectedStatus.length === 0) {
      const defaultStatus = predefinedTags.find(
        tag => tag.type === TAG_TYPE_STATUS && tag.name === TAG_STATUS.SERIAL
      );
      if (defaultStatus) {
        finalTags.push(defaultStatus);
      } else {
        console.error('未找到默认“连载”标签');
        alert('系统错误：缺少默认状态标签');
        return;
      }
    } else if (selectedStatus.length > 1) {
      alert('状态只能选择一个');
      return;
    }

    // 提交数据
    const submitData = {
      title: formData.title,
      userId: uid,
      tags: finalTags.map(tag => tag.id),
      cover: formData.cover,
      description: formData.description
    };

    console.log('发布数据:', submitData);
    api.publishNovel(submitData)
      .then(() => {
        alert('小说发布成功！');
        // 可跳转或重置表单
        setFormData({
          title: '',
          tags: [],
          cover: null,
          description: ''
        })
        navigate(ROUTES.PERSON)
      })
      .catch(err => {
        alert('发布失败：' + err.message);
      });
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
          <span className="tag-hint">（每种类别至少选一个）</span>
        </label>

        {/* 分类标签区域 */}
        <div className="tags-section">
          <h4 className="section-title">分类</h4>
          <div className="tags-container-selectable">
            {categoryTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag)}
                className={`tag-selectable ${formData.tags.some(t => t.id === tag.id) ? 'selected' : ''}`}
              >
                {tag.name}
                {formData.tags.some(t => t.id === tag.id) && (
                  <span className="tag-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 频道标签区域 */}
        <div className="tags-section">
          <h4 className="section-title">频道</h4>
          <div className="tags-container-selectable">
            {channelTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag)}
                className={`tag-selectable ${formData.tags.some(t => t.id === tag.id) ? 'selected' : ''}`}
              >
                {tag.name}
                {formData.tags.some(t => t.id === tag.id) && (
                  <span className="tag-check">✓</span>
                )}
              </button>
            ))}
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
          maxLength="500"
        ></textarea>
        <p className="form-hint">{formData.description.length}/500 字</p>
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