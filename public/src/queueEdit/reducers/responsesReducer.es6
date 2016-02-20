/**
 * @file 响应队列编辑页，响应数据reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

export default (state = [], action) => {
    switch (action.type) {
        case 'LEFT_MENU/CHANGE_SEL':
            // 序号-1，表示没有选中任何一个响应，序号从0开始排
            const moveBtnDisabled = action.selectedIndex === -1;

            return Object.assign(
                {},
                state,
                {
                    selectedIndex: action.selectedIndex,
                    moveBtnDisabled
                }
            );
        default:
            return state;
    }
};
