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

// 尝试删除某响应
const tryToDeleteResponse = (responseName, responseId) => {
    return {
        type: 'TRY_TO_DELETE_RESPONSE',
        responseId,
        responseName
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

// 隐藏二次确认浮窗
const hideDoubleCheck = () => {
    return {
        type: 'HIDE_DOUBLE_CHECK'
    };
};

// 刷新响应列表
const refreshResponseList = (interfaceId) => {
    return (dispatch) => {
        request
            .post('/admin/getResponseList')
            .send({
                interfaceId
            })
            .end(
                (err, res) => {
                    // TODO status判断
                    if (!err && res.ok) {
                        dispatch(refresh(JSON.parse(res.text)));
                    }
                }
            );
    };
};

// 实际刷新
const refresh = (data) => {
    return {
        type: 'REFRESH_RESPONSE_LIST',
        responses: data.responses,
        activeResponseId: data.activeResponseId
    };
};

export default {
    changeActiveResponse,
    saveSuccess,
    saveFailed,
    deleteSuccess,
    deleteFailed,
    tryToDeleteResponse,
    hideDoubleCheck,
    refreshResponseList
};
