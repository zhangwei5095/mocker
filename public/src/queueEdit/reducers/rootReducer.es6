/**
 * @file 队列编辑页主reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

import {combineReducers} from 'redux';

// reducers
import responses from './responseReducer.es6';
import snackbarData from './snackbarReducer.es6';
import basic from './basicReducer.es6';

// combine
export default combineReducers(
    {
        // 两侧列表内容相关的reducer
        responses,
        snackbarData,
        basic
    }
);
