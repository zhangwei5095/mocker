/**
 * @file 获取fiddler配置文件接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

'use strict';

module.exports = function (req, res) {
    // 用户请求原地址
    var originURL = req.query.originURL;
    // 假数据接口相对地址
    var relativeURL = req.query.relativeURL;
    // 假数据服务器所在域名
    var host = req.get('host');
    // 响应地址
    var actionPath = `http://${host}/${relativeURL}`;

    var responseRule = `<ResponseRule Match="${originURL}" Action="${actionPath}" Enabled="false" />`;

    var configXML = `
        <?xml version="1.0" encoding="utf-8"?>
        <AutoResponder>
            <State>${responseRule}</State>
        </AutoResponder>`;

    res
        .set(
            {
                'Content-Disposition': 'attachment; filename="fiddler.farx"'
            }
        )
        .type('text/xml')
        .end(configXML);
};
