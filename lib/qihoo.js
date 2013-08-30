
var qs = require('querystring');
var util = require('util');

var core_func = require('./core.func');
var OrderNotify = require('./notify.class');

function Qihoo(conf) {
    //default config
    this.conf = conf;
    
    this.notify = new OrderNotify(this.conf);
}

module.exports = Qihoo;

/**
 * 生成通用订单对象
 */
Qihoo.prototype.createOrder = function(packet) {
    return {
        'appid' : packet.app_key,
        'ditch' : 'qihoo',
        'ditchid' : packet.user_id,
        'roleid' : packet.app_uid,
        'cost' : packet.amount,
        'payid' : packet.app_order_id,
        'paytime' : Math.floor(Date.now() / 1000),
        'orderid' : packet.order_id
    };
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
    var order = this.createOrder(packet);
    if (verify) {
        endcb(true, order);
        callback('ok');
    } else {
        endcb(false, order);
        callback('failure');
    }
};
