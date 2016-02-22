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
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

// enhance
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
let SelectableList = SelectableContainerEnhance(List);

// icon
import HomeIcon from 'material-ui/lib/svg-icons/action/home';

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

        // state
        this.state = {
            responseTypePopOverOpen: false
        };

        this.styles = {
            popover: {
                padding: 20,
                textAlign: 'center'
            },
            topButton: {
                width: '150px',
                fontFamily: 'Microsoft Yahei',
                margin: '0 5px'
            },
            popoverButton: {
                margin: '5px'
            }
        };

        this.onClickSave = this.onClickSave.bind(this);
        this.hideDoubleCheck = this.hideDoubleCheck.bind(this);
        this.onAcceptDoubleCheck = this.onAcceptDoubleCheck.bind(this);
        this.handleResponseTypePopOver = this.handleResponseTypePopOver.bind(this);
        this.responseTypeChange = this.responseTypeChange.bind(this);
        this.deleteResponse = this.deleteResponse.bind(this);
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
     * @param {string} id 要删除的响应的id
     * @param {string} responseType 要删除的响应的类型
     */
    deleteResponse(id, responseType) {
        const {dispatch, interfaceId} = this.props;
        let postURL;

        if (responseType === 'JSON' || responseType === 'HTML') {
            postURL = '/admin/deleteResponse';
        }
        else if (responseType === 'QUEUE') {
            postURL = '/admin/deleteQueue';
        }
        else {
            return;
        }

        request
            .post(postURL)
            .send(
                {
                    id
                }
            )
            .end(
                (err, res) => {
                    // 保存成功和失败分别派发不同的action
                    if (err || !res.ok || (JSON.parse(res.text).status !== 0)) {
                        dispatch({
                            type: 'DELETE/FAILED'
                        });
                        return;
                    }

                    // 删除成功
                    dispatch({
                        type: 'DELETE/SUCCESS'
                    });
                    // 删除完成后刷新响应列表
                    dispatch(actions.refreshResponseList(interfaceId, this.props.responseType));
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
            case 'RESPONSE/DELETE':
                const {responseId, responseType} = doubleCheck.data;
                // 删除响应
                this.deleteResponse(responseId, responseType);
                // 隐藏二次确认浮窗
                dispatch(actions.hideDoubleCheck());

                break;
            default:
                return;
        }
    };

    responseTypeChange(e, responseType) {
        // this.props.dispatch(actions.filterChange(filter));

        this.props.dispatch(actions.refreshResponseList(this.props.interfaceId, responseType));
    };

    handleResponseTypePopOver(e, data) {
        this.setState({
            responseTypePopOverOpen: data.open,
            responseTypePopOverAnchor: e.currentTarget
        });
    };

    render() {
        const {props} = this;
        const {snackbarData, interfaceId, doubleCheck, interfaceURL, dispatch} = props;
        const {styles} = this;

        return (
            <div className="app-container">
                <AppBar className="app-bar"
                        title={'/' + props.interfaceURL}
                        iconElementLeft={<IconButton><HomeIcon /></IconButton>} />
                <div className="main-content">
                    <div className="left-menu">
                        <SelectableList className=""
                                        subheader="响应类型"
                                        valueLink={{
                                            value: props.responseType,
                                            // 列表切换即过滤类型变化
                                            requestChange: this.responseTypeChange
                                        }}>
                            {
                                ['JSON', 'HTML', 'QUEUE'].map((name) => {
                                    return (<ListItem primaryText={name}
                                                      value={name} />);
                                })
                            }
                        </SelectableList>
                    </div>
                    <div className="list-container">
                        <div className="top-btn-container">
                            <RaisedButton
                                label="添加新响应"
                                labelPosition="after"
                                style={styles.topButton}
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
                                style={styles.popover}>
                                <div>
                                    <RaisedButton
                                        label="JSON响应"
                                        labelPosition="after"
                                        secondary={true}
                                        disabled={this.props.newBtnData.disabled}
                                        linkButton={true}
                                        href={`/admin/responseEdit?interfaceId=${interfaceId}&type=JSON&interfaceURL=/${interfaceURL}`}
                                        style={styles.popoverButton} />
                                    <RaisedButton
                                        label="HTML响应"
                                        labelPosition="after"
                                        secondary={true}
                                        disabled={this.props.newBtnData.disabled}
                                        linkButton={true}
                                        href={`/admin/responseEdit?interfaceId=${interfaceId}&type=HTML&interfaceURL=/${interfaceURL}`}
                                        style={styles.popoverButton} />
                                </div>
                                <div>
                                    <RaisedButton
                                        label="响应队列"
                                        labelPosition="after"
                                        secondary={true}
                                        disabled={this.props.newBtnData.disabled}
                                        linkButton={true}
                                        href={
                                            `/admin/queueEdit`
                                            + `?interfaceId=${interfaceId}`
                                            + `&type=JSON&interfaceURL=/${interfaceURL}`
                                        }
                                        style={styles.popoverButton} />
                                </div>
                            </Popover>
                            <RaisedButton
                                label="保存修改"
                                className="save-btn"
                                style={styles.topButton}
                                labelPosition="after"
                                secondary={true}
                                disabled={props.saveBtnData.disabled}
                                icon={<FontIcon className="icon-floppy-disk" />}
                                onMouseDown={this.onClickSave} />
                        </div>
                        <ResponseList interfaceId={props.interfaceId}
                                      interfaceURL={'/' + props.interfaceURL} />
                    </div>
                </div>
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
        doubleCheck: state.doubleCheck,
        responseType: state.basic.responseType
    };
}

// 链接Redux
export default connect(extractData)(App);
