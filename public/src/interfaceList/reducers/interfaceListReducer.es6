/**
 * @file 接口列表页接口列表reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

export default (state = [], action) => {
    switch (action.type) {
        case 'REFRESH':
            return action.interfaceList;
        default:
            return state;
    }
};
