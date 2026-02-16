import React from 'react';
import CommentCard from '../components/CommentCard';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../api';
import { values } from 'lodash';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../constants/link';
import { TOKEN } from '../constants';

const CommentHistory = () => {
    const [comments,setComments] = useState([])
    const token = localStorage.getItem(TOKEN)
    useEffect(()=>{
        api.comments({token}).then(res =>{
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