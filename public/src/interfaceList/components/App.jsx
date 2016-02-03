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

// actions
import {showModal} from '../actions/actions.es6';

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
            dispatch(showModal('增加新接口'));
        };
    };

    render() {

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
            </div>
        );
    };
}

function extractData(state) {
    return {
        modalData: state.modalData,
        interfaceData: state.interfaceList,
        snackbarData: state.snackbarData
    };
}

// 链接Redux
export default connect(extractData)(App);
