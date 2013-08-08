
var qs = require('querystring');
var url = require('url');
var util = require('util');
//var EventEmitter = require('events').EventEmitter;

//var DOMParser = require('xmldom').DOMParser;

var QihooNotify = require('./notify.class');

var kDefaultQihooConfig = {
    partner : '', //合作身份者id，以2088开头的16位纯数字
    key : '', //安全检验码，以数字和字母组成的32位字符
    cacert : 'cacert.pem', //ca证书路径地址, 用于curl中ssl校验，请保证cacert.pem文件在当前文件夹目录中
    input_charset : 'utf-8', //字符编码格式，目前支持gbk或utf-8
    sign_type : 'MD5' //签名方式 不需修改
};

function Qihoo(conf) {
    //EventEmitter.call(this);
    
    //default config
    this.conf = kDefaultQihooConfig;
    //config merge
    for (var k in conf) {
        this.conf[k] = conf[k];
    }
    
    this.notify = new QihooNotify(this.conf);
}

//util.inherits(Qihoo, EventEmitter);
module.exports = Qihoo;

/**
 * 路由服务商各通知请求
 * @param {String} remoteip 服务商请求远程地址
 * @param {String} reqdata 服务商请求内容
 * @param {Function} callback 返回给服务商数据的回调函数，接收一个字符串参数
 * @param {Function} endcb 返回给逻辑层的回调函数，接收一个布尔值及其它附加参数
 */
Qihoo.prototype.route = function(remoteip, requrl, reqdata, callback, endcb) {
    if (requrl === '/qihoo/notify') {
        this.doOrderCompleted(remoteip, reqdata, callback, endcb);
    }
};

/**
 * 接收到服务商订单完成通知请求
 * @param {String} remoteip 服务商请求远程地址
 * @param {String} reqdata 服务商请求内容
 * @param {Function} callback 返回给服务商数据的回调函数，接收一个字符串参数
 * @param {Function} endcb 返回给逻辑层的回调函数，接收一个布尔值及其它附加参数
 */
Qihoo.prototype.doOrderCompleted = function(remoteip, reqdata, callback, endcb) {
    var packet = qs.parse(reqdata);
    var verify = this.notify.checkOrderCompletedPacketVerify(packet);
    if (verify) {
        var result = core_func.createPaymentOrderCompletedResult(
            packet.app_uid,
            packet.order_id,
            packet.product_id,
            packet.amount,
            packet.sign_return
        );
        
        endcb(true, result);
        callback('ok');
    } else {
        endcb(false);
        callback('failure');
    }
};
