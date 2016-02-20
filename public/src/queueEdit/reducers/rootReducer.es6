/**
 * @file 队列编辑页主reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

import {combineReducers} from 'redux';

// reducers
import responses from './responseReducer.es6';

// combine
export default combineReducers(
    {
        // 两侧列表内容相关的reducer
        responses
    }
);
