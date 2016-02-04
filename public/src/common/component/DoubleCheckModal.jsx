/**
 * @file 页面中最长用两个按键的模态窗口组件
 * @author Franck Chen(chenfan02@baidu.com)
 */

// React
import React, {Component, PropTypes} from 'react';

// ui组件
import Dialog from 'material-ui/lib/dialog';
import RaisedButton from 'material-ui/lib/raised-button';

export default class DoubleCheckModal extends Component {
    constructor(props) {
        super(props);

        let {onClickAcceptButton, onClickRejectButton} = this.props;

        this.actions = [
            <RaisedButton label="是"
                          secondary={true}
                          onMouseDown={onClickAcceptButton} />,
            <RaisedButton label="否"
                          onMouseDown={onClickRejectButton} />
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
