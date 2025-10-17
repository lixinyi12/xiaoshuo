import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

// 单个消息
const FlashMessage = (props) => {
    return (
        <div className={classnames('alert ', {
            'alert-success': props.item.type === 'success',
            'alert-danger': props.item.type === 'danger'
        })}>
            {props.item.msg}
        </div>
    );
};

// 消息数组
const FlashMessageList = () => {
    const flashs = useSelector(state => state.flash || []);
    return (
        <div>
            {flashs.map((ele, index) => (
                <FlashMessage item={ele} key={index} />
            ))}
        </div>
    );
}

export default FlashMessageList;