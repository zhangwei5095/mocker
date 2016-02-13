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
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';

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

        this.styles = {
            appBar: {
                position: 'fixed',
                top: 0
            }
        };

        this.onClickSave = this.onClickSave.bind(this);
        this.jumpToResponseList = this.jumpToResponseList.bind(this);
        this.hideDoubleCheck = this.hideDoubleCheck.bind(this);
    };

    /**
     * 点击保存时处理函数
     */
    onClickSave() {
        const {props} = this;
        const {dispatch, interfaceId} = props;

        // 组件 or DOM
        const aceEditor = this.refs.aceEditor;
        const responseNameInput = this.refs.responseName;

        // 注意这个参数可能没有，有的话是修改，没有的话是保存
        const responseId = props.responseData.responseId || props.responseId;

        const responseName = responseNameInput.getValue().trim();
        const validity = aceEditor.getValidity() && (responseName.length > 0);

        if (!responseName) {
            dispatch(actions.showTempTip('响应名称不能为空'));
            return;
        }

        // 校验合法的话，保存修改
        if (validity) {
            const responseData = aceEditor.getEditorContent();

            request
                .post('/admin/saveResponse')
                .send(
                    {
                        interfaceId,
                        responseId,
                        responseName,
                        responseData,
                        type: props.responseType.toUpperCase()
                    }
                )
                .end(
                    (err, res) => {
                        if (!err && res.ok) {
                            // 返回的数据是JSON，所以要解析下
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
            dispatch(actions.showTempTip(`请输入合法的${props.responseType}的数据`));
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
        const {props} = this;
        let {responseData, doubleCheckModal, tipData} = props;

        return (
            <div className="app-container">
                <AppBar
                    title={`响应所属接口地址:${props.interfaceURL}`}
                    iconElementLeft={
                        <IconButton iconClassName="icon-home" />
                    }
                    style={this.styles.appBar} />
                <TextField ref="responseName"
                           hintText="响应名称"
                           floatingLabelText="响应名称"
                           defaultValue={responseData.name}
                           style={this.responseNameInputStyle} />
                <AceEditor ref="aceEditor"
                           lanType={props.responseType.toLowerCase()}
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
