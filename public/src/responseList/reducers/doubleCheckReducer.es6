/**
 * @file 响应列表页二次确认reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

const initState = {
    open: false,
    title: '',
    text: '',
    // 对什么东西进行二次确认
    checkFor: '',
    data: {}
};

export default (state = initState, action) => {
    switch (action.type) {
        case 'RESPONSE/TRY_DELETE':
            return {
                open: true,
                title: '删除确认',
                text: `是否确定要删除名为${action.responseName}响应？`,
                checkFor: 'DELETE_RESPONSE',
                data: action.data
            };
        case 'HIDE_DOUBLE_CHECK':
            return initState;
        default:
            return state;
    }
};
