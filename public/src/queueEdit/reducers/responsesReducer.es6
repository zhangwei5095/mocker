/**
 * @file 响应队列编辑页，响应数据reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

export default (state = [], action) => {
    switch (action.type) {
        case 'LEFT_MENU/CHANGE_SEL':
            return {
                responses: state.responses,
                selected: action.value
            };
        default:
            return state;
    }
};
