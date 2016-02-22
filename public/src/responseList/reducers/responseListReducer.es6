/**
 * @file 响应列表页接口列表reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

const initState = [];

export default (state = initState, action) => {
    switch (action.type) {
        case 'RESPONSE_LIST/REFRESH':
            return {
                responses: action.responses,
                activeResponseId: action.activeResponseId
            };
        case 'CHANGE_ACTIVE_RESPONSE':
            return {
                responses: state.responses,
                activeResponseId: action.activeResponseId
            };
        default:
            return state;
    }
};
