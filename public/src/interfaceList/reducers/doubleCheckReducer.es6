/**
 * @file 接口列表页接口二次确认弹窗reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

const initState = {
    open: false,
    title: '',
    text: '',
    checkFor: '',
    data: {}
};

export default (state = initState, action) => {
    switch (action.type) {
        case 'INTERFACE/TRY_DELETE':
            return {
                open: true,
                title: '删除确认',
                text: '确认删除这个接口吗？',
                checkFor: 'INTERFACE/DELETE',
                // 没有任何附加数据
                data: {
                    interfaceId: action.interfaceId
                }
            };
        case 'DOUBLE_CHECK/HIDE':
            return initState;
        default:
            return state;
    }
};
