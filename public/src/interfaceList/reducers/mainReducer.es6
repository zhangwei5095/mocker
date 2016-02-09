/**
 * @file 接口列表页主reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

import {combineReducers} from 'redux';

// 需要combine的reducers
import interfaceList from './interfaceListReducer.es6';
import modalData from './modalReducer.es6';
import snackbarData from './snackbarReducer.es6';
import doubleCheck from './doubleCheckReducer.es6';
import fiddlerConfigDialog from './getFilddlerConfigDialogReducer.es6';

// 组合reducers
export default combineReducers(
    {
        interfaceList,
        modalData,
        snackbarData,
        doubleCheck,
        fiddlerConfigDialog
    }
);
