import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import * as flashAction from '../actions/flash'

// 单个消息
const FlashMessage = (props) => {

    const dispatch = useDispatch();
    const removeClick = ()=>{
        dispatch({ type: "delFlash", id: props.item.id }); 
    }

    return (
        <div className={classnames('alert','alert-dismissible','fade','show', {
            'alert-success': props.item.type === 'success',
            'alert-danger': props.item.type === 'danger'
        })} role='alert'>
            {props.item.msg}
            <button type="button" className="btn-close" data-dismiss="alert" aria-label="Close" onClick={removeClick}></button>
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