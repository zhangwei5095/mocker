/**
 * @file 接口列表页接口snackbar reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

const initState = {
    open: false,
    text: '',
    // 设置为0则永久显示，代码控制显隐，不需要自动
    autoHideDuration: 0
};

export default (state = initState, action) => {
    switch (action.type) {
        case 'SHOW_SNACK_BAR':
            return Object.assign(
                {},
                state,
                {
                    open: true,
                    text: action.text
                }
            );
        case 'SNACK_BAR/HIDE':
            return Object.assign(
                {},
                state,
                {
                    open: false,
                    text: ''
                }
            );
        default:
            return state;
    }
};
