/**
 * @file 响应列表页模态窗口reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

const initState = {
    open: false,
    title: '',
    text: ''
};

export default (state = initState, action) => {
    switch (action.type) {
        case 'SAVE_SUCCESS':
            return {
                open: true,
                title: '保存成功',
                text: '是否返回响应列表页面？'
            };
        case 'HIDE_DOUBLE_CHECK':
            return {
                open: false,
                title: '',
                text: ''
            };
        default:
            return state;
    }
};
