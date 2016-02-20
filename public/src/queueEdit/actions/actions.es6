/**
 * @file 队列编辑页action集合
 * @author Franck Chen(chenfan02@baidu.com)
 */

export default {
    /**
     * 选中列表项时的action
     *
     * @param {string} position 菜单位置
     * @param {string} selectedIndex 选中的菜单的值
     * @return {Object}
     */
    listSelectionChange(position, selectedIndex) {
        // 值可能是LEFT_MENU或者RIGHT_MENU
        const menuName = `${position.toUpperCase()}_MENU`;

        return {
            type: `${menuName}/CHANGE_SEL`,
            selectedIndex
        };
    }
};

