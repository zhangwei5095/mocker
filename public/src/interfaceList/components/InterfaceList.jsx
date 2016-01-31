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
                        <TableHeaderColumn>接口地址</TableHeaderColumn>
                        <TableHeaderColumn>接口类型</TableHeaderColumn>
                        <TableHeaderColumn>注册响应数量</TableHeaderColumn>
                        <TableHeaderColumn>当前激活响应</TableHeaderColumn>
                        <TableHeaderColumn>编辑</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}
                           showRowHover={true}>
                    {
                        interfaceData.map(data => {
                            // 当前激活的响应的名字
                            let activeResponseName;

                            activeResponseName = data.activeResponse
                                ? data.activeResponse.name
                                : '暂无激活的响应';

                            return (
                                <TableRow>
                                    <TableRowColumn>{data.url}</TableRowColumn>
                                    <TableRowColumn>JSON</TableRowColumn>
                                    <TableRowColumn>{data.responses.length}</TableRowColumn>
                                    <TableRowColumn>{activeResponseName}</TableRowColumn>
                                    <TableRowColumn>
                                        <IconButton iconClassName="icon-pencil">
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
