/**
 * @file 响应列表页底部提示reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

import {combineReducers} from 'redux';

const initState = {
    open: false,
    action: '',
    text: '',
    autoHideDuration: 0
};

export default (state = initState, action) => {
    switch (action.type) {
        case 'SAVE_CHECK':
            return {
                open: true,
                text: '您修改了接口激活情况，是否保存？',
                action: '保存'
            };
        default:
            return state;
    }
};
