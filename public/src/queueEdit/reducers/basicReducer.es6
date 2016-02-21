/**
 * @file 队列编辑页基础信息reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

export default (state = {}, action) => {
    switch (action.type) {
        // 保存成功时更新
        case 'SAVE/SUCCESS':
            return Object.assign(
                {},
                state,
                {
                    queueId: action.data.queueId
                }
            );
        default:
            return state;
    }
};
