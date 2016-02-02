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
import validator from 'validator';

// actions
import {hideModal, urlErrorTip, saveInterface} from '../actions/actions.es6';

class InterfaceCtrlModal extends Component {
    constructor(props) {
        super(props);

        const dispatch = this.props.dispatch;

        this.onCancel = () => {
            dispatch(hideModal());
        };

        this.onConfirm = this.onConfirm.bind(this);
    };

    // 点击模态窗口的确定时
    onConfirm() {
        const dispatch = this.props.dispatch;

        // 输入框内容
        const userInput = this.refs.interfaceURL.getValue().trim();

        const interfaceURL = `${this.props.hostURL}/mock/${userInput}`;

        if (interfaceURL === '') {
            dispatch(urlErrorTip('请输入URL'));
        }
        // 如果是合法有效的URL
        else if (!validator.isURL(interfaceURL)) {
            dispatch(urlErrorTip('请输入合法的URL'));
        }
        else {
            dispatch(saveInterface(userInput));
        }
    };

    render() {
        // 模态窗口关联数据
        const {modalData} = this.props;

        const actions = [
            <RaisedButton
                label="确定"
                secondary={true}
                onTouchTap={this.onConfirm}
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
                <div className="url-container">
                    <div className="hostURL">{this.props.hostURL}/mock/</div>
                    <TextField
                        hintText="请在这里输入模拟接口地址"
                        floatingLabelText="模拟接口地址"
                        errorText={this.props.modalData.urlErrorTip}
                        ref="interfaceURL"/>
                </div>
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
