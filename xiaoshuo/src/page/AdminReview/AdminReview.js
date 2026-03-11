import React, { useState, useEffect } from 'react';
import styles from './AdminReview.module.css';
import { REVIEW_STATUS } from '../../constants/reviewStatus'
import { applicationApi } from '../../api'

const mockReviewApplication = (id, action, reason = '') => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`审核申请 ${id}，操作：${action}，原因：${reason}`);
            resolve({ success: true });
        }, 500);
    });
};

const AdminReview = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState(REVIEW_STATUS.PENDING);

    // 拒绝弹窗状态
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    // 加载数据
    useEffect(() => {
        const loadApplications = async () => {
            setLoading(true);
            try {
                const data = (await applicationApi.getApplicationsList(filterStatus)).data.data;
                console.log(data)
                setApplications(data);
            } catch (error) {
                console.error('加载申请列表失败', error);
            } finally {
                setLoading(false);
            }
        };
        loadApplications();
    }, [filterStatus]);

    // 处理通过
    const handleApprove = async (id) => {
        if (!window.confirm('确定要通过该申请吗？')) return;
        setLoading(true);
        try {
            await mockReviewApplication(id, 'approve');
            // 刷新列表
            const data = await applicationApi.getApplicationsList(filterStatus).data.data;
            console.log(data)
            setApplications(data);
        } catch (error) {
            alert('操作失败');
        } finally {
            setLoading(false);
        }
    };

    // 打开拒绝弹窗
    const openRejectModal = (id) => {
        setSelectedId(id);
        setRejectReason('');
        setShowRejectModal(true);
    };

    // 提交拒绝
    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) {
            alert('请输入拒绝原因');
            return;
        }
        setShowRejectModal(false);
        setLoading(true);
        try {
            await mockReviewApplication(selectedId, 'reject', rejectReason);
            const data = (await applicationApi.getApplicationsList(filterStatus)).data.data;
            console.log(data)
            setApplications(data);
        } catch (error) {
            alert('操作失败');
        } finally {
            setLoading(false);
        }
    };

    // 取消拒绝
    const cancelReject = () => {
        setShowRejectModal(false);
        setRejectReason('');
    };

    // 状态标签样式映射
    const statusMap = {
        [REVIEW_STATUS.PENDING]: { text: '待审核', className: styles.statusPending },
        [REVIEW_STATUS.APPROVED]: { text: '已通过', className: styles.statusApproved },
        [REVIEW_STATUS.REJECTED]: { text: '已拒绝', className: styles.statusRejected },
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>认证申请审核</h2>

            {/* 筛选按钮组 */}
            <div className={styles.filterBar}>
                {['all', REVIEW_STATUS.PENDING, REVIEW_STATUS.APPROVED, REVIEW_STATUS.REJECTED].map((status) => (
                    <button
                        key={status}
                        className={`${styles.filterBtn} ${filterStatus === status ? styles.activeFilter : ''}`}
                        onClick={() => setFilterStatus(status)}
                    >
                        {status === 'all' && '全部'}
                        {status === REVIEW_STATUS.PENDING && '待审核'}
                        {status === REVIEW_STATUS.APPROVED && '已通过'}
                        {status === REVIEW_STATUS.REJECTED && '已拒绝'}
                    </button>
                ))}
            </div>

            {/* 申请列表表格 */}
            {loading && <div className={styles.loading}>加载中...</div>}
            {!loading && (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>姓名</th>
                            <th>手机</th>
                            <th>邮箱</th>
                            <th>身份证号</th>
                            <th>申请时间</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.length === 0 ? (
                            <tr>
                                <td colSpan="8" className={styles.noData}>暂无数据</td>
                            </tr>
                        ) : (
                            applications.map((app) => (
                                <tr key={app.id}>
                                    <td>{app.id}</td>
                                    <td>{app.real_name}</td>
                                    <td>{app.phone}</td>
                                    <td>{app.email}</td>
                                    <td>{app.id_card}</td>
                                    <td>{app.apply_time}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${statusMap[app.status]?.className}`}>
                                            {statusMap[app.status]?.text}
                                        </span>
                                    </td>
                                    <td>
                                        {app.status === REVIEW_STATUS.PENDING ? (
                                            <div className={styles.actionBtns}>
                                                <button
                                                    className={`${styles.btn} ${styles.btnApprove}`}
                                                    onClick={() => handleApprove(app.id)}
                                                >
                                                    通过
                                                </button>
                                                <button
                                                    className={`${styles.btn} ${styles.btnReject}`}
                                                    onClick={() => openRejectModal(app.id)}
                                                >
                                                    拒绝
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className={`${styles.btn} ${styles.btnView}`}
                                                onClick={() => alert(`查看详情：${app.id}`)}
                                            >
                                                查看
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            {/* 拒绝原因弹窗 */}
            {showRejectModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>填写拒绝原因</h3>
                        <textarea
                            className={styles.reasonInput}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="请输入拒绝原因..."
                            rows="4"
                        />
                        <div className={styles.modalActions}>
                            <button className={`${styles.btn} ${styles.btnCancel}`} onClick={cancelReject}>
                                取消
                            </button>
                            <button className={`${styles.btn} ${styles.btnConfirm}`} onClick={handleRejectSubmit}>
                                确认拒绝
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReview;