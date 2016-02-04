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

// 组件
import JSONEditor from './JSONEditor.jsx';

/**
 * JSON编辑器组件
 * @extend Component
 */
class App extends Component {
    constructor(props) {
        super(props);

        this.onClickSave = this.onClickSave.bind(this);
    };

    onClickSave() {
    };

    render() {
        let {responseData} = this.props;

        return (
            <div>
                <JSONEditor ref="jsonEditor" content={responseData.data} />
                <RaisedButton
                    label="保存"
                    secondary={true}
                    onMouseDown={this.onClickSave}/>
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
