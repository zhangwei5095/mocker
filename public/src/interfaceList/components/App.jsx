/**
 * @file 接口列表页面主容器组件
 * @author Franck Chen(franckchen@foxmail.com)
 */

// React
import React, {Component, PropTypes} from 'react';

// redux
import {connect} from 'react-redux';

// 第三方
import request from 'superagent';

// ui组件
import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button';
import Snackbar from 'material-ui/lib/snackbar';

// icon
import AddIcon from 'material-ui/lib/svg-icons/content/add';

// 模块组件
import InterfaceList from './InterfaceList.jsx';
import InterfaceCtrlModal from './InterfaceCtrlModal.jsx';
import DoubleCheckModal from 'common/component/DoubleCheckModal.jsx';
import GetFiddlerConfigDialog from './GetFiddlerConfigDialog.jsx';

// actions
import * as actions from '../actions/actions.es6';

/**
 * 主容器组件
 * @extend Component
 */
class App extends Component {
    constructor(props) {
        super(props);

        const dispatch = this.props.dispatch;

        this.buttonLabelStyle = {
            fontFamily: 'Microsoft Yahei',
            fontSize: '20px'
        };

        // 增加新接口按键样式
        this.addNewButtonStyle = {
            width: '300px'
        };

        this.onAddNewInterface = () => {
            dispatch(actions.showModal('增加新接口'));
        };

        this.onAcceptDoubleCheck = this.onAcceptDoubleCheck.bind(this);
        this.onRejectDoubleCheck = this.onRejectDoubleCheck.bind(this);
        this.onAfterGetURL = this.onAfterGetURL.bind(this);
    };

    /**
     * 二次确认浮窗点击确定时
     */
    onAcceptDoubleCheck() {
        const {dispatch, doubleCheck} = this.props;

        dispatch(actions.delInterface(doubleCheck.data.interfaceId));
        dispatch(actions.hideDoubleCheck());
    };

    /**
     * 二次确认浮窗点击取消时
     */
    onRejectDoubleCheck() {
        this.props.dispatch(actions.hideDoubleCheck());
    };

    /**
     * 用户在输入了本机需要模拟的URL后调用该函数，目的是下载fiddler配置
     *
     * @param {string} originURL 本机的URL
     * @param {string} relativeURL 模拟接口的相对URL
     */
    onAfterGetURL(originURL, relativeURL) {
        const downloadURL = `/admin/getFiddlerConfig?originURL=${originURL}&relativeURL=${relativeURL}`;

        window.open(downloadURL);
        this.props.dispatch(actions.getFiddlerConfigDialogSwitch('hide'));
    };

    render() {
        const {props} = this;
        const {doubleCheck, fiddlerConfigDialog, dispatch} = props;

        return (
            <div className="app-container">
                <div className="top-btn-container">
                    <RaisedButton className="add-new-interface"
                                  label="添加新接口"
                                  labelPosition="after"
                                  labelStyle={this.buttonLabelStyle}
                                  secondary={true}
                                  icon={<AddIcon />}
                                  style={this.addNewButtonStyle}
                                  onMouseDown={this.onAddNewInterface} />
                </div>
                <div className="list-container">
                    <InterfaceList />
                </div>
                <InterfaceCtrlModal hostURL={props.hostURL} />
                <Snackbar open={props.snackbarData.open}
                          message={props.snackbarData.text}
                          autoHideDuration={props.snackbarData.autoHideDuration}
                          onRequestClose={() => {dispatch(actions.hideSnackBar())}} />
                <DoubleCheckModal title={doubleCheck.title}
                                  text={doubleCheck.text}
                                  open={doubleCheck.open}
                                  onClickAcceptButton={this.onAcceptDoubleCheck}
                                  onClickRejectButton={this.onRejectDoubleCheck} />
                <GetFiddlerConfigDialog open={fiddlerConfigDialog.open}
                                        relativeURL={fiddlerConfigDialog.relativeURL}
                                        afterGetURL={this.onAfterGetURL}
                                        onCancel={() => {
                                            dispatch(actions.getFiddlerConfigDialogSwitch('hide'))
                                        }} />
            </div>
        );
    };
}

function extractData(state) {
    return {
        modalData: state.modalData,
        interfaceData: state.interfaceList,
        snackbarData: state.snackbarData,
        doubleCheck: state.doubleCheck,
        fiddlerConfigDialog: state.fiddlerConfigDialog
    };
}

// 链接Redux
export default connect(extractData)(App);
