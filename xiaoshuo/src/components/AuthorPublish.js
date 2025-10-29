import React, { useState } from 'react';
import './AuthorPublish.css';
import { FaSave, FaEye, FaEyeSlash, FaPlus, FaMinus, FaFileText, FaInfoCircle, FaBookOpen } from 'react-icons/fa';

const AuthorPublish = () => {
  // 状态管理
  const [step, setStep] = useState(1); // 1:基本信息 2:章节内容 3:确认发布
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    tags: [],
    newTag: '',
    cover: null,
    description: '',
    chapters: [
      { id: 1, title: '第1章', content: '', isDraft: false }
    ],
    isPublic: true
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理标签添加
  const handleAddTag = () => {
    if (formData.newTag && !formData.tags.includes(formData.newTag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag],
        newTag: ''
      }));
    }
  };

  // 处理标签删除
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 处理封面上传
  const handleCoverUpload = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({ ...prev, cover: URL.createObjectURL(e.target.files[0]) }));
    }
  };

  // 添加新章节
  const handleAddChapter = () => {
    const newId = Math.max(...formData.chapters.map(ch => ch.id)) + 1;
    setFormData(prev => ({
      ...prev,
      chapters: [...prev.chapters, {
        id: newId,
        title: `第${newId}章`,
        content: '',
        isDraft: false
      }]
    }));
    setCurrentChapter(newId);
  };

  // 处理章节内容变化
  const handleChapterChange = (e, chapterId) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter =>
        chapter.id === chapterId ? { ...chapter, [name]: value } : chapter
      )
    }));
  };

  // 保存草稿
  const handleSaveDraft = () => {
    // 实际项目中这里会调用API保存到数据库
    alert('已保存为草稿');
  };

  // 提交发布
  const handlePublish = () => {
    // 实际项目中这里会调用API提交发布
    console.log('发布数据:', formData);
    alert('小说发布成功！');
  };

  // 步骤导航
  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // 获取当前章节数据
  const currentChapterData = formData.chapters.find(ch => ch.id === currentChapter) || formData.chapters[0];

  return (
    <div className="author-publish-container">
      <div className="publish-header">
        <h1>发布新小说</h1>
        <div className="publish-steps">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-text">基本信息</span>
          </div>
          <div className={`step-divider ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-text">章节内容</span>
          </div>
          <div className={`step-divider ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-text">确认发布</span>
          </div>
        </div>
      </div>

      <div className="publish-form">
        {/* 步骤1：基本信息 */}
        {step === 1 && (
          <div className="form-step basic-info-step">
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
              <p className="form-hint">建议标题简洁明了，突出小说核心内容</p>
            </div>

            <div className="form-group">
              <label className="form-label">作者名 <span className="required">*</span></label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="请输入作者名"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">小说分类 <span className="required">*</span></label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">请选择分类</option>
                <option value="xuanhuan">玄幻</option>
                <option value="xianxia">仙侠</option>
                <option value="dushi">都市</option>
                <option value="wangyou">网游</option>
                <option value="kehuan">科幻</option>
                <option value="lishi">历史</option>
                <option value="qinggan">情感</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">标签</label>
              <div className="tag-input-group">
                <input
                  type="text"
                  value={formData.newTag}
                  onChange={(e) => setFormData(prev => ({ ...prev, newTag: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="输入标签后按回车添加（最多5个）"
                  className="form-input tag-input"
                />
                <button type="button" onClick={handleAddTag} className="btn btn-secondary tag-add-btn">
                  添加
                </button>
              </div>
              <div className="tags-container">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">小说封面 <span className="required">*</span></label>
              <div className="cover-upload">
                <label className="cover-label">
                  {formData.cover ? (
                    <img src={formData.cover} alt="预览" className="cover-preview" />
                  ) : (
                    <div className="cover-placeholder">
                      <FaBookOpen className="cover-icon" />
                      <span>点击上传封面图</span>
                      <p className="cover-hint">建议尺寸: 600×800px</p>
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
              <label className="form-label">小说简介 <span className="required">*</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="请简要介绍小说的主要内容、亮点..."
                className="form-textarea"
                rows={6}
                required
              ></textarea>
              <p className="form-hint">建议200-500字，吸引读者阅读兴趣</p>
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleSaveDraft} className="btn btn-secondary">
                <FaSave /> 保存草稿
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.title || !formData.author || !formData.category || !formData.description || !formData.cover}
                className="btn btn-primary"
              >
                下一步 <FaPlus />
              </button>
            </div>
          </div>
        )}

        {/* 步骤2：章节内容 */}
        {step === 2 && (
          <div className="form-step chapter-content-step">
            <div className="chapter-header">
              <h3>章节管理</h3>
              <div className="chapter-controls">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="btn btn-outline"
                >
                  {previewMode ? <FaEyeSlash /> : <FaEye />} {previewMode ? '编辑模式' : '预览模式'}
                </button>
                <button
                  type="button"
                  onClick={handleAddChapter}
                  className="btn btn-secondary"
                >
                  <FaPlus /> 添加章节
                </button>
              </div>
            </div>

            <div className="chapter-editor-container">
              <div className="chapters-list">
                <h4>章节列表</h4>
                <div className="chapters-scroll">
                  {formData.chapters.map(chapter => (
                    <div
                      key={chapter.id}
                      className={`chapter-item ${currentChapter === chapter.id ? 'active' : ''}`}
                      onClick={() => setCurrentChapter(chapter.id)}
                    >
                      <span className="chapter-number">{chapter.id}</span>
                      <span className="chapter-title">{chapter.title}</span>
                      {chapter.isDraft && <span className="draft-badge">草稿</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="chapter-editor">
                {previewMode ? (
                  <div className="chapter-preview">
                    <h2 className="preview-title">{currentChapterData.title}</h2>
                    <div className="preview-content">
                      {currentChapterData.content
                        ? currentChapterData.content.split('\n').map((para, i) => (
                          <p key={i}>{para}</p>
                        ))
                        : <p className="empty-preview">请在编辑模式下输入章节内容...</p>
                      }
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="form-group chapter-title-input">
                      <input
                        type="text"
                        name="title"
                        value={currentChapterData.title}
                        onChange={(e) => handleChapterChange(e, currentChapterData.id)}
                        placeholder="章节标题"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <textarea
                        name="content"
                        value={currentChapterData.content}
                        onChange={(e) => handleChapterChange(e, currentChapterData.id)}
                        placeholder="请输入章节内容..."
                        className="form-textarea chapter-content"
                        rows={20}
                      ></textarea>
                      <p className="form-hint">支持分段（换行），发布后将自动排版</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="btn btn-outline">
                <FaMinus /> 上一步
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="btn btn-secondary"
              >
                <FaSave /> 保存草稿
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={formData.chapters.some(ch => !ch.title || !ch.content)}
                className="btn btn-primary"
              >
                下一步 <FaPlus />
              </button>
            </div>
          </div>
        )}

        {/* 步骤3：确认发布 */}
        {step === 3 && (
          <div className="form-step confirm-publish-step">
            <div className="publish-summary">
              <h3>发布信息确认</h3>

              <div className="summary-item">
                <span className="summary-label">小说标题：</span>
                <span className="summary-value">{formData.title}</span>
              </div>

              <div className="summary-item">
                <span className="summary-label">作者名：</span>
                <span className="summary-value">{formData.author}</span>
              </div>

              <div className="summary-item">
                <span className="summary-label">分类：</span>
                <span className="summary-value">
                  {formData.category === 'xuanhuan' && '玄幻'}
                  {formData.category === 'xianxia' && '仙侠'}
                  {formData.category === 'dushi' && '都市'}
                  {formData.category === 'wangyou' && '网游'}
                  {formData.category === 'kehuan' && '科幻'}
                  {formData.category === 'lishi' && '历史'}
                  {formData.category === 'qinggan' && '情感'}
                </span>
              </div>

              <div className="summary-item">
                <span className="summary-label">标签：</span>
                <span className="summary-value">
                  {formData.tags.length > 0 ? formData.tags.join('、') : '无'}
                </span>
              </div>

              <div className="summary-item">
                <span className="summary-label">章节数量：</span>
                <span className="summary-value">{formData.chapters.length} 章</span>
              </div>

              <div className="form-group publish-option">
                <label className="option-label">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="option-checkbox"
                  />
                  发布后公开可见（不勾选则仅自己可见）
                </label>
              </div>

              <div className="publish-terms">
                <p>
                  <input type="checkbox" id="terms" className="terms-checkbox" required />
                  <label htmlFor="terms" className="terms-label">
                    我已阅读并同意<a href="#" className="terms-link">《内容发布规范》</a>，确保发布内容不包含违规信息
                  </label>
                </p>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="btn btn-outline">
                <FaMinus /> 上一步
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="btn btn-primary publish-btn"
              >
                确认发布
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorPublish;