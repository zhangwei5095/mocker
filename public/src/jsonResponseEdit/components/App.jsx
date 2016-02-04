/**
 * @file JSON响应编辑页面主容器
 * @author Franck Chen(chenfan02@baidu.com)
 */

// React
import React, {Component, PropTypes} from 'react';

// redux
import {connect} from 'react-redux';

// ui组件
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

// 第三方
import request from 'superagent';

// 组件
import JSONEditor from './JSONEditor.jsx';

// 模块
import actions from '../actions/actions.es6';

/**
 * JSON编辑器组件
 * @extend Component
 */
class App extends Component {
    constructor(props) {
        super(props);

        this.saveButtonStyle = {
            width: '200px'
        };

        this.responseNameInputStyle = {
            width: '600px'
        };

        this.onClickSave = this.onClickSave.bind(this);
    };

    /**
     * 点击保存时处理函数
     */
    onClickSave() {
        // 组件 or DOM
        const jsonEditor = this.refs.jsonEditor;
        const responseNameInput = this.refs.responseName;
        const {dispatch, interfaceId, responseId} = this.props;

        const validity = jsonEditor.getValidity();

        const responseName = responseNameInput.getValue().trim();

        // 校验合法的话，保存修改
        if (validity) {
            const responseData = jsonEditor.getEditorContent();

            request
                .post('/admin/saveJSONResponse')
                .send(
                    {
                        interfaceId,
                        responseId,
                        responseName,
                        responseData
                    }
                )
                .end((err, res) => {
                    if (!err && res.ok) {
                        console.log('ok');
                    }
                });
        }
    };

    render() {
        let {responseData} = this.props;

        return (
            <div className="app-container">
                <TextField ref="responseName"
                           hintText="响应名称"
                           floatingLabelText="响应名称"
                           defaultValue={responseData.name}
                           style={this.responseNameInputStyle} />
                <JSONEditor ref="jsonEditor" content={responseData.data} />
                <div className="button-container">
                    <RaisedButton
                        label="保存"
                        style={this.saveButtonStyle}
                        secondary={true}
                        onMouseDown={this.onClickSave}/>
                </div>
            </div>
        );
    };
}

function extractData(state) {
    return {
        responseData: state.responseData
    };
}

// 链接Redux
export default connect(extractData)(App);
