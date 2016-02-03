/**
 * @file 响应列表页按键reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

import {combineReducers} from 'redux';

const initState = {
    add: {
        disabled: false
    },
    save: {
        disabled: true
    }
};

export default (state = initState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};
