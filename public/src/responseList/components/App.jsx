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

// 组件
import ResponseList from './ResponseList.jsx';

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
                        onMouseDown={() => {}} />
                </div>
                <ResponseList />
                <Snackbar open={snackbarData.open}
                          message={snackbarData.text}
                          autoHideDuration={snackbarData.autoHideDuration}
                          action={snackbarData.action} />
            </div>
        );
    };
}

function extractData(state) {
    return {
        snackbarData: state.snackbarData,
        saveBtnData: state.buttonsData.save,
        newBtnData: state.buttonsData.add
    };
}

// 链接Redux
export default connect(extractData)(App);
