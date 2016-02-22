/**
 * @file 响应列表页action集合
 * @author Franck Chen(chenfan02@baidu.com)
 */

import request from 'superagent';

// 用户切换了激活的响应，但没有保存
const changeActiveResponse = (activeResponseId) => {
    return {
        type: 'CHANGE_ACTIVE_RESPONSE',
        activeResponseId
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
        type: 'RESPONSE/TRY_DELETE',
        responseName,
        data: {
            responseId
        }
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

const showSnackTip = (text) => {
    return {
        type: 'SNACKBAR/TIP',
        text
    };
};

// 刷新响应列表
const refreshResponseList = (interfaceId, responseType) => {
    return (dispatch) => {
        request
            .post('/admin/getResponseList')
            .send({
                interfaceId,
                responseType
            })
            .end(
                (err, res) => {
                    if (err || !res.ok) {
                        dispatch(showSnackTip('刷新失败'));
                        return;
                    }

                    let data = JSON.parse(res.text);

                    if (data.status !== 0) {
                        dispatch(showSnackTip('刷新失败'));
                        return;
                    }

                    // 刷新响应列表
                    dispatch(refresh(data));

                    dispatch(responseTypeChange(responseType));
                }
            );
    };
};

// 实际刷新
const refresh = (data) => {
    return {
        type: 'RESPONSE_LIST/REFRESH',
        responses: data.responses,
        activeResponseId: data.activeResponseId
    };
};

// 底部提示自动隐藏时触发
const snackbarAutoHide = () => {
    return {
        type: 'SNACKBAR/AUTO_HIDE'
    };
};

// 过滤条件发生变化的filter
const responseTypeChange = (responseType) => {
    return {
        type: 'RESPONSE_TYPE/CHANGE',
        responseType
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
    refreshResponseList,
    snackbarAutoHide,
    responseTypeChange
};
