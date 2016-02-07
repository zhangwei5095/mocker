/**
 * @file 页面中通用的单确定按键提示框
 * @author Franck Chen(chenfan02@baidu.com)
 */

// React
import React, {Component, PropTypes} from 'react';

// ui组件
import Dialog from 'material-ui/lib/dialog';
import RaisedButton from 'material-ui/lib/raised-button';

export default class ModalTip extends Component {
    constructor(props) {
        super(props);

        let {onConfirm} = this.props;

        this.actions = [
            <RaisedButton label="是"
                          secondary={true}
                          onMouseDown={onConfirm} />
        ];
    };

    render() {
        return (
            <Dialog title={this.props.title}
                    modal={true}
                    open={this.props.open}
                    actions={this.actions}>
                {this.props.text}
            </Dialog>
        );
    };
};

