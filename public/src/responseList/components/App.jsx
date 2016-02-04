/**
 * @file 响应列表页容器组件
 * @author Franck Chen(chenfan02@baidu.com)
 */

// React
import React, {Component, PropTypes} from 'react';

// redux
import {connect} from 'react-redux';

// ui组件
import Snackbar from 'material-ui/lib/snackbar';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';

// 第三方库
import request from 'superagent';

// 组件
import ResponseList from './ResponseList.jsx';

// 模块
import actions from '../actions/actions.es6';

/**
 * 主容器组件
 * @extend Component
 */
class App extends Component {
    constructor(props) {
        super(props);

        this.topButtonStyle = {
            width: '150px',
            fontFamily: 'Microsoft Yahei'
        };

        this.onClickSave = this.onClickSave.bind(this);
    };

    onClickSave() {
        const interfaceId = this.props.interfaceId;
        const responseId = this.props.activeResponseId;
        const dispatch = this.props.dispatch;

        // 修改了激活的响应，保存！
        request
            .post('/admin/setActiveResponse')
            .send(
                {
                    interfaceId,
                    responseId
                }
            )
            .end((err, res) => {
                // 保存成功和失败分别派发不同的action
                (!err && res.ok)
                    ? dispatch(actions.saveSuccess())
                    : dispatch(actions.saveFailed());
            });
    };

    render() {
        const {snackbarData} = this.props;

        return (
            <div className="app-container">
                <div className="top-btn-container">
                    <RaisedButton
                        label="添加新响应"
                        style={this.topButtonStyle}
                        labelPosition="after"
                        secondary={true}
                        disabled={this.props.newBtnData.disabled}
                        icon={<FontIcon className="icon-plus" />} />
                    <RaisedButton
                        label="保存"
                        className="save-btn"
                        style={this.topButtonStyle}
                        labelPosition="after"
                        secondary={true}
                        disabled={this.props.saveBtnData.disabled}
                        icon={<FontIcon className="icon-floppy-disk" />}
                        onMouseDown={this.onClickSave} />
                </div>
                <ResponseList interfaceId={this.props.interfaceId} />
                <Snackbar open={snackbarData.open}
                          message={snackbarData.text}
                          autoHideDuration={snackbarData.autoHideDuration}
                          action={snackbarData.action}
                          onActionTouchTap={this.onClickSave} />
            </div>
        );
    };
}

function extractData(state) {
    return {
        activeResponseId: state.responseData.activeResponseId,
        snackbarData: state.snackbarData,
        saveBtnData: state.buttonsData.save,
        newBtnData: state.buttonsData.add
    };
}

// 链接Redux
export default connect(extractData)(App);
