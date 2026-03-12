import React from 'react';
import CommentCard from '../components/CommentCard';
import { useState } from 'react';
import { useEffect } from 'react';
import { userApi } from '../api';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../constants/link';

const CommentHistory = () => {
    const [comments, setComments] = useState([])
    useEffect(() => {
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        userApi.comments().then(res => {
            setComments(res.data.result)
        })
    }, [])

    return (
        <div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <NavLink
                className='text-secondary'
                to={ROUTES.PERSON}
                end
            > ← 返回</NavLink>
            {
                comments.map((comment: any) => <CommentCard
                    key={comment.time}
                    comment={comment}
                />)
            }
        </div>
    );
};

export default CommentHistory;