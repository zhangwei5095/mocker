/**
 * @file JSON响应编辑页action集合
 * @author Franck Chen(chenfan02@baidu.com)
 */

// 用户切换了激活的响应，但没有保存
const saveSuccess = (responseId) => {
    return {
        type: 'SAVE_SUCCESS',
        responseId
    };
};

const saveFailed = () => {
    return {
        type: 'SAVE_FAILED'
    };
};

const hideDoubleCheck = () => {
    return {
        type: 'HIDE_DOUBLE_CHECK'
    };
};

let timer = null;
const showTempTip = (text) => {
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
};

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
        type: 'HIDE_TIP'
    };
};

export default {
    saveSuccess,
    saveFailed,
    hideDoubleCheck,
    showTempTip
};
