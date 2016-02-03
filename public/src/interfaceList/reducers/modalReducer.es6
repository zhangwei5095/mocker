/**
 * @file 接口列表页浮窗reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

const initState = {
    open: false,
    title: '添加新接口',
    urlErrorTip: ''
};

export default (state = initState, action) => {
    switch (action.type) {
        case 'SHOW_MODAL':
            return Object.assign(
                {},
                state,
                {
                    open: true,
                    title: action.title,
                    urlErrorTip: ''
                }
            );
        case 'HIDE_MODAL':
            return {
                open: false,
                title: '',
                urlErrorTip: ''
            };
        case 'SHOW_URL_ERROR_TIP':
            return {
                open: true,
                title: state.title,
                urlErrorTip: action.urlErrorTip
            };
        default:
            return state;
    }
};
