/**
 * @file 队列编辑页响应reducer
 * @author Franck Chen(chenfan02@baidu.com)
 */

export default (state = {}, action) => {
    switch (action.type) {
        case 'QUEUED/CHANGE_SEL':
            return Object.assign(
                {},
                state,
                {
                    queued: Object.assign(
                        {},
                        state.queued,
                        {
                            // 序号-1，表示没有选中任何一个响应，序号从0开始排
                            moveBtnDisabled: action.selectedIndex === -1,
                            selectedIndex: action.selectedIndex
                        }
                    )
                }
            );
        case 'UNQUEUED/CHANGE_SEL':
            return Object.assign(
                {},
                state,
                {
                    unQueued: Object.assign(
                        {},
                        state.unQueued,
                        {
                            moveBtnDisabled: action.selectedIndex === -1,
                            selectedIndex: action.selectedIndex
                        }
                    )
                }
            );
        case 'RESPONSE/MOVE':
            var newState = {};

            let movedResponse = null;
            let hasMoved = false;

            while(1) {
                // 未入队列的响应和队列中的响应依次进行处理
                for (name of ['queued', 'unQueued']) {
                    // 移动源移除掉序号, 没有查到需要移动的响应时条件才能达成
                    if (name === action.name && !movedResponse) {
                        // 移动源的所有响应, const for immutable!
                        const {responses} = state[name];
                        // 移动的响应在队列中的序号
                        const moveIndex = action.index;

                        // data[name] - 移动源数据对象
                        newState[name] = {
                            // 移动了，失去选择了，所以按键一定置灰了
                            moveBtnDisabled: true,
                            // 失去选择
                            selectedIndex: -1,
                            // 移除被移动的响应，注意immutable原则
                            responses: [
                                ...responses.slice(0, moveIndex),
                                ...responses.slice(moveIndex + 1, responses.length)
                            ]
                        };

                        movedResponse = responses[moveIndex];
                    }
                    else {
                        if (movedResponse && !hasMoved) {
                            // 移动目的数据
                            newState[name] = Object.assign(
                                {},
                                state[name],
                                {
                                    responses: [
                                        ...state[name].responses,
                                        movedResponse
                                    ]
                                }
                            );

                            hasMoved = true;
                        }
                    }
                }

                // 移动完成，跳出死循环
                if (hasMoved) {
                    break;
                }
            }

            return newState;
        default:
            return state;
    }
};
