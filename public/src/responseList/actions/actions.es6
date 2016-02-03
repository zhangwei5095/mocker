/**
 * @file 响应列表页action集合
 * @author Franck Chen(chenfan02@baidu.com)
 */

import request from 'superagent';

// 用户切换了激活的响应，但没有保存
const changeActiveResponse = (id) => {
    return {
        type: 'CHANGE_ACTIVE_RESPONSE',
        id
    };
};

// 响应保存成功action
const saveSuccess = () => {
    return {
        type: 'SAVE_SUCCESS'
    };
};

// 响应保存失败action
const saveFailed = () => {
    return {
        type: 'SAVE_FAILED'
    };
};

// 删除响应成功action
const deleteSuccess = () => {
    return {
        type: 'DELETE_SUCCESS'
    };
};

// 删除响应失败的action
const deleteFailed = () => {
    return {
        type: 'DELETE_FAILED'
    };
};

export default {
    changeActiveResponse,
    saveSuccess,
    saveFailed,
    deleteSuccess,
    deleteFailed
};
