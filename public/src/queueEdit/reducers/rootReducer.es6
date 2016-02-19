/**
 * @file 队列编辑页主reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

import {combineReducers} from 'redux';

// reducers
import responses from './responsesReducer.es6';
import queuedResponses from './queuedResponsesReducer.es6';

// combine
export default combineReducers(
    {
        responses,
        queuedResponses
    }
);
