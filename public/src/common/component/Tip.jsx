/**
 * @file 提示框通用组件
 * @author Franck Chen(chenfan02@baidu.com)
 */

// React
import React, {Component, PropTypes} from 'react';
import ActionHome from 'material-ui/lib/svg-icons/action/home';

export default class Tip extends Component {
    constructor(props) {
        super(props);

        // 组件的所有皮肤
        this.skins = {
            normal: {
                backgroundColor: 'transparent'
            },
            correct: {
                backgroundColor: '#19b076'
            },
            warn: {},
            error: {
                backgroundColor: '#F44336'
            }
        };

        this.fontStyle = {
            color: '#fff'
        };

        this.containerStyle = {
            textAlign: 'left',
            width: 'auto',
            fontFamily: 'Microsoft Yahei',
            padding: '5px'
        };
    };

    render() {
        // 应用到组件上的实际皮肤
        const tipSkin = this.skins[this.props.skin || 'normal'];
        let containerStyle = Object.assign(this.containerStyle, tipSkin);

        if (this.props.display) {
            containerStyle.display = 'block';
        }
        else {
            containerStyle.display = 'none';
        }

        return (
            <div style={containerStyle}>
                <span style={this.fontStyle} className={this.props.iconClass}></span>
                <span style={this.fontStyle}>{this.props.text}</span>
            </div>
        );
    };
};

