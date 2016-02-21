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
const {responses, queuedResponses} = initialData;

// 添加redux中间件
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

// 创建store
const store = createStoreWithMiddleware(
    rootReducer,
    {
        responses: {
            unQueued: {
                responses,
                // 初始菜单没有选中任何项
                selectedIndex: -1,
                // 移动按键是否置灰，因为初始状态时没有选择任何响应，所以按键时置灰的
                moveBtnDisabled: true
            },
            queued: {
                responses: queuedResponses,
                // 初始菜单没有选中任何项
                selectedIndex: -1,
                moveBtnDisabled: true
            }
        },
        basic: {
            // 根据有没有queueId来判断保存时是新建还是更新
            queueId: initialData.queueId || ''
        }
    }
);

render(
    <Provider store={store}>
        <App interfaceId={initialData.interfaceId}
             interfaceURL={initialData.interfaceURL}
             queueName={initialData.name || ''} />
    </Provider>,
    rootElement
);
