/**
 * @file 基础信息reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

const initData = {
    filter: 'JSON'
};

export default (state = initData, action) => {
    switch (action.type) {
        case 'FILTER/CHANGE':
            return Object.assign(
                {},
                state,
                {
                    filter: action.filter
                }
            );
        default:
            return state;
    }
};
