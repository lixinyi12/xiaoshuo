import styles from './BookShelf.module.css'
import api from '../api';
import { useState,useEffect } from 'react';
import NovelCard from '../components/NovelCard';
import Pagination from '../components/Pagination';

const BookShelf = () => {
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
        api.collect({token}).then(res=>{
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
            {/* 书架头部 */}
            <header className={styles.bookShelfHeader}>
                <div className="container text-center">
                    <h1 className="display-4 fw-bold">书架</h1>
                </div>
            </header>
            {/* 书架主体 */}
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
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </main>
        </div>
    );
};

export default BookShelf;