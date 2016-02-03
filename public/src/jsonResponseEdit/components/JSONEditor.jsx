/**
 * @file JSON响应编辑页面编辑器组件
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
class JSONEditor extends Component {
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
export default connect(extractData)(JSONEditor);
