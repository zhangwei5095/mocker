/**
 * @file 基础信息reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

const initData = {
    // 初始状态下，显示JSON响应
    responseType: 'JSON'
};

export default (state = initData, action) => {
    switch (action.type) {
        case 'RESPONSE_TYPE/CHANGE':
            return Object.assign(
                {},
                state,
                {
                    responseType: action.responseType
                }
            );
        default:
            return state;
    }
};
