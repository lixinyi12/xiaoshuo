import React, { useEffect, useState } from 'react';
import { novelApi } from '../../api';
import { FaBookOpen } from 'react-icons/fa';
import { TAG_STATUS, TAG_TYPE_CATEGORY, TAG_TYPE_CHANNEL, TAG_TYPE_STATUS } from '../../constants/tags';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/link';
import { uploadFile } from '../../utils/file';
import { BASE_URL } from '../../constants/index';
import styles from './AuthorPublish.module.css';
import { createElement } from 'react';

interface Tag {
  id: number;
  name: string;
  type: string;
}

const AuthorPublish = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    title: string;
    tags: Tag[];
    cover: string | null;
    description: string;
  }>({
    title: '',
    tags: [],
    cover: null,
    description: ''
  });
  const [predefinedTags, setPredefinedTags] = useState([]);
  const [categoryTags, setCategoryTags] = useState([]);
  const [channelTags, setChannelTags] = useState([]);

  useEffect(() => {
    novelApi.tags().then(res => {
      const tags = res.data.result;
      setPredefinedTags(tags);
    });
  }, []);

  useEffect(() => {
    setCategoryTags(predefinedTags.filter((tag: any) => tag.type === TAG_TYPE_CATEGORY));
    setChannelTags(predefinedTags.filter((tag: any) => tag.type === TAG_TYPE_CHANNEL));
  }, [predefinedTags]);

  useEffect(() => {
    if (predefinedTags.length > 0) {
      const defaultStatus = predefinedTags.find(
        (tag: any) => tag.type === TAG_TYPE_STATUS && tag.name === TAG_STATUS.SERIAL
      );
      if (defaultStatus) {
        setFormData((prev: any) => ({
          ...prev,
          tags: [defaultStatus]
        }));
      }
    }
  }, [predefinedTags]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagToggle = (clickedTag: any) => {
    setFormData((prev: any) => {
      const currentTags = prev.tags;
      const isSelected = currentTags.some((t: any) => t.id === clickedTag.id);

      if (clickedTag.type === TAG_TYPE_CATEGORY) {
        if (isSelected) {
          const remaining = currentTags.filter((t: any) => t.id !== clickedTag.id);
          const categoryRemaining = remaining.filter((t: any) => t.type === TAG_TYPE_CATEGORY).length;
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
          const otherTags = currentTags.filter((t: any) => t.type !== TAG_TYPE_CHANNEL);
          return { ...prev, tags: [...otherTags, clickedTag] };
        }
      }
      return prev;
    });
  };

  const handleCoverUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const coverUrl = await uploadFile(file, novelApi.uploadCover);
      setFormData((prev: any) => ({
        ...prev,
        cover: coverUrl
      }));
    } catch (error: any) {
      alert(error.message || '封面上传失败，请重试');
      e.target.value = null;
    }
  };

  const handlePublish = () => {
    const selectedCategory = formData.tags.filter((t: any) => t.type === TAG_TYPE_CATEGORY);
    const selectedChannel = formData.tags.filter((t: any) => t.type === TAG_TYPE_CHANNEL);

    if (selectedCategory.length < 1) {
      alert('请选择一个分类');
      return;
    }
    if (selectedChannel.length !== 1) {
      alert('请选择一个频道');
      return;
    }

    let finalTags = [...formData.tags];
    const selectedStatus = formData.tags.filter((t: any) => t.type === TAG_TYPE_STATUS);
    if (selectedStatus.length === 0) {
      const defaultStatus = predefinedTags.find(
        (tag: any) => tag.type === TAG_TYPE_STATUS && tag.name === TAG_STATUS.SERIAL
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

    const submitData = {
      title: formData.title,
      tags: finalTags.map(tag => tag.id),
      cover: formData.cover,
      description: formData.description
    };

    novelApi
      .publishNovel(submitData)
      .then(() => {
        alert('小说发布成功！');
        setFormData({
          title: '',
          tags: [],
          cover: null,
          description: ''
        });
        navigate(ROUTES.PERSON);
      })
      .catch(err => {
        alert('发布失败：' + err.message);
      });
  };

  return (
    <div className={styles.authorPublishContainer}>
      <div className={styles.publishHeader}>
        <h1>发布新小说</h1>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          小说标题 <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="请输入小说标题"
          className={styles.formInput}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          选择标签 <span className={styles.required}>*</span>
          <span className={styles.tagHint}>（每种类别至少选一个）</span>
        </label>

        {/* 分类标签区域 */}
        <div className={styles.tagsSection}>
          <h4 className={styles.tagsSectionTitle}>分类</h4>
          <div className={styles.tagsContainerSelectable}>
            {categoryTags.map((tag: any) => <button
              key={tag.id}
              onClick={() => handleTagToggle(tag)}
              className={`${styles.tagSelectable} ${formData.tags.some((t: any) => t.id === tag.id) ? styles.selected : ''
                }`}
            >
              {tag.name}
              {formData.tags.some((t: any) => t.id === tag.id) && (
                <span className={styles.tagCheck}>✓</span>
              )}
            </button>)}
          </div>
        </div>

        {/* 频道标签区域 */}
        <div className={styles.tagsSection}>
          <h4 className={styles.tagsSectionTitle}>频道</h4>
          <div className={styles.tagsContainerSelectable}>
            {channelTags.map((tag: any) => <button
              key={tag.id}
              onClick={() => handleTagToggle(tag)}
              className={`${styles.tagSelectable} ${formData.tags.some((t: any) => t.id === tag.id) ? styles.selected : ''
                }`}
            >
              {tag.name}
              {formData.tags.some((t: any) => t.id === tag.id) && (
                <span className={styles.tagCheck}>✓</span>
              )}
            </button>)}
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>小说封面</label>
        <div className={styles.coverUpload}>
          <label className={styles.coverLabel}>
            {formData.cover ? (
              <img
                src={BASE_URL + formData.cover}
                alt="预览"
                className={styles.coverPreview}
              />
            ) : (
              <div className={styles.coverPlaceholder}>
                {createElement(FaBookOpen as any, { className: styles.coverIcon })}
                <span>点击上传封面图</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className={styles.coverInput}
            />
          </label>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>小说简介</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="请简要介绍小说的主要内容、亮点..."
          className={styles.formTextarea}
          rows="6"
          maxLength="500"
        />
        <p className={styles.formHint}>{formData.description.length}/500 字</p>
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          onClick={handlePublish}
          className={`${styles.btn} ${styles.btnPrimary} ${styles.publishBtn}`}
        >
          确认发布
        </button>
      </div>
    </div>
  );
};

export default AuthorPublish;