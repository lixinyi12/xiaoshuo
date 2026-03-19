import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import { DEL_FLASH } from '../constants/index';
import { RootState, AppDispatch } from '../store'

interface FlashItem {
    type: string,
    id: string,
    msg?: string
}

// 单条消息
const FlashMessage = ({
    item
}: { item: FlashItem }) => {
    const dispatch = useDispatch.withTypes<AppDispatch>()();
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
    const flashs = useSelector((state: RootState) => state.flash || []);
    return (
        <div>
            {flashs.map((item: FlashItem) => <FlashMessage key={item.id} item={item} />)}
        </div>
    );
}

export default FlashMessageList;
