/**
 * @file 响应列表页主reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

import {combineReducers} from 'redux';

// reducers
import responseData from './responseDataReducer.es6';
import doubleCheckModal from './doubleCheckModalReducer.es6';

// combine
export default combineReducers(
    {
        responseData,
        doubleCheckModal
    }
);
