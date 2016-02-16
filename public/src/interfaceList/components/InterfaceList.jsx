/**
 * @file 接口列表页详情列表组件
 * @author Franck Chen(chenfan02@baidu.com)
 */

// React
import React, {Component, PropTypes} from 'react';

// redux
import {connect} from 'react-redux';

// 第三方
import request from 'superagent';

// 组件
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';

// icon
import PenIcon from 'material-ui/lib/svg-icons/content/create';
import FileDownloadIcon from 'material-ui/lib/svg-icons/file/file-download';
import EyeIcon from 'material-ui/lib/svg-icons/action/visibility';
import DeleteIcon from 'material-ui/lib/svg-icons/action/delete';

// 模块
import tableStyle from 'common/tableStyle.es6';
import * as actions from '../actions/actions.es6';

/**
 * 接口列表组件
 * @extend Component
 */
class InterfaceList extends Component {
    constructor(props) {
        super(props);

        // 表单的列名集合
        this.colNames = [
            '接口地址', '注册响应数量', '当前激活响应',
            '编辑', '获取fiddler配置', '预览', '删除'
        ];
    };

    /**
     * 获取响应列表页地址
     *
     * @param {string} interfaceId
     * @return {string}
     */
    getResponseListURL(interfaceId) {
        if (!interfaceId) {
            return '#';
        }

        return `/admin/responseList?interfaceId=${interfaceId}`;
    };

    /**
     * 获取模拟接口预览地址
     *
     * @param {string} relativePath 模拟接口的相对地址
     * @return {string}
     */
    getPreview(relativePath) {
        window.open(`/mock/${relativePath}`);
    };

    render() {
        // 消息集合数组
        const {interfaceData, dispatch} = this.props;

        return (
            <Table selectable={false}>
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
                        interfaceData.map(data => {
                            // 当前激活的响应的名字
                            let activeResponseName;
                            // 是否有处于激活状态的响应
                            const hasActiveResponse = !!data.activeResponse;

                            activeResponseName = hasActiveResponse
                                ? data.activeResponse.name
                                : '暂无激活的响应';

                            // 为没有激活响应的接口添加个底色提示
                            let responseCellStyle = hasActiveResponse
                                ? {}
                                : {
                                    backgroundColor: '#ff4500',
                                    color: '#fff'
                                };

                            // 融合上基础样式
                            responseCellStyle = Object.assign({}, responseCellStyle, tableStyle.cellStyle);

                            return (
                                <TableRow>
                                    <TableRowColumn style={tableStyle.cellStyle}>{data.url}</TableRowColumn>
                                    <TableRowColumn style={tableStyle.cellStyle}>
                                        {data.responseCount}
                                    </TableRowColumn>
                                    <TableRowColumn style={responseCellStyle}>{activeResponseName}</TableRowColumn>
                                    <TableRowColumn style={tableStyle.cellStyle}>
                                        <IconButton linkButton={true}
                                                    href={this.getResponseListURL(data._id)}>
                                            <PenIcon />
                                        </IconButton>
                                    </TableRowColumn>
                                    <TableRowColumn style={tableStyle.cellStyle}>
                                        <IconButton onMouseDown={() => {
                                                        dispatch(actions.getFiddlerConfigDialogSwitch('show', data.url))}
                                                    }>
                                            <FileDownloadIcon />
                                        </IconButton>
                                    </TableRowColumn>
                                    <TableRowColumn style={tableStyle.cellStyle}>
                                        <IconButton onMouseDown={() => {
                                                        this.getPreview(data.url)
                                                    }}>
                                            <EyeIcon />
                                        </IconButton>
                                    </TableRowColumn>
                                    <TableRowColumn style={tableStyle.cellStyle}>
                                        <IconButton onMouseDown={() => {
                                                        dispatch(actions.tryDeleteInterface(data._id))}
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
    return {
        interfaceData: state.interfaceList
    };
}

// 链接Redux
export default connect(extractData)(InterfaceList);
