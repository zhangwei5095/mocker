/**
 * @file 接口列表页面主容器组件
 * @author Franck Chen(franckchen@foxmail.com)
 */

// React
import React, {Component, PropTypes} from 'react';

// redux
import {connect} from 'react-redux';

// ui组件
import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button';
import Snackbar from 'material-ui/lib/snackbar';

// 模块组件
import InterfaceList from './InterfaceList.jsx';
import InterfaceCtrlModal from './InterfaceCtrlModal.jsx';
import DoubleCheckModal from 'common/component/DoubleCheckModal.jsx';

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

    render() {
        const {doubleCheck} = this.props;

        return (
            <div className="app-container">
                <div className="top-btn-container">
                    <RaisedButton
                        className="add-new-interface"
                        label="添加新接口"
                        labelPosition="after"
                        labelStyle={this.buttonLabelStyle}
                        secondary={true}
                        style={this.addNewButtonStyle}
                        icon={<FontIcon className="icon-plus" />}
                        onMouseDown={this.onAddNewInterface} />
                </div>
                <InterfaceList />
                <InterfaceCtrlModal
                    hostURL={this.props.hostURL} />
                <Snackbar
                    open={this.props.snackbarData.open}
                    message={this.props.snackbarData.text}
                    autoHideDuration={this.props.snackbarData.autoHideDuration}
                />
                <DoubleCheckModal title={doubleCheck.title}
                                  text={doubleCheck.text}
                                  open={doubleCheck.open}
                                  onClickAcceptButton={this.onAcceptDoubleCheck}
                                  onClickRejectButton={this.onRejectDoubleCheck} />
            </div>
        );
    };
}

function extractData(state) {
    return {
        modalData: state.modalData,
        interfaceData: state.interfaceList,
        snackbarData: state.snackbarData,
        doubleCheck: state.doubleCheck
    };
}

// 链接Redux
export default connect(extractData)(App);
