/**
 * @file 获取fiddler配置的浮窗组件
 * @author Franck Chen(chenfan02@baidu.com)
 */

// React
import React, {Component, PropTypes} from 'react';

// ui组件
import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

import validator from 'validator';

export default class GetFiddlerConfigDialog extends Component {
    constructor(props) {
        super(props);

        this.actions = [
            <RaisedButton label="获取"
                          secondary={true}
                          onMouseDown={() => {this.tryGetConfig()}} />,
            <RaisedButton label="取消"
                          onMouseDown={() => {props.onCancel()}} />
        ];

        this.state = {
            protocol: 'http://',
            validityInfo: ''
        };

        this.selectFieldStyle = {
            width: '100px'
        };

        this.handleChange = this.handleChange.bind(this);
        this.tryGetConfig =  this.tryGetConfig.bind(this);
    };

    // 下拉菜单发生变化时触发
    handleChange(event, index, value) {
        this.setState(
            {
                protocol: value
            }
        );
    };

    // 用户点击了获取按键时触发，检查URL合法性，如果合法触发props定义的方法，由调用方处理
    tryGetConfig() {
        const {props} = this;

        // 用户输入的那么部分URL
        let inputValue = this.refs.input.getValue().trim();
        // 整体URL
        const originURL = `${this.state.protocol}${inputValue}\/${props.relativeURL}`;

        if (validator.isURL(originURL)) {
            props.afterGetURL(originURL, props.relativeURL);
        }
        else {
            this.setState({
                validityInfo: 'URL不合法，请修改'
            });
        }
    };

    render() {
        const {props} = this;

        return (
            <Dialog
                title="获取fiddler配置"
                open={props.open}
                modal={true}
                actions={this.actions}>
                <SelectField value={this.state.protocol}
                             onChange={this.handleChange}
                             style={this.selectFieldStyle}>
                    <MenuItem value="http://" primaryText="http://" />
                    <MenuItem value="https://" primaryText="https://" />
                </SelectField>
                <TextField ref="input" hintText="本地接口地址" />
                {'/' + props.relativeURL}
                <div className="validity-info">{this.state.validityInfo}</div>
            </Dialog>
        );
    };
};
