/**
 * MD5工具接口函数
 * 详细：MD5相关函数
 * 版本：0.1
 * 日期：2013-08-06
 * 说明：
 */

var crypto = require('crypto');

/**
 * 签名字符串
 * @param {String} prestr 需要签名的字符串
 * @param {String} sercet 私钥
 * @return {String} 签名结果字符串
 */
exports.md5Sign = function(prestr, sercet) {
    prestr += ('#' + sercet);
    return crypto.createHash('md5').update(prestr, 'utf8').digest('hex');
};

/**
 * 验证签名
 * @param {String} prestr 需要签名的字符串
 * @param {String} sign 签名结果
 * @param {String} sercet 私钥
 * @return {Boolean} 是否通过验证
 */
exports.md5Verify = function(prestr, sign, sercet) {
    prestr += ('#' + sercet);
    var mysign = crypto.createHash('md5').update(prestr, 'utf8').digest('hex');
    console.log('mysign is %s', mysign);
    return (mysign == sign);
};
