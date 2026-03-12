import styles from './Works.module.css'
import { userApi } from '../../api';
import { useState, useEffect } from 'react';
import NovelCard from '../../components/NovelCard';
import Pagination from '../../components/Pagination';
import React from 'react';

const Works = () => {
    //小说
    const [novels, setNovels] = useState([])
    //当前页
    const [currentPage, setCurrentPage] = useState(1);
    //每页显示多少条数据
    const ITEMS_PER_PAGE = 10

    //获取数据
    useEffect(() => {
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        userApi.works().then(res => {
            setNovels(res.data.result)
        })
    }, []);

    //获取分页后的数据
    const getPagedData = () => {
        const data = novels;
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return data.slice(startIndex, endIndex);
    };

    const currentData = getPagedData();

    const handleDeleteNovel = (deletedId: any) => {
        setNovels((prevNovels: any) => prevNovels.filter((novel: any) => novel.id !== deletedId));
    };

    return (
        <div>
            {/* 作品头部 */}
            <header className={styles.worksHeader}>
                <div className="container text-center">
                    <h1 className="display-4 fw-bold">作品</h1>
                </div>
            </header>
            {/* 作品主体 */}
            <main className="container">
                <section>
                    {currentData.length > 0 ? (
                        currentData.map((novel: any) => <NovelCard key={novel.title} novel={novel} onDelete={handleDeleteNovel} />)
                    ) : (
                        <p className="text-center">暂无数据</p>
                    )}
                </section>
                <Pagination
                    totalItems={novels.length}
                    onChange={({
                        currentPage
                    }: any) => setCurrentPage(currentPage)}
                />
            </main>
        </div>
    );
};

export default Works;