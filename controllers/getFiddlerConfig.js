/**
 * @file 获取fiddler配置文件接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

'use strict';

module.exports = function (req, res, next) {
    // 用户请求原地址和假数据接口相对地址
    const originURL = req.query.originURL;
    const relativeURL = req.query.relativeURL;

    // 两个参数不能少
    if (!originURL || !relativeURL) {
        next(new Error());
    }

    // 假数据服务器所在域名
    const host = req.get('host');
    // 响应地址
    const actionPath = `http://${host}/${relativeURL}`;

    const responseRule = `<ResponseRule Match="${originURL}" Action="${actionPath}" Enabled="false" />`;

    // fiddler配置文件模板
    const configXML = ``
        + `<?xml version="1.0" encoding="utf-8"?>\r\n`
        + `<AutoResponder>\r\n`
        + `    <State>\r\n`
        + `         ${responseRule}\r\n`
        + `    </State>\r\n`
        + `</AutoResponder>\r\n`;

    res
        .set(
            {
                'Content-Disposition': 'attachment; filename="fiddler.farx"'
            }
        )
        .type('text/xml')
        .end(configXML);
};
