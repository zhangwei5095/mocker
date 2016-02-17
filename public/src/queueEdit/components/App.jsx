/**
 * @file 队列编辑页容器组件
 * @author Franck Chen(chenfan02@baidu.com)
 */

// React
import React, {Component, PropTypes} from 'react';

// redux
import {connect} from 'react-redux';

// ui组件


// icon

// 第三方
import request from 'superagent';

// 组件

// 模块

/**
 * JSON编辑器组件
 * @extend Component
 */
class App extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <div className="app-container">
            </div>
        );
    };
}

function extractData(state) {
    return {
    };
}

// 链接Redux
export default connect(extractData)(App);
