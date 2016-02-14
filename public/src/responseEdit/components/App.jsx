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
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Slider from 'material-ui/lib/slider';
import Divider from 'material-ui/lib/divider';

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

        // 目前支持设置的HTTP状态码
        this.httpStatusCodes = [
            200, 404, 500
        ];

        this.styles = {
            headline: {
                fontSize: 24,
                paddingTop: 16,
                marginBottom: 12,
                fontWeight: 400
            },
            tab: {
                marginTop: '10px'
            }
        };

        this.state = {
            // 打开页面时激活的tab序号，从0开始计算
            activeTabIndex: 0
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
            const content = aceEditor.getEditorContent();
            const {responseData} = props;

            request
                .post('/admin/saveResponse')
                .send(
                    {
                        interfaceId,
                        responseId,
                        responseName,
                        responseData: content,
                        delay: responseData.delay,
                        httpStatusCode: props.responseData.httpStatusCode,
                        type: responseData.type.toUpperCase()
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
            // 切换到到编辑tab页
            this.setState({
                activeTabIndex: 0
            });

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
        const {props, styles, state} = this;
        let {responseData, doubleCheckModal, tipData, dispatch} = props;

        return (
            <div className="app-container">
                <AppBar
                    title={`响应所属接口地址:${props.interfaceURL}`}
                    iconElementLeft={
                        <IconButton iconClassName="icon-home" />
                    } />
                <Tabs style={styles.tab}
                      value={state.activeTabIndex}
                      onChange={(value) => {
                          this.setState({activeTabIndex: value})}
                      }>
                    <Tab label="响应设置" value={0}>
                        <div>
                            <TextField ref="responseName"
                                       hintText="响应名称"
                                       floatingLabelText="响应名称"
                                       defaultValue={responseData.name}
                                       style={this.responseNameInputStyle}
                                       onChange={(e) => {
                                            e.stopPropagation();
                                       }} />
                            <AceEditor ref="aceEditor"
                                       lanType={props.responseType.toLowerCase()}
                                       content={responseData.data} />
                            <div className="tip-container">
                                <Tip text={tipData.text}
                                     skin={tipData.skin}
                                     iconClass={tipData.iconClass}
                                     display={tipData.display} />
                            </div>
                        </div>
                    </Tab>
                    <Tab label="参数设值" value={1}>
                        <div className="http-code-container">
                            <span>HTTP状态码：</span>
                            <DropDownMenu ref="httpStatusCodeMenu"
                                          maxHeight={300}
                                          value={responseData.httpStatusCode}
                                          onChange={(event, index, value) => {
                                              dispatch(actions.httpStatusCodeChange(value));
                                          }}>
                                {
                                    this.httpStatusCodes.map((code) => {
                                        return (<MenuItem value={code} primaryText={code} />);
                                    })
                                }
                            </DropDownMenu>
                        </div>
                        <Divider />
                        <div className="delay-container">
                            <span>延迟：{responseData.delay}(毫秒)</span>
                            <Slider ref="delaySlider"
                                    defaultValue={responseData.delay}
                                    min={0}
                                    max={30000}
                                    step={200}
                                    onChange={() => {
                                        const delayTime = this.refs.delaySlider.getValue();
                                        dispatch(actions.delayTimeChange(delayTime));
                                    }} />
                        </div>
                    </Tab>
                </Tabs>
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
