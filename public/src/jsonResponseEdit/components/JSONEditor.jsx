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

        this.jsonEditor = null;
    };

    componentDidMount() {
        // 生成JSON编辑器
        this.jsonEditor = ace.edit('json-editor');
        // 设置皮肤
        this.jsonEditor.setTheme('ace/theme/monokai');
        // JSON语法高亮模式
        this.jsonEditor.session.setMode('ace/mode/json');
    };

    /**
     * 获取编辑器内容的接口
     *
     * @return {string} 编辑器内容
     * @public
     */
    getEditorContent() {
        return this.jsonEditor.getValue();
    }

    render() {
        let {content} = this.props;

        return (
            <div id="json-editor">
                {JSON.stringify(content, null, 4)}
            </div>
        );
    };
}

export default JSONEditor;
