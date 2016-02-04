/**
 * @file JSON响应编辑页action集合
 * @author Franck Chen(chenfan02@baidu.com)
 */

// 用户切换了激活的响应，但没有保存
const saveSuccess = () => {
    return {
        type: 'SAVE_SUCCESS'
    };
};

const saveFailed = () => {
    return {
        type: 'SAVE_FAILED'
    }
};

export default {
    saveSuccess,
    saveFailed
};
