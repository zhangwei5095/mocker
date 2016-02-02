/**
 * @file 接口列表页接口列表reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

import request from 'superagent';

// 弹出modal
const showModal = (title) => {
    return {
        type: 'SHOW_MODAL',
        title
    };
};

// 隐藏modal
const hideModal = () => {
    return {
        type: 'HIDE_MODAL'
    };
};

// 显示接口地址错误提示
const urlErrorTip = (text) => {
    return {
        type: 'SHOW_URL_ERROR_TIP',
        urlErrorTip: text
    };
};

// 保存接口地址
const saveInterface = (url) => {
    return (dispatch) => {
        request
            .post('admin/addInterfaceURL')
            .send({url})
            .end((err, res) => {
                if (err || !res.ok) {
                    // 保存失败分支
                    dispatch(hideModal())
                }
                else {
                    // 保存成功，隐藏模态窗口
                    dispatch(hideModal())
                }
            });
    };
};

export {
    showModal,
    hideModal,
    urlErrorTip,
    saveInterface
};
