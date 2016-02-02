/**
 * @file 接口列表页接口列表reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

import {combineReducers} from 'redux';

/**
 * 站点列表数据Reducer
 *
 * @param {Array} state reducer的state
 * @param {*} action Redux action
 * @return {Array}
 */
function interfaceList(state = [], action) {
    switch (action.type) {
        case 'REFRESH':
            return action.interfaceList;
        default:
            return state;
    }
}

export default interfaceList;
