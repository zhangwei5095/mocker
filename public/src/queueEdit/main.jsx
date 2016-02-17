/**
 * @file 队列编辑页入口文件
 * @author Franck Chen(chenfan02@baidu.com)
 */

// react
import React from 'react';
import {render} from 'react-dom';

// redux
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import injectTapEventPlugin from 'react-tap-event-plugin';

// 模块
import App from './components/App.jsx';
import rootReducer from './reducers/rootReducer.es6';

// 注册tap事件
injectTapEventPlugin();

const rootElement = document.getElementById('main');

// 初始数据,来自server
let initialData = JSON.parse(document.getElementById('initial-data').innerHTML);

// 添加redux中间件
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

// 创建store
const store = createStoreWithMiddleware(
    rootReducer,
    {}
);

render(
    <Provider store={store}>
        <App  />
    </Provider>,
    rootElement
);
