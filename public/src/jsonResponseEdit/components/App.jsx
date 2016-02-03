/**
 * @file JSON响应编辑页面主容器
 * @author Franck Chen(chenfan02@baidu.com)
 */

// React
import React, {Component, PropTypes} from 'react';

// redux
import {connect} from 'react-redux';

// ui组件

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
            <div></div>
        );
    };
}

function extractData(state) {
    return {
    };
}

// 链接Redux
export default connect(extractData)(App);
