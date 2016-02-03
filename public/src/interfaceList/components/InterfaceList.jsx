/**
 * @file 接口列表页详情列表组件
 * @author Franck Chen(chenfan02@baidu.com)
 */

// React
import React, {Component, PropTypes} from 'react';

// redux
import {connect} from 'react-redux';

// 组件
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';

/**
 * 接口列表组件
 * @extend Component
 */
class InterfaceList extends Component {
    constructor(props) {
        super(props);

        // 表单的列名集合
        this.colNames = [
            '接口地址', '接口类型', '注册响应数量',
            '当前激活响应', '编辑'
        ];

        // 头部列样式
        this.headerColStyle = {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#fff',
            backgroundColor: '#fd5b78',
            fontFamily: 'Microsoft Yahei',
            borderRight: '1px solid #fff'
        };
    };

    /**
     * 获取响应列表页地址
     *
     * @param {string} interfaceId
     */
    getResponseListURL(interfaceId) {
        if (!interfaceId) {
            return '#';
        }

        return `admin/responseList?interfaceId=${interfaceId}`;
    };

    render() {
        // 消息集合数组
        const {interfaceData} = this.props;

        return (
            <Table selectable={false}>
                <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}>
                    <TableRow>
                        {
                            this.colNames.map(
                                name => <TableHeaderColumn style={this.headerColStyle}>{name}</TableHeaderColumn>
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

                            // 单元格基础样式
                            const cellStyle = {
                                borderRight: '1px solid #d9d6cf'
                            };

                            // 为没有激活响应的接口添加个底色提示
                            let responseCellStyle = hasActiveResponse
                                ? {}
                                : {
                                    backgroundColor: '#ff4500',
                                    color: '#fff'
                                };

                            // 融合上基础样式
                            responseCellStyle = Object.assign({}, responseCellStyle, cellStyle);

                            return (
                                <TableRow>
                                    <TableRowColumn style={cellStyle}>{data.url}</TableRowColumn>
                                    <TableRowColumn style={cellStyle}>JSON</TableRowColumn>
                                    <TableRowColumn style={cellStyle}>{data.responses.length}</TableRowColumn>
                                    <TableRowColumn style={responseCellStyle}>{activeResponseName}</TableRowColumn>
                                    <TableRowColumn style={cellStyle}>
                                        <IconButton iconClassName="icon-pencil"
                                                    linkButton={true}
                                                    href={this.getResponseListURL(data._id)}>
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
