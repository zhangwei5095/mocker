/**
 * @file 响应列表页接口列表reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

const initState = [];

export default (state = initState, action) => {
    switch (action.type) {
        case 'CHANGE_ACTIVE_RESPONSE':
            return {
                responses: state.responses,
                activeResponseId: action.id
            };
        default:
            return state;
    }
};
