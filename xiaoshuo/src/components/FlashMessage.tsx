// FlashMessageList.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import { DEL_FLASH } from '../constants/index';

// 单条消息
const FlashMessage = ({
    item
}: any) => {
    const dispatch = useDispatch();
    const removeClick = () => {
        dispatch({ type: DEL_FLASH, id: item.id });
    }

    return (
        <div className={classnames('alert', 'alert-dismissible', 'fade', 'show', {
            'alert-success': item.type === 'success',
            'alert-danger': item.type === 'danger'
        })} role='alert'>
            {item.msg}
                <button type="button" className="btn-close" aria-label="Close" onClick={removeClick}></button>
        </div>
    );
};

// 消息列表
const FlashMessageList = () => {
    const flashs = useSelector(state => state.flash || []);
    return (
        <div>
            {flashs.map((item: any) => <FlashMessage key={item.id} item={item} />)}
        </div>
    );
}

export default FlashMessageList;
