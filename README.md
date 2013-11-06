kk-payment-qihoo
================

This is a on-doing payment module with qihoo for kk-project.

Install with:

    npm install kk-payment-qihoo

## Usage
Simple example, included as `test.js`:
```js
var Qihoo = require('./index');
var qihoo = new Qihoo(require('./qihoo.example.json'));

qihoo.doOrderCompleted(
    remoteip,
    reqdata,
    function(text) {
        //TODO: 处理响应请求返回
        //此text值将做为返回给奇虎服务器的值，类似于res.send(text);
    },
    function(result, orderinfo) {
        //TODO: 处理订单通知校验结果处理
        //result: 代表校验成功与失败
        //orderinfo: 代表校验成功时返回的订单对象
        //  json型，可以使用%j打印输出查看
        //注意：因为订单通知是必然会出现重复发送的问题，
        //  所以需要使用者自行处理订单重复通知的问题；
    }
);
```

配置文件qihoo.example.json说明
```json
{
    "partner" : "xxxx", //360提供的应用app id(如果没有以空字符串代替)
    "key" : "xxxx",     //360提供的应用app key
    "secret" : "xxxx",  //360提供的应用app_secret
    "sign_type" : "md5" //签名算法，固定md5
}
```

# API


## LICENSE - "MIT License"

Copyright (c) 2013 yunjing, http://yunjing.me/

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

