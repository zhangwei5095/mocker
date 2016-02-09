/**
 * @file 接口列表页接口模态窗口reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

// 初始状态
const initState = {
    open: false,
    relativeURL: ''
};

export default (state = initState, action) => {
    switch (action.type) {
        case 'FIDDLER_CONFIG_DIALOG/SHOW':
            return {
                open: true,
                relativeURL: action.relativeURL
            };
        case 'FIDDLER_CONFIG_DIALOG/HIDE':
            return initState;
        default:
            return state;
    }
};
