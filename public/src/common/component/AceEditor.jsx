/**
 * @file ACE编辑器组件
 * @author Franck Chen(chenfan02@baidu.com)
 */

// React
import React, {Component, PropTypes} from 'react';

/**
 * ACE编辑器组件
 * @extend Component
 */
class JSONEditor extends Component {
    constructor(props) {
        super(props);

        this.aceEditor = null;

        this.state = {
            content: props.content
        };

        switch (props.lanType) {
            case 'json':
                // JSON数据在置入编辑器内时先格式化一下
                this.state.content = JSON.stringify(props.content, null, 4);
                break;
        }
    };

    componentDidMount() {
        // 生成JSON编辑器
        this.aceEditor = ace.edit('ace-editor');
        // 设置皮肤
        this.aceEditor.setTheme('ace/theme/monokai');

        const {lanType} = this.props;
        // 设置语法
        this.aceEditor.session.setMode('ace/mode/' + lanType);
    };

    /**
     * 获取编辑器内容的接口
     *
     * @return {string} 编辑器内容
     * @public
     */
    getEditorContent() {
        return this.aceEditor.getValue();
    };

    /**
     * 获取编辑器内容是否合法
     *
     * @return {boolean} 当前内容是否合法
     * @public
     */
    getValidity() {
        return this.aceEditor.getSession().getAnnotations().length <= 0;
    };

    render() {
        return (
            <div id="ace-editor">
                {this.state.content}
            </div>
        );
    };
}

export default JSONEditor;
