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
        default:
            return state;
    }
};
