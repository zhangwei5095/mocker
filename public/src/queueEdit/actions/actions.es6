/**
 * @file 队列编辑页action集合
 * @author Franck Chen(chenfan02@baidu.com)
 */

var request = require('superagent');

/**
 * 保存结果action
 *
 * @param {boolean} isOk 保存是否成功
 * @param {Object} data 附加数据
 * @return {Object}
 */
function saveFinished(isOk, data = {}) {
    const result = isOk ? 'SUCCESS' : 'FAILED';

    return {
        type: `SAVE/${result}`,
        data
    };
}

export default {
    /**
     * 选中列表项时的action
     *
     * @param {string} name 菜单位置
     * @param {string} selectedIndex 选中的菜单的值
     * @return {Object}
     */
    listSelectionChange(name, selectedIndex) {
        // 值可能是LEFT_MENU或者RIGHT_MENU
        const menuName = `${name.toUpperCase()}`;

        return {
            type: `${menuName}/CHANGE_SEL`,
            selectedIndex
        };
    },
    /**
     * 移动响应action
     *
     * @param {string} name 移动的是哪一种响应
     * @param {number} index 移动的响应在列表中的位置
     * @return {Object}
     */
    moveResponse(name, index) {
        return {
            type: 'RESPONSE/MOVE',
            name,
            index
        };
    },

    /**
     * 保存action
     */
    clickSave(interfaceId = '', queueId = '',name, responses) {
        return (dispatch) => {
            request
                .post('/admin/saveQueue')
                .send(
                    {
                        interfaceId,
                        queueId,
                        // 队列的名称
                        name,
                        // 用户设置的队列中的响应的id结合
                        responses
                    }
                )
                .end((err, res) => {
                    if (err || !res.ok) {
                        // false表示保存不正确
                        dispatch(saveFinished(false));
                        return;
                    }

                    const data = JSON.parse(res.text);

                    if (data.status !== 0) {
                        dispatch(saveFinished(false));
                        return;
                    }

                    // 保存成功, 保存下queueId, 下次再保存时就是保存逻辑而不是新建逻辑了
                    dispatch(saveFinished(true, {queueId: data.queueId}));
                });
        };
    },
    // 隐藏底部提示
    hideSnackBar() {
        return {
            type: 'SNACK_BAR/HIDE'
        };
    }
};

