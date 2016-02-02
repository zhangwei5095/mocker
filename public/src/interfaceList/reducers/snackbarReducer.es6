/**
 * @file 接口列表页接口snackbar reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

import {combineReducers} from 'redux';

const initState = {
    open: false,
    text: '',
    autoHideDuration: 5000
};

function snackbarReducer(state = initState, action) {
    switch (action.type) {
        case 'SHOW_SAVE_SUCCESS':
            return Object.assign(
                {},
                state,
                {
                    open: true,
                    text: '新接口保存成功'
                }
            );
        default:
            return state;
    }
}

export default snackbarReducer;
