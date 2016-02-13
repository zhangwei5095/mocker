/**
 * @file JSON响应编辑页action集合
 * @author Franck Chen(chenfan02@baidu.com)
 */

let timer = null;

const showTip = (isErrorTip, text) => {
    let action = {
        text,
        type: 'TIP'
    };

    if (isErrorTip) {
        action.type = 'ERROR_TIP';
    }

    return action;
};

const hideTip = () => {
    return {
        type: 'TIP/HIDE'
    };
};

export default {
    // 用户切换了激活的响应，但没有保存
    saveSuccess(responseId) {
        return {
            type: 'SAVE_SUCCESS',
            responseId
        };
    },
    saveFailed() {
        return {
            type: 'SAVE_FAILED'
        };
    },
    hideDoubleCheck() {
        return {
            type: 'HIDE_DOUBLE_CHECK'
        };
    },
    showTempTip(text) {
        clearTimeout(timer);

        return (dispatch) => {
            setTimeout(
                () => {
                    dispatch(showTip(true, text));
                },
                0
            );

            timer = setTimeout(
                () => {
                    dispatch(hideTip());
                },
                3000
            );
        };
    },
    // 用户修改了延迟时间时触发
    delayTimeChange(delayTime) {
        return {
            type: 'DELAY_TIME/CHANGE',
            delayTime
        };
    },
    // 用户修改了HTTP状态码时触发
    httpStatusCodeChange(httpStatusCode) {
        return {
            type: 'HTTP_STATUS_CODE/CHANGE',
            httpStatusCode
        };
    }
};
