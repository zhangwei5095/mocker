/**
 * @file 接口列表页接口列表reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

const showModal = (title) => {
    return {
        type: 'SHOW_MODAL',
        title
    };
};

const hideModal = () => {
    return {
        type: 'HIDE_MODAL'
    };
};

export {
    showModal,
    hideModal
};
