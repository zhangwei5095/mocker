/**
 * @file 接口列表页接口列表reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

export default (state = {}, action) => {
    switch (action.type) {
        case 'SAVE_SUCCESS':
            return Object.assign(
                {},
                state,
                {
                    responseId: action.responseId
                }
            );
        case 'DELAY_TIME/CHANGE':
            return Object.assign(
                {},
                state,
                {
                    delay: action.delayTime
                }
            );
        case 'HTTP_STATUS_CODE/CHANGE':
            return Object.assign(
                {},
                state,
                {
                    httpStatusCode: action.httpStatusCode
                }
            );
        default:
            return state;
    }
};
