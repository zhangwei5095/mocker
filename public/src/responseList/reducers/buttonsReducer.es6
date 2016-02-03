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
        // 激活的响应发生了变化的时候，保存按键应该点亮
        case 'CHANGE_ACTIVE_RESPONSE':
            return Object.assign(
                {},
                state,
                {
                    save: {
                        disabled: false
                    }
                }
            );
        case 'SAVE_SUCCESS':
            return Object.assign(
                {},
                state,
                {
                    save: {
                        // 保存成功了，置灰按键
                        disabled: true
                    }
                }
            );
        default:
            return state;
    }
};
