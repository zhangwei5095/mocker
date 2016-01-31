/**
 * @file 接口列表页主文件
 * @author Franck Chen(chenfan02@baidu.com)
 */

// react
import React from 'react';
import {render} from 'react-dom';

// redux
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import injectTapEventPlugin from 'react-tap-event-plugin';

// 模块
import App from './components/App.jsx';
import mainReducer from './reducers/mainReducer.es6';

// 注册tap事件
injectTapEventPlugin();

const rootElement = document.getElementById('main');

// 初始数据,来自server
let initialData = JSON.parse(document.getElementById('initial-data').innerHTML);

// 创建store
const store = createStore(
    mainReducer,
    {
        interfaceList: initialData.interfaceList
    }
);

console.log(store.getState());

render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
);
