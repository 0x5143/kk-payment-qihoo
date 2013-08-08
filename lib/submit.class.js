/**
 * 奇虎360支付相关提交请求类
 */

var core_func = require('./core.func');
var md5_func = require('./md5.func');

/**
 * 常量定义
 */

//不参与签名的参数属性名列表
var kNotJoinSignArgNameList = ['sign','sign_return'];

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

/**
 * 生成请求的参数数组
 * @param {JSON} packet 请求的参数对象
 * @return {JSON} 请求的参数对象
 */
QihooSubmit.prototype.buildRequestParam = function(packet) {
    //去除待签名数组中的空值和不参与签名的参数
    var param_filter = core_func.doParamFilter(packet, kNotJoinSignArgNameList);
    
    //对待签名参数数组排序
    var param_sort = core_func.doArgSort(param_filter);
    
    //生成签名结果
    var sign = this.buildRequestSign(param_sort);
    
    //附加到请求参数对象中
    param_sort.sign = sign;
    param_sort.sign_type = this.conf.sign_type.trim().toUpperCase();
    
    return param_sort;
};

/**
 * 拼接请求参数对象为字符串
 */
QihooSubmit.prototype.buildRequestParamsToString = function(packet) {
    //待请求参数数组
    var params = this.buildRequestParam(packet);
    
    //把参数组中所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串, 并对字符串做urlencode编码
    var reqstr = core_func.createLinkStringWithUrlencode(params);
    
    return reqstr;
};

/**
 * 建立请求
 * @return {String} 服务端返回字符串
 */
QihooSubmit.prototype.buildRequest = function(packet, callback) {
    var reqstr = this.buildRequestParam(packet);
    
    core_func.getHttpResponseWithPost(
        kQihooGatewayUrl,
        this.conf.cacert,
        reqstr,
        this.conf.input_charset.toLowerCase().trim(),
        callback
    );
};

/**
 * 建立带文件的请求
 * @param {String} filetype 文件类型的参数名
 * @param {String} filepath 文件完整的绝对路径
 * @return {String} 服务端返回字符串
 */
QihooSubmit.prototype.buildRequest = function(packet, filetype, filepath, callback) {
    var params = this.buildRequestParam(packet);
    params[filetype] = '@' + filepath;
    
    core_func.getHttpResponseWithPost(
        kQihooGatewayUrl,
        this.conf.cacert,
        params,
        this.conf.input_charset.toLowerCase().trim(),
        callback
    );
};
