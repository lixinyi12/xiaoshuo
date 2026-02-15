import styles from './Works.module.css'
import api from '../api';
import { useState,useEffect } from 'react';
import NovelCard from '../components/NovelCard';
import Pagination from '../components/Pagination';

const Works = () => {
    //token
    const token = localStorage.getItem('TOKEN')
    //小说
    const [novels,setNovels] = useState([])
    //当前页
    const [currentPage, setCurrentPage] = useState(1);
    //每页显示多少条数据
    const ITEMS_PER_PAGE = 10

    //获取数据
    useEffect(() => {
        api.works({token}).then(res=>{
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
    const totalPages = Math.ceil(novels.length / ITEMS_PER_PAGE);

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
                        currentData.map((novel) => (
                            <NovelCard key={novel.title} novel={novel} />
                        ))
                    ) : (
                        <p className="text-center">暂无数据</p>
                    )}
                </section>
                <Pagination
                    totalItems={novels.length}
                    onChange={({ currentPage }) => setCurrentPage(currentPage)}
                />
            </main>
        </div>
    );
};

export default Works;