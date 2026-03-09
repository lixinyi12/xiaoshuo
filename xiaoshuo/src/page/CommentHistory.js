import React from 'react';
import CommentCard from '../components/CommentCard';
import { useState } from 'react';
import { useEffect } from 'react';
import { userApi } from '../api';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../constants/link';

const CommentHistory = () => {
    const [comments,setComments] = useState([])
    useEffect(()=>{
        userApi.comments().then(res =>{
            setComments(res.data.result)
        })
    },[])

    return (
        <div>
            <NavLink 
                className='text-secondary'
                to={ROUTES.PERSON}
                end
            > ← 返回</NavLink>
            {
                comments.map(comment =>(
                    <CommentCard 
                        key={comment.time}
                        comment={comment}
                    />
                ))
            }
        </div>
    );
};

export default CommentHistory;