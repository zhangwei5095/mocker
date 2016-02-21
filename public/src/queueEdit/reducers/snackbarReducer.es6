/**
 * @file 队列编辑页snackbar reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

const initState = {
    open: false,
    action: '',
    text: '',
    // 设置为0则永久显示，代码控制显隐，不需要自动
    autoHideDuration: 0
};

export default (state = initState, action) => {
    switch (action.type) {
        case 'SAVE/SUCCESS':
            return Object.assign(
                {},
                state,
                {
                    open: true,
                    text: '保存成功！'
                }
            );
        case 'SAVE/FAILED':
            return Object.assign(
                {},
                state,
                {
                    open: true,
                    text: '保存失败'
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
