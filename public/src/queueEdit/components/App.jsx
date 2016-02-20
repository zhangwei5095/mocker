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

// enhance
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
let SelectableList = SelectableContainerEnhance(List);

// icon
import ArrowLeftIcon from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-left';
import ArrowRightIcon from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-right';
import HomeIcon from 'material-ui/lib/svg-icons/action/home';

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

        this.listChange = this.listChange.bind(this);
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

    render() {
        const {props} = this;
        const {responses, queuedResponses} = props;

        return (
            <div className="app-container">
                <AppBar className="app-bar"
                        title={`队列所属接口地址:/${props.interfaceURL}`}
                        iconElementLeft={<IconButton><HomeIcon /></IconButton>} />
                <div className="manage-panel">
                    <SelectableList className="list-container"
                                    subheader="所有响应"
                                    valueLink={{
                                        value: props.resSelValue,
                                        requestChange: (e, value) => {
                                            // left表示此次点中的是左侧列表
                                            this.listChange('left', value);
                                        }
                                    }}>
                        {
                            responses.map(function (response) {
                                return (<ListItem primaryText={response.name}
                                                  secondaryText={`类型:${response.type}`}
                                                  value={response._id} />);
                            })
                        }
                    </SelectableList>
                    <div className="center-button-container">
                        <div className="move-btn-container">
                            <FloatingActionButton style={{marginBottom: '15px'}}
                                                  disabled={props.moveRightBtnDisabled} >
                                <ArrowRightIcon />
                            </FloatingActionButton>
                            <FloatingActionButton disabled={props.moveLeftBtnDisabled} >
                                <ArrowLeftIcon />
                            </FloatingActionButton>
                        </div>
                    </div>
                    <SelectableList className="list-container"
                                    subheader="队列中的响应"
                                    valueLink={{
                                        value: props.queuedResSelValue,
                                        requestChange: (e, value) => {
                                            // left表示此次点中的是左侧列表
                                            this.listChange('right', value);
                                        }
                                    }}>
                        {
                            queuedResponses.map(function (response) {
                                return (<ListItem primaryText={response.name}
                                                  secondaryText={`类型:${response.type}`}
                                                  value={response._id} />);
                            })
                        }
                    </SelectableList>
                </div>
                <div className="bottom"></div>
            </div>
        );
    };
}

function extractData(state) {
    const {responsesData, queuedResponsesData} = state;

    return {
        resSelValue: responsesData.selected,
        queuedResSelValue: queuedResponsesData.selected,
        responses: responsesData.responses,
        queuedResponses: queuedResponsesData.responses,
        // 右移按键(将响应移入队列)是否置灰，默认状态下，没有选择响应，所以是置灰的
        moveRightBtnDisabled: responsesData.moveBtnDisabled,
        moveLeftBtnDisabled: queuedResponsesData.moveBtnDisabled
    };
}

// 链接Redux
export default connect(extractData)(App);
