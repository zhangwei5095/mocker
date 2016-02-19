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

// icon

// 第三方
import request from 'superagent';

// 组件

// 模块

/**
 * JSON编辑器组件
 * @extend Component
 */
class App extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        const {props} = this;
        const {responses, queuedResponses} = props;

        return (
            <div className="app-container">
                <AppBar className="app-bar"
                        title={`队列所属接口地址:/${props.interfaceURL}`} />
                <div className="manage-panel">
                    <List class="list-container"
                          subheader="所有响应"
                          insetSubheader={true}>
                        {
                            responses.map(function (response) {
                                return (<ListItem primaryText={response.name}
                                                  secondaryText={`类型:${response.type}`} />);
                            })
                        }
                    </List>
                </div>
                <div className="bottom"></div>
            </div>
        );
    };
}

function extractData(state) {
    return {
        responses: state.responses,
        queuedResponses: state.queuedResponses
    };
}

// 链接Redux
export default connect(extractData)(App);
