/**
 * @file 接口列表页接口列表reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

export default (state = [], action) => {
    switch (action.type) {
        case 'REFRESH_RESPONSE_LIST':
            return {
                responseData: action.responseData,
                activeResponseId: action.activeResponseId
            };
        default:
            return state;
    }
};
