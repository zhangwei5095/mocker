/**
 * @file 队列编辑页容器组件
 * @author Franck Chen(chenfan02@baidu.com)
 */

// React
import React, {Component, PropTypes} from 'react';

// redux
import {connect} from 'react-redux';

// ui组件
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import AppBar from 'material-ui/lib/app-bar';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import IconButton from 'material-ui/lib/icon-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Snackbar from 'material-ui/lib/snackbar';

// enhance
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
let SelectableList = SelectableContainerEnhance(List);

// icon
import ArrowLeftIcon from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-left';
import ArrowRightIcon from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-right';
import HomeIcon from 'material-ui/lib/svg-icons/action/home';
import TextField from 'material-ui/lib/text-field';

// 第三方
import request from 'superagent';

// 引用模块
import actions from '../actions/actions.es6';

/**
 * JSON编辑器组件
 * @extend Component
 */
class App extends Component {
    constructor(props) {
        super(props);

        this.styles = {
            // 队列名称输入框
            nameInput: {
                width: '500px',
                margin: '0 auto'
            }
        };

        this.listChange = this.listChange.bind(this);
        this.clickSave = this.clickSave.bind(this);
    };

    /**
     * 点击了左右两侧的列表时的处理函数
     *
     * @param {string} position 菜单位置，值可能是left, right
     * @param {string} value 选中的列表项的响应的id
     */
    listChange(position, value) {
        this.props.dispatch(actions.listSelectionChange(position, value));
    };

    /**
     * 点击保存按键时触发
     */
    clickSave() {
        const {props} = this;

        // 队列名称
        const queueName = this.refs.queueName.getValue().trim();

        // 提取队列中响应的id
        const responses = props.queuedResponses.map(function (response) {
            return response._id;
        });

        props.dispatch(actions.clickSave(
            props.interfaceId,
            props.basic.queueId,
            queueName,
            responses
        ));
    };

    render() {
        const {props} = this;
        const {unQueuedResponses, queuedResponses} = props;

        return (
            <div className="app-container">
                <AppBar className="app-bar"
                        title={`队列所属接口地址:/${props.interfaceURL}`}
                        iconElementLeft={<IconButton><HomeIcon /></IconButton>} />
                <TextField hintText="队列名称"
                           floatingLabelText="队列名称"
                           defaultValue={props.queueName}
                           ref="queueName"
                           style={this.styles.nameInput} />
                <div className="manage-panel">
                    <SelectableList className="list-container"
                                    subheader="所有响应"
                                    valueLink={{
                                        value: props.unQueuedSelIndex,
                                        requestChange: (e, value) => {
                                            // 处理选中
                                            this.listChange('unQueued', value);
                                        }
                                    }}>
                        {
                            unQueuedResponses.map(function (response, index) {
                                return (<ListItem primaryText={response.name}
                                                  secondaryText={`类型:${response.type}`}
                                                  value={index} />);
                            })
                        }
                    </SelectableList>
                    <div className="center-button-container">
                        <div className="move-btn-container">
                            <FloatingActionButton style={{marginBottom: '15px'}}
                                                  disabled={props.moveRightBtnDisabled}
                                                  onMouseUp={() => {
                                                      props.dispatch(
                                                          actions.moveResponse('unQueued', props.unQueuedSelIndex)
                                                      );
                                                  }}>
                                <ArrowRightIcon />
                            </FloatingActionButton>
                            <FloatingActionButton disabled={props.moveLeftBtnDisabled}
                                                  onMouseUp={() => {
                                                      props.dispatch(
                                                          actions.moveResponse('queued', props.queuedResSelIndex)
                                                      );
                                                  }}>
                                <ArrowLeftIcon />
                            </FloatingActionButton>
                        </div>
                    </div>
                    <SelectableList className="list-container"
                                    subheader="队列中的响应"
                                    valueLink={{
                                        value: props.queuedResSelIndex,
                                        requestChange: (e, value) => {
                                            // 处理选中
                                            this.listChange('queued', value);
                                        }
                                    }}>
                        {
                            queuedResponses.map(function (response, index) {
                                return (<ListItem primaryText={response.name}
                                                  secondaryText={`类型:${response.type}`}
                                                  value={index} />);
                            })
                        }
                    </SelectableList>
                </div>
                <div className="bottom">
                    <RaisedButton label="保存"
                                  primary={true}
                                  style={{width: '120px'}}
                                  onMouseUp={this.clickSave} />
                </div>
                <Snackbar open={props.snackbarData.open}
                          message={props.snackbarData.text}
                          autoHideDuration={props.snackbarData.autoHideDuration}
                          onRequestClose={() => {props.dispatch(actions.hideSnackBar())}} />
            </div>
        );
    };
}

function extractData(state) {
    // unQueued - 所有没有入队列的响应， queued - 在队列中的响应
    const {unQueued, queued} = state.responses;

    return {
        // 选中的响应的序号
        unQueuedSelIndex: unQueued.selectedIndex,
        // 选中的队列中的响应的序号
        queuedResSelIndex: queued.selectedIndex,
        unQueuedResponses: unQueued.responses,
        queuedResponses: queued.responses,
        // 右移按键(将响应移入队列)是否置灰，默认状态下，没有选择响应，所以是置灰的
        moveRightBtnDisabled: unQueued.moveBtnDisabled,
        moveLeftBtnDisabled: queued.moveBtnDisabled,
        // snackbar相关的数据
        snackbarData: state.snackbarData,
        // 基础信息
        basic: state.basic
    };
}

// 链接Redux
export default connect(extractData)(App);
