/**
 * @file 接口列表页编辑浮窗组件
 * @author Franck Chen(chenfan02@baidu.com)
 */

// React
import React, {Component, PropTypes} from 'react';

// redux
import {connect} from 'react-redux';

// ui组件
import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

// actions
import {hideModal} from '../actions/actions.es6';

class InterfaceCtrlModal extends Component {
    constructor(props) {
        super(props);

        const dispatch = this.props.dispatch;

        this.onCancel = () => {
            dispatch(hideModal());
        };
    };

    render() {
        // 模态窗口关联数据
        const {modalData} = this.props;

        const actions = [
            <RaisedButton
                label="确定"
                secondary={true}
            />,
            <RaisedButton
                label="取消"
                primary={true}
                onTouchTap={this.onCancel}
            />
        ];

        return (
            <Dialog
                title={modalData.title}
                open={modalData.open}
                modal={true}
                actions={actions}>
                localhost:3000/mock/
                <TextField
                    hintText="请在这里输入模拟接口地址"
                    floatingLabelText="模拟接口地址" />
            </Dialog>
        );
    };
}

function extractData(state) {
    return {
        modalData: state.modalData
    };
}

// 链接Redux
export default connect(extractData)(InterfaceCtrlModal);
