/**
 * @file 队列编辑页主reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

import {combineReducers} from 'redux';

// reducers
import responsesData from './responsesReducer.es6';
import queuedResponsesData from './queuedResponsesReducer.es6';

// combine
export default combineReducers(
    {
        responsesData,
        queuedResponsesData
    }
);
