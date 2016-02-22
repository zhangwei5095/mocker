/**
 * @file 响应列表页详情列表组件
 * @author Franck Chen(chenfan02@baidu.com)
 */

// React
import React, {Component, PropTypes} from 'react';

// redux
import {connect} from 'react-redux';

// ui组件
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';
import Toggle from 'material-ui/lib/toggle';

// icon
import DeleteIcon from 'material-ui/lib/svg-icons/action/delete';
import PenIcon from 'material-ui/lib/svg-icons/content/create';

// 模块
import tableStyle from 'common/tableStyle.es6';
import actions from '../actions/actions.es6';

/**
 * 接口列表组件
 * @extend Component
 */
class InterfaceList extends Component {
    constructor(props) {
        super(props);

        // 表单的列名集合
        this.colNames = [
            '是否激活', '响应名称', '响应类型',
            '编辑', '删除'
        ];

        // 组件样式集合
        this.styles = {
            table: {
                borderBottom: '1px solid #d9d6cf'
            }
        };

        this.onClickDelete = this.onClickDelete.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.getResponseEditURL = this.getResponseEditURL.bind(this);
    };

    /**
     * 点击某开关时触发的处理逻辑
     *
     * @param {string} id 响应的id
     */
    onToggle(id) {
        const {activeResponseId, dispatch} = this.props;

        // 包括反选逻辑
        dispatch(actions.changeActiveResponse((activeResponseId === id) ? '' : id));
    };

    /**
     * 点击删除响应按键时的处理逻辑
     *
     * @param {string} responseName 要删除的响应的名字
     * @param {string} responseId 想要删除的响应的id
     */
    onClickDelete(responseName, responseId) {
        const {dispatch} = this.props;

        dispatch(actions.tryToDeleteResponse(responseName, responseId));
    };

    /**
     * 获取编辑某响应的页面地址
     *
     * @param {string} responseType 响应的类型
     * @param {string} responseId 响应id
     * @return {string} 响应编辑页面地址
     */
    getResponseEditURL(responseType, responseId = '') {
        const {interfaceId, interfaceURL} = this.props;

        // JSON和HTML进入ace editor编辑页面
        if (responseType === 'JSON' || responseType === 'HTML') {
            return `/admin/responseEdit`
                + `?interfaceId=${interfaceId}`
                + `&responseId=${responseId}`
                + `&interfaceURL=${interfaceURL}`;
        }

        // 队列进入队列编辑页
        if (responseType === 'QUEUE') {
            return `/admin/queueEdit`
                + `?interfaceId=${interfaceId}`
                + `&queueId=${responseId}`;
        }
    };

    render() {
        const {responses, activeResponseId} = this.props;

        return (
            <Table style={this.styles.table}
                   selectable={false}>
                <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}>
                    <TableRow>
                        {
                            this.colNames.map(
                                name => <TableHeaderColumn style={tableStyle.headerCellStyle}>{name}</TableHeaderColumn>
                            )
                        }
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}
                           showRowHover={true}>
                    {
                        responses.map((response) => {
                            return (
                                <TableRow>
                                    <TableRowColumn style={tableStyle.cellStyle}>
                                        <Toggle defaultToggled={response._id === activeResponseId}
                                                onToggle={() => {this.onToggle(response._id)}} />
                                    </TableRowColumn>
                                    <TableRowColumn style={tableStyle.cellStyle}>{response.name}</TableRowColumn>
                                    <TableRowColumn style={tableStyle.cellStyle}>{response.type}</TableRowColumn>
                                    <TableRowColumn style={tableStyle.cellStyle}>
                                        <IconButton linkButton={true}
                                                    href={this.getResponseEditURL(response.type, response._id)}>
                                            <PenIcon />
                                        </IconButton>
                                    </TableRowColumn>
                                    <TableRowColumn style={tableStyle.cellStyle}>
                                        <IconButton onMouseDown={() => {
                                                        this.onClickDelete(response.name, response._id)}
                                                    }>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableRowColumn>
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>
        );
    };
}

function extractData(state) {
    const responseData = state.responseData;

    return {
        responses: responseData.responses,
        activeResponseId: responseData.activeResponseId
    };
}

// 链接Redux
export default connect(extractData)(InterfaceList);
