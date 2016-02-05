/**
 * @file 响应列表页接口列表reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

const initState = [];

export default (state = initState, action) => {
    switch (action.type) {
        case 'REFRESH_RESPONSE_LIST':
            return {
                responses: action.responses,
                activeResponseId: action.activeResponseId
            };
        default:
            return state;
    }
};
