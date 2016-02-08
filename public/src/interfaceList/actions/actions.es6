/**
 * @file 接口列表页action集合
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
            .post('/admin/addInterfaceURL')
            .send({url})
            .end((err, res) => {
                if (err || !res.ok) {
                    // 保存失败分支
                    dispatch(hideModal());
                }
                else {
                    // 保存成功，并弹出成功提示
                    dispatch(hideModal());
                    dispatch(fetchNewInterfaceList());
                    dispatch(showSnackBarAWhile('新接口保存成功'));
                }
            });
    };
};

let timer = null;
// 保存接口地址
const showSnackBarAWhile = (text) => {
    return (dispatch) => {
        dispatch(showSnackBar(text));

        clearTimeout(timer);
        timer = setTimeout(
            () => {
                dispatch(hideSnackBar());
            },
            // 底部提示停留4s
            4000
        );
    };
};

// 显示底部提示
const showSnackBar = (text) => {
    return {
        type: 'SHOW_SNACK_BAR',
        text
    };
};

// 隐藏底部提示
const hideSnackBar = () => {
    return {
        type: 'SNACK_BAR/HIDE'
    };
};

// 从后端重新获取接口列表
const fetchNewInterfaceList = () => {
    return (dispatch) => {
        request
            .post('admin/getAllInterface')
            .end((err, res) => {
                if (err) {
                    // 保存失败分支
                    dispatch(hideModal());
                }
                else {
                    let resData = JSON.parse(res.text);

                    // 获取新列表成功，刷新列表页
                    dispatch(refreshInterfaceList(resData.interfaceList));
                }
            });
    };
};

// 刷新接口列表
const refreshInterfaceList = (interfaceList) => {
    return {
        type: 'REFRESH',
        interfaceList
    };
};

const tryDeleteInterface = (interfaceId) => {
    return {
        type: 'INTERFACE/TRY_DELETE',
        interfaceId
    };
};

// 删除指定的接口
const delInterface = (interfaceId) => {
    return (dispatch) => {
        if (!interfaceId) {
            return;
        }

        request
            .post('/admin/deleteInterface')
            .send(
                {
                    interfaceId
                }
            )
            .end(function (err, res) {
                if (err || !res.ok) {
                    dispatch(showSnackBarAWhile('接口刪除失败'));
                    return;
                }

                dispatch(showSnackBarAWhile('接口删除成功'));
                dispatch(fetchNewInterfaceList());
            });
    };
};

// 隐藏二次确认浮窗
const hideDoubleCheck = () => {
    return {
        type: 'DOUBLE_CHECK/HIDE'
    };
};

export {
    showModal,
    hideModal,
    urlErrorTip,
    saveInterface,
    showSnackBarAWhile,
    fetchNewInterfaceList,
    delInterface,
    tryDeleteInterface,
    hideDoubleCheck
};
