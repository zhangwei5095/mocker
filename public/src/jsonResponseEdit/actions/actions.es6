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

export default {
    saveSuccess,
    saveFailed,
    hideDoubleCheck
};
