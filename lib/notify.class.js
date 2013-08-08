/**
 * 奇虎360订单通知处理类
 */

var core_func = require('./core.func');
var md5_func = require('./md5.func');

/**
 * 常量定义
 */
 
//不参与签名的参数属性名列表
var kNotJoinSignArgNameList = ['sign','sign_return'];

var QihooNotify = function(conf) {
    if (!(this instanceof QihooNotify)) {
        return new QihooNotify(conf);
    }
    
    this.conf = conf;
};

module.exports = QihooNotify;

/**
 * 验证服务端返回消息包的签名是否正确
 */
QihooNotify.prototype.checkPacketSignVerify = function(params, sign) {
    //去除空值和不参与签名的参数
    var param_filter = core_func.doParamFilter(params, kNotJoinSignArgNameList);
    
    //排序签名参数数组
    var param_sort = core_func.doArgSort(param_filter);
    
    //把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
    var prestr = core_func.createLinkString(param_sort);
    
    var sign_type = this.conf.sign_type.trim().toUpperCase();
    return (sign_type === 'MD5') ? md5_func.md5Verify(prestr, sign, this.conf.key) : false;
};

/**
 * 验证支付订单通知消息是否正确
 */
QihooNotify.prototype.checkOrderCompletedPacketVerify = function(packet) {
    var isSignVerify = this.checkPacketSignVerify(packet, packet.sign);
    if (!isSignVerify) {
        return false;
    }
    
    if (this.conf.key !== packet.app_key) {
        return false;
    }
    
    return true;
};
