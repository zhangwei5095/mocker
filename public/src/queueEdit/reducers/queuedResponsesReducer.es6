/**
 * @file 响应队列编辑页，队列数据reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

export default (state = [], action) => {
    switch (action.type) {
        case 'RIGHT_MENU/CHANGE_SEL':
            // 不为空就表示已经选中了一个响应，按键启用
            const moveBtnDisabled = !action.value;

            return Object.assign(
                {},
                state,
                {
                    selected: action.value,
                    moveBtnDisabled
                }
            );
        default:
            return state;
    }
};
