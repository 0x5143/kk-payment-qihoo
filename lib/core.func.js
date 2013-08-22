/**
 * 奇虎360支付模块公用函数
 * 详细：奇虎360支付模块所使用的各种公用函数定义
 * 版本：1.0
 * 日期：2013-08-07
 * 说明：
 */

var qs = require('querystring');
var fs = require('fs');
var https = require('https');

/**
 * 创建支付订单结果对象
 * @param {String} qihooid 奇虎用户编号
 * @param {String} roleid 角色编号
 * @param {String} orderid 订单编号
 * @param {String} goodsid [可选]商品编号, 默认为空
 * @param {Number} amount [可选]支付金额(分), 默认为0
 * @param {String} arg1 [可选]附加参数1, 默认为空
 * @param {String} arg2 [可选]附加参数2, 默认为空
 * @param {String} verify 订单核实附加参数
 */
exports.createPaymentOrderCompletedResult = function(qihooid, roleid, orderid, goodsid, amount, arg1, arg2, verify) {
    return {
        'ditchid' : qihooid,
        'roleid' : roleid,
        'orderid' : orderid,
        'goodsid' : goodsid || '',
        'amount' : amount || 0,
        'arg1' : arg1 || '',
        'arg2' : arg2 || '',
        'verifyarg' : verify
    };
};

/**
 * 把对象所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
 * @param params 需要拼接的对象
 * return 拼接完成以后的字符串
 */
exports.createLinkString = function(params) {
    var ls = '';
    for(var k in params) {
        ls += (k + '=' + params[k] + '&');
    }
    return ls.substring(0, ls.length - 2);
};

/**
 * 把对象所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串，并对字符串做Urlencode编码
 * @param params 需要拼接的对象
 * return 拼接完成以后的字符串
 */
exports.createLinkStringWithUrlencode = function(params) {
    return qs.stringify(params);
};

/**
 * 拼接待签名字符串
 * 把待签名的参数对象的值按#字符拼接成字符串
 */
exports.createSignPrestring = function(params) {
    var str = '';
    var isfirst = true;
    for (var k in params) {
        if (isfirst) {
            isfirst = false;
            str = params[k];
        } else {
            str += ('#' + params[k]);
        }
    }
    return str;
};

/**
 * 移除对象中的空值和不参与签名的参数
 * @param {JSON} params 接收到的参数对象
 * @param {Array} excepts 不参与签名的属性字符串数组
 * @return {JSON} 处理后的新签名参对象
 */
exports.doParamFilter = function(params, excepts) {
    var param_filter = {};
    for (var key in params) {
        if (params[key] === '' || ~excepts.indexOf(key)) {
            continue;
        } else {
            param_filter[key] = params[key];
        }
    }
    return param_filter;
};

/**
 * 对对象排序
 * @param {JSON} param 排序前的对象
 * @return {JSON} 排序后的对象
 */
exports.doArgSort = function(param) {
    var result = {};
    var keys = Object.keys(param).sort();
    
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        result[k] = param[k];
    }
    return result;
};

/**
 * 远程获取数据，POST模式
 * 注意：
 * 1.使用Curl需要修改服务器中php.ini文件的设置，找到php_curl.dll去年前面的';'就行了
 * 2.文件夹中cacert.pem是SSL证书，请保证其路径有效，目前默认路径是: getcwd().'\\cacert.pem'
 * @param {String} url 指定URL完整路径地址
 * @param {String} cacert_url 指定当前工作目录绝对路径
 * @param {} params 请求的数据
 * @param {} input_charset 编码格式，默认值：空值
 * @return {String} 远程输出的数据 
 */
exports.getHttpResponseWithPost = function(url, cacert_url, params, input_charset, callback) {
    input_charset = input_charset || '';
    if (input_charset.trim() !== '') {
        url += '_input_charset=' + input_charset;
    }
    
    var parsed_url = require('url').parse(url);
    var parsed_param = qs.stringify(params);
    
    var options = {
        hostname : parsed_url.host,
        port : 443,
        path : parsed_url.path,
        method : 'POST',
        cert : fs.readFileSync(cacert_url),
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Content-Length' : parsed_param.length
        }
    };
    
    var req = https.require(options, function(res) {
        var responseText = '';
        res.on('data', function(chunk) {
            responseText += chunk;
        });
        res.on('end', function() {
            callback && callback(responseText);
        });
    });
    
    req.write(parsed_param);
    req.end();
};

/**
 * 远程获取数据，GET模式
 * 注意：
 * 1.使用Curl需要修改服务器中php.ini文件的设置，找到php_curl.dll去年前面的';'就行了
 * 2.文件夹中cacert.pem是SSL证书，请保证其路径有效，目前默认路径是: getcwd().'\\cacert.pem'
 * @param {String} url 指定URL完整路径地址
 * @param {String} cacert_url 指定当前工作目录绝对路径
 * @return {String} 远程输出的数据 
 */
exports.getHttpResponseWithGet = function(url, cacert_url, callback) {
    var parsed_url = require('url').parse(url);
    var options = {
        hostname : parsed_url.host,
        port : 443,
        path : parsed_url.path,
        method : 'GET',
        cert : fs.readFileSync(cacert_url)
    };
    
    var req = https.require(options, function(res) {
        var responseText = '';
        res.on('data', function(chunk) {
            responseText += chunk;
        });
        res.on('end', function() {
            callback && callback(responseText);
        });
    });
    
    req.end();
};

