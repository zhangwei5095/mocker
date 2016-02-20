/**
 * @file 队列编辑页action集合
 * @author Franck Chen(chenfan02@baidu.com)
 */

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
        }
    }
};

