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
        case 'RESPONSE/MOVE':
            return Object.assign(
                {},
                state,
                {
                    // 移动过后，必然是没有选中的，所以调节序号至-1
                    selectedIndex: -1,
                    responses: [
                    ]
                }
            );
        default:
            return state;
    }
};
