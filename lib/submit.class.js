/**
 * 奇虎360支付相关提交请求类
 */

var core_func = require('./core.func');
var md5_func = require('./md5.func');

/**
 * 常量定义
 */

//奇虎360网关地址
var kQihooGatewayUrl = 'https://openapi.360.cn/pay/verify_mobile_notification.json';

var QihooSubmit = function(conf) {
    if (!(this instanceof QihooSubmit)) {
        return new QihooSubmit(conf);
    }
    
    this.conf = conf;
};

module.exports = QihooSubmit;

/**
 * 生成个人签名
 * @param {JSON} param_sort 已排好序的参数对象
 * @return {String} 生成的签名字符串
 */
QihooSubmit.prototype.buildRequestSign = function(param_sort) {
    //把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
    var prestr = core_funcs.createLinkString(para_sort);
    
    var sign_type = this.conf.sign_type.trim().toUpperCase();
    return (sign_type === 'MD5') ? md5_func.md5Sign(prestr, this.conf.key) : '';
};