/**
 * @file 接口列表页浮窗reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

const initState = {
    open: false,
    title: '添加新接口'
};

function modalReducer(state = initState, action) {
    switch (action.type) {
        case 'SHOW_MODAL':
            return Object.assign(
                {},
                state,
                {
                    title: action.title,
                    open: true
                }
            );
        case 'HIDE_MODAL':
            return {
                open: false,
                title: ''
            };
        default:
            return state;
    }
}

export default modalReducer;
