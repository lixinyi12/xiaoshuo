import React, { useEffect, useState } from 'react';
import styles from './WorksManagement.module.css';
import { FaBookOpen } from 'react-icons/fa';
import { TAG_STATUS, TAG_CATEGORY, TAG_CHANNEL, TAG_TYPE_STATUS, TAG_TYPE_CHANNEL, TAG_TYPE_CATEGORY } from '../../constants/tags'
import { BASE_URL } from '../../constants/index'
import { novelApi } from '../../api';
import { useSearchParams } from 'react-router-dom';
import { deleteFile, uploadFile } from '../../utils/file';

const WorksManagement = () => {
  const [searchParams] = useSearchParams();
  const novelId = Number(searchParams.get('novelId'));

  // 作品信息状态
  const [workInfo, setWorkInfo] = useState({
    cover: null,
    title: '',
    status: '',
    channel: '',
    categories: [],
    description: '暂无简介',
  });
  useEffect(() => {
    novelApi.getNovelDetail({ id: novelId }).then(res => {
      const data = res.data.data;

      let status = '';
      let channel = '';
      let categories = [];

      if (data.tags && Array.isArray(data.tags)) {
        const statusTag = data.tags.find(t => t.type === TAG_TYPE_STATUS);
        if (statusTag && statusTag.name) {
          status = statusTag.name || status;
        }

        const channelTag = data.tags.find(t => t.type === TAG_TYPE_CHANNEL);
        if (channelTag && channelTag.name) {
          channel = channelTag.name || channel;
        }

        const categoryTags = data.tags.filter(t => t.type === TAG_TYPE_CATEGORY);
        if (categoryTags.length > 0) {
          categories = categoryTags.map(t => {
            return t.name;
          });
        }
      }

      setWorkInfo({
        cover: data.cover || null,
        title: data.title || '',
        status,
        channel,
        categories,
        description: data.description || '暂无简介',
      });
    });
  }, [])

  // 章节列表状态
  const [chapters, setChapters] = useState([]);
  useEffect(() => {
    novelApi.getChapterList({ id: novelId }).then(res => {
      setChapters(res.data.data)
    });
  }, [])

  // 章节表单状态
  const [chapterForm, setChapterForm] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // 重置章节表单
  const resetChapterForm = () => {
    setChapterForm({ title: '', content: '' });
    setEditingId(null);
  };

  // 处理作品信息中普通字段的修改
  const handleWorkInfoChange = (e) => {
    const { name, value } = e.target;
    setWorkInfo(prev => ({ ...prev, [name]: value }));
  };

  // 处理封面上传
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const oldCoverUrl = workInfo.cover;
    try {
      // 上传新封面
      const newCoverUrl = await uploadFile(file, novelApi.uploadCover);
      setWorkInfo(prev => ({ ...prev, cover: newCoverUrl }));
      // 如果存在旧封面，则删除
      if (oldCoverUrl) {
        try {
          await deleteFile(oldCoverUrl, novelApi.deleteCover, { key: 'url' });
        } catch (deleteError) {
          console.error('删除旧封面失败:', deleteError);
        }
      }
    } catch (error) {
      alert(error.message || '封面上传失败，请重试');
    } finally {
      // 清空文件输入框
      e.target.value = null;
    }
  };

  // 处理分类多选
  const handleCategoryChange = (catValue) => {
    setWorkInfo(prev => {
      const current = prev.categories;
      if (current.includes(catValue)) {
        if (current.length === 1 && current[0] === catValue) {
          return prev;
        }
        return { ...prev, categories: current.filter(c => c !== catValue) };
      } else {
        return { ...prev, categories: [...current, catValue] };
      }
    });
  };

  // 保存作品信息
  const handleSaveWorkInfo = () => {
    novelApi.updateNovel({ novelId, data: workInfo })
    alert('保存成功');
  };

  // 处理章节表单输入
  const handleChapterFormChange = (e) => {
    const { name, value } = e.target;
    setChapterForm(prev => ({ ...prev, [name]: value }));
  };

  // 保存章节（新增或更新）
  const handleSaveChapter = async () => {
    if (!chapterForm.title.trim()) {
      alert('章节标题不能为空');
      return;
    }

    // 计算字数变化量（编辑模式需获取原内容长度）
    let originalLength = 0;
    if (editingId !== null) {
      const originalChapter = chapters.find(ch => ch.id === editingId);
      originalLength = originalChapter ? originalChapter.content.length : 0;
    }
    const newLength = chapterForm.content.length;
    const increment = newLength - originalLength;

    try {
      if (editingId !== null) {
        // 更新章节
        await novelApi.updateChapter({
          chapterId: editingId,
          title: chapterForm.title,
          content: chapterForm.content
        });
      } else {
        // 新增章节
        await novelApi.addChapter({
          novel_id: novelId,
          title: chapterForm.title,
          content: chapterForm.content
        });
      }

      // 操作成功后重新获取章节列表
      const res = await novelApi.getChapterList({ id: novelId });
      setChapters(res.data.data);

      // 若字数有变化，更新小说总字数
      if (increment !== 0) {
        try {
          await novelApi.updateWordCount({ novelId });
        } catch (err) {
          console.error('更新总字数失败', err);
          alert('章节保存成功，但总字数更新失败，请稍后手动调整');
        }
      }

      // 重置表单
      resetChapterForm();
    } catch (error) {
      console.error('保存章节失败', error);
      alert('保存失败，请稍后重试');
    }
  };

  // 编辑章节：填充表单并进入编辑模式
  const handleEditChapter = (chapter) => {
    setChapterForm({
      title: chapter.title,
      content: chapter.content
    });
    setEditingId(chapter.id);
  };

  // 删除章节
  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm('确定删除该章节吗？')) return;

    // 被删除章节的内容长度
    const chapterToDelete = chapters.find(ch => ch.id === chapterId);
    if (!chapterToDelete) {
      alert('章节不存在');
      return;
    }

    try {
      await novelApi.deleteChapter({ chapterId });

      // 更新小说总字数
      try {
        await novelApi.updateWordCount({ novelId });
      } catch (err) {
        console.error('更新总字数失败', err);
        alert('章节删除成功，但总字数更新失败，请稍后手动调整');
      }

      // 刷新章节列表
      const res = await novelApi.getChapterList({ id: novelId });
      setChapters(res.data.data);

      // 如果当前正在编辑的是被删除的章节，则清空表单
      if (editingId === chapterId) resetChapterForm();
    } catch (err) {
      console.error('删除章节失败', err);
      alert('删除失败，请稍后重试');
    }
  };

  // 取消编辑/清空表单
  const handleCancelChapter = () => {
    resetChapterForm();
  };

  return (
    <div className={styles.container}>
      {/* 作品信息卡片 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>作品信息</h2>

        {/* 封面上传 */}
        <div className="form-group">
          <label className="form-label">小说封面</label>
          <div className="cover-upload">
            <label className="cover-label">
              {workInfo.cover ? (
                <img src={BASE_URL + workInfo.cover} alt="预览" className="cover-preview" />
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

        {/* + 小说标题输入框 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>小说标题</label>
          <input
            type="text"
            name="title"
            value={workInfo.title}
            onChange={handleWorkInfoChange}
            className={styles.input}
            placeholder="请输入小说标题"
          />
        </div>

        {/* 状态（单选，必须选一个） */}
        <div className={styles.formGroup}>
          <label className={styles.label}>状态</label>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {Object.entries(TAG_STATUS).map(([key, value]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="radio"
                  name="status"
                  value={value}
                  checked={workInfo.status === value}
                  onChange={() => setWorkInfo({ ...workInfo, status: value })}
                />
                <span style={{ marginLeft: '4px' }}>{value}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 频道（单选，必须选一个） */}
        <div className={styles.formGroup}>
          <label className={styles.label}>频道</label>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {Object.entries(TAG_CHANNEL).map(([key, value]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="radio"
                  name="channel"
                  value={value}
                  checked={workInfo.channel === value}
                  onChange={() => setWorkInfo({ ...workInfo, channel: value })}
                />
                <span style={{ marginLeft: '4px' }}>{value}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 分类（多选，至少一个） */}
        <div className={styles.formGroup}>
          <label className={styles.label}>分类（可多选，至少一个）</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {Object.entries(TAG_CATEGORY).map(([key, value]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  value={value}
                  checked={workInfo.categories.includes(value)}
                  onChange={() => handleCategoryChange(value)}
                />
                <span style={{ marginLeft: '4px' }}>{value}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 作品描述 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>描述</label>
          <textarea
            name="description"
            value={workInfo.description}
            onChange={handleWorkInfoChange}
            className={styles.textarea}
            rows="3"
            placeholder="作品描述"
          />
        </div>

        <button onClick={handleSaveWorkInfo} className={styles.buttonPrimary}>
          保存作品信息
        </button>
      </section>

      {/* 章节管理卡片 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>章节管理</h2>

        {/* 章节列表 */}
        {chapters.length > 0 ? (
          <ul className={styles.chapterList}>
            {chapters.map(chapter => (
              <li key={chapter.chapter_number} className={styles.chapterItem}>
                <div className={styles.chapterInfo}>
                  <div className={styles.chapterTitle}>{`第${chapter.chapter_number}章：${chapter.title}`}</div>
                  <div className={styles.chapterContent}>
                    {chapter.content.length > 50
                      ? chapter.content.substring(0, 50) + '...'
                      : chapter.content}
                  </div>
                </div>
                <div className={styles.chapterActions}>
                  <button
                    onClick={() => handleEditChapter(chapter)}
                    className={styles.buttonDefault}
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDeleteChapter(chapter.id)}
                    className={styles.buttonDanger}
                  >
                    删除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyText}>暂无章节，请添加</p>
        )}

        {/* 添加/编辑章节表单 */}
        <div className={styles.chapterForm}>
          <h3 className={styles.formTitle}>
            {editingId !== null ? '编辑章节' : '新增章节'}
          </h3>
          <div className={styles.formGroup}>
            <label className={styles.label}>标题</label>
            <input
              type="text"
              name="title"
              value={chapterForm.title}
              onChange={handleChapterFormChange}
              className={styles.input}
              placeholder="章节标题"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>内容</label>
            <textarea
              name="content"
              value={chapterForm.content}
              onChange={handleChapterFormChange}
              className={styles.textarea}
              rows={6}
              placeholder="章节内容"
            />
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={handleSaveChapter} className={styles.buttonPrimary}>
              {editingId !== null ? '更新章节' : '添加章节'}
            </button>
            {editingId !== null && (
              <button onClick={handleCancelChapter} className={styles.buttonDefault}>
                取消
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorksManagement;