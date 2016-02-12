/**
 * @file 接口列表页提示信息reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

const initState = {
    display: false,
    text: '',
    skin: '',
    iconClass: ''
};

export default (state = initState, action) => {
    switch (action.type) {
        case 'ERROR_TIP':
            return {
                display: true,
                text: action.text,
                skin: 'error',
                iconClass: 'icon-sad'
            };
        case 'TIP':
            return {
                display: true,
                text: action.text,
                iconClass: ''
            };
        case 'HIDE_TIP':
            return initState;
        default:
            return state;
    }
};
