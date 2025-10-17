import React, { Component } from 'react';
import { connect } from 'react-redux'
import classnames from 'classnames'

// 单个消息
const FlashMessage = (props) => {
    return (
        <div className={classnames('alert ',{
            'alert-success':props.item.type === 'success',
            'alert-danger':props.item.type === 'danger'
        })}>
            {props.item.msg}
        </div>
    );
};

// 消息数组
class FlashMessageList extends Component {
    render(){
        const { flashs = [] } = this.props;
        
        return(
            <div>
                {flashs.map((ele, index) => (
                    <FlashMessage item={ele} key={index} />
                ))}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        flashs: state.flash || []
    }
}

export default connect(mapStateToProps)(FlashMessageList)