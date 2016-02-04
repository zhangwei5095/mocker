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
        // 用户在修改了激活的响应时，弹出保存提示
        case 'CHANGE_ACTIVE_RESPONSE':
            return {
                open: true,
                text: '您修改了接口激活情况，是否保存？',
                action: '保存'
            };
        case 'SAVE_SUCCESS':
            return {
                open: true,
                text: '保存成功！',
                action: ''
            };
        case 'SAVE_FAILED':
            return {
                open: true,
                text: '抱歉，保存失败',
                action: ''
            };
        case 'DELETE_SUCCESS':
            return {
                open: true,
                text: '删除成功！',
                action: ''
            };
        case 'DELETE_FAILED':
            return {
                open: true,
                text: '抱歉，删除失败',
                action: ''
            };
        default:
            return state;
    }
};