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
        type: 'HIDE_TIP'
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
    hideDoubleCheck(text) {
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
    showTempTip() {
        return {
            type: 'HIDE_TIP'
        };
    }
};
