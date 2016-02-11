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
import AceEditor from 'common/component/AceEditor.jsx';
import DoubleCheckModal from 'common/component/DoubleCheckModal.jsx';
import Tip from 'common/component/Tip.jsx';

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
        this.jumpToResponseList = this.jumpToResponseList.bind(this);
        this.hideDoubleCheck = this.hideDoubleCheck.bind(this);
    };

    /**
     * 点击保存时处理函数
     */
    onClickSave() {
        // 组件 or DOM
        const jsonEditor = this.refs.jsonEditor;
        const responseNameInput = this.refs.responseName;
        const {dispatch, interfaceId} = this.props;
        const responseId = this.props.responseData.responseId || this.props.responseId;

        const responseName = responseNameInput.getValue().trim();
        const validity = jsonEditor.getValidity() && (responseName.length > 0);

        if (!responseName) {
            dispatch(actions.showTempTip('响应名称不能为空'));
            return;
        }

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
                .end(
                    (err, res) => {
                        if (!err && res.ok) {
                            let data = JSON.parse(res.text);

                            // 保存无误的话
                            if (data.status === 0) {
                                dispatch(actions.saveSuccess(data.responseId));
                                return;
                            }
                        }

                        dispatch(actions.saveFailed());
                    }
                );
        }
        else {
            dispatch(actions.showTempTip('请输入合法的JSON的数据'));
        }
    };

    /**
     * 跳转至响应列表页
     */
    jumpToResponseList() {
        location.href = `/admin/responseList?interfaceId=${this.props.interfaceId}`;
    };

    /**
     * 隐藏二次确认模态窗口
     */
    hideDoubleCheck() {
        this.props.dispatch(actions.hideDoubleCheck());
    };

    render() {
        let {responseData, doubleCheckModal, tipData} = this.props;

        return (
            <div className="app-container">
                <TextField ref="responseName"
                           hintText="响应名称"
                           floatingLabelText="响应名称"
                           defaultValue={responseData.name}
                           style={this.responseNameInputStyle} />
                <AceEditor ref="jsonEditor"
                           lanType="json"
                           content={responseData.data} />
                <div className="tip-container">
                    <Tip text={tipData.text}
                         skin={tipData.skin}
                         iconClass={tipData.iconClass}
                         display={tipData.display} />
                </div>
                <div className="button-container">
                    <RaisedButton
                        label="保存"
                        style={this.saveButtonStyle}
                        secondary={true}
                        onMouseDown={this.onClickSave}/>
                </div>
                <DoubleCheckModal title={doubleCheckModal.title}
                                  text={doubleCheckModal.text}
                                  open={doubleCheckModal.open}
                                  onClickAcceptButton={this.jumpToResponseList}
                                  onClickRejectButton={this.hideDoubleCheck} />
            </div>
        );
    };
}

function extractData(state) {
    return {
        responseData: state.responseData,
        doubleCheckModal: state.doubleCheckModal,
        tipData: state.tipData
    };
}

// 链接Redux
export default connect(extractData)(App);
