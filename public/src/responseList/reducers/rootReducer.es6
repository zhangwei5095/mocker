/**
 * @file 响应列表页主reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

import {combineReducers} from 'redux';

// reducers
import responseData from './responseListReducer.es6';
import snackbarData from './snackbarReducer.es6';
import buttonsData from './buttonsReducer.es6';

// combine
export default combineReducers(
    {
        responseData,
        snackbarData,
        buttonsData
    }
);
