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
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import Popover from 'material-ui/lib/popover/popover';
import PopoverAnimationFromTop from 'material-ui/lib/popover/popover-animation-from-top';

// 第三方库
import request from 'superagent';

// 组件
import ResponseList from './ResponseList.jsx';
import DoubleCheck from 'common/component/DoubleCheckModal.jsx';

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

        this.state = {
            responseTypePopOverOpen: false
        };

        this.styles = {
            popover: {
                padding: 20,
                textAlign: 'center'
            }
        };

        this.onClickSave = this.onClickSave.bind(this);
        this.hideDoubleCheck = this.hideDoubleCheck.bind(this);
        this.onAcceptDoubleCheck = this.onAcceptDoubleCheck.bind(this);
        this.handleResponseTypePopOver = this.handleResponseTypePopOver.bind(this);
    };

    /**
     * 点击保存按键时的处理函数
     */
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

    /**
     * 隐藏二次确认浮窗
     */
    hideDoubleCheck() {
        const {dispatch} = this.props;

        dispatch(actions.hideDoubleCheck());
    };

    /**
     * 以id为依据删除某个响应
     *
     * @param {string} responseId 要删除的响应的id
     */
    deleteResponse(responseId) {
        const {dispatch, interfaceId} = this.props;

        request
            .post('/admin/deleteResponse')
            .send(
                {
                    responseId
                }
            )
            .end(
                (err, res) => {
                    // 保存成功和失败分别派发不同的action
                    (!err && res.ok)
                        // TODO JSON响应判断status
                        ? dispatch(actions.deleteSuccess())
                        : dispatch(actions.deleteFailed());

                    // 删除完成后刷新响应列表
                    dispatch(actions.refreshResponseList(interfaceId));
                }
            );
    };

    /**
     * 用户接受了二次确认时的处理函数
     */
    onAcceptDoubleCheck() {
        const {dispatch, doubleCheck} = this.props;

        // 判断二次确认是为了确认啥
        switch (doubleCheck.checkFor) {
            // 如果二次确认是为了确认是否删除某个响应的话
            case 'DELETE_RESPONSE':
                // 删除响应
                this.deleteResponse(doubleCheck.data.responseId);
                // 隐藏二次确认浮窗
                dispatch(actions.hideDoubleCheck());

                break;
            default:
                return;
        }
    };

    handleResponseTypePopOver(e, data) {
        this.setState({
            responseTypePopOverOpen: data.open,
            responseTypePopOverAnchor: e.currentTarget
        });
    };

    render() {
        const {snackbarData, interfaceId, doubleCheck, dispatch} = this.props;

        return (
            <div className="app-container">
                <AppBar
                    title={'/' + this.props.interfaceURL}
                    iconElementLeft={
                        <IconButton iconClassName="icon-home"
                                    tooltip="模拟接口相对路径"
                                    tooltipPosition="bottom-right" />
                    } />
                <div className="top-btn-container">
                    <RaisedButton
                        label="添加新响应"
                        labelPosition="after"
                        style={this.topButtonStyle}
                        secondary={true}
                        icon={<FontIcon className="icon-plus" />}
                        onTouchTap={(e) => {this.handleResponseTypePopOver(e, {open: true})}} />
                    <Popover
                        open={this.state.responseTypePopOverOpen}
                        anchorEl={this.state.responseTypePopOverAnchor}
                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        onRequestClose={(e) => {this.handleResponseTypePopOver(e, {open: false})}}
                        animation={PopoverAnimationFromTop}
                        style={this.styles.popover}>
                        <div>
                            <RaisedButton
                                label="JSON响应"
                                style={this.topButtonStyle}
                                labelPosition="after"
                                secondary={true}
                                disabled={this.props.newBtnData.disabled}
                                linkButton={true}
                                href={`/admin/responseEdit?interfaceId=${interfaceId}&type=JSON`} />
                            <RaisedButton
                                label="HTML响应"
                                style={this.topButtonStyle}
                                labelPosition="after"
                                secondary={true}
                                disabled={this.props.newBtnData.disabled}
                                linkButton={true}
                                href={`/admin/responseEdit?interfaceId=${interfaceId}&type=HTML`} />
                        </div>
                    </Popover>
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
                          onActionTouchTap={this.onClickSave}
                          onRequestClose={() => {dispatch(actions.snackbarAutoHide())}} />
                <DoubleCheck title={doubleCheck.title}
                             text={doubleCheck.text}
                             open={doubleCheck.open}
                             onClickAcceptButton={this.onAcceptDoubleCheck}
                             onClickRejectButton={this.hideDoubleCheck} />
            </div>
        );
    };
}

function extractData(state) {
    return {
        activeResponseId: state.responseData.activeResponseId,
        snackbarData: state.snackbarData,
        saveBtnData: state.buttonsData.save,
        newBtnData: state.buttonsData.add,
        doubleCheck: state.doubleCheck
    };
}

// 链接Redux
export default connect(extractData)(App);
