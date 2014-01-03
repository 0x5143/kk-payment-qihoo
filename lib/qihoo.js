
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
        'payid' : packet.product_id,
        'paytime' : Math.floor(Date.now() / 1000),
        'orderid' : packet.order_id
    };
};

/**
 * 接收到服务商订单完成通知请求
 * @param {String} remoteip 服务商请求远程地址
 * @param {String} reqdata 服务商请求内容
 * @param {Function} callback 校验完成回调函数
 *      1:{Boolean} 校验是否通过
 *      2:{String} 返回给服务商的字符串
 *      3:{JSON} 生成的订单对象
 */
Qihoo.prototype.doOrderCompleted = function(remoteip, reqdata, callback) {
    var packet = (typeof reqdata == 'string') ? (qs.parse(reqdata)) : (reqdata);
    var verify = this.notify.checkOrderCompletedPacketVerify(packet);
    var order = this.createOrder(packet);
    if (verify) {
        callback(true, 'ok', order);
    } else {
        callback(false, 'failure', order);
    }
};

