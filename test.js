/**
 * 测试代码
 */


var conf = {
    "partner" : "",
    "key" : "testkey",
    "secret" : "testsecret",
    //"seller_email" : "",
    //"host" : "http://localhost:20502/",
    //"cacert" : "cacert.pem",
    "transport" : "http",
    "input_charset" : "utf-8"
};

var Qihoo = require('./index'),
    assert = require("assert"),
    crypto = require("crypto"),
    util = require('util'),
    tests = {},
    next, cur_start, run_next_test, all_tests, all_start, test_count;

var qihoo = new Qihoo(conf);

// ------------------------------------------------------------------------ //

function buffers_to_strings(arr) {
    return arr.map(function(val) {
        return val.toString();
    });
}

function require_number(expected, label) {
    return function(err, results) {
        assert.strictEqual(null, err, label + " expected " + expected + ", got error: " + err);
        assert.strictEqual(expected, results, label + " " + expected + " !== " + results);
        assert.strictEqual(typeof results, "number", label);
        return true;
    };
}

function require_number_any(label) {
    return function (err, results) {
        assert.strictEqual(null, err, label + " expected any number, got error: " + err);
        assert.strictEqual(typeof results, "number", label + " " + results + " is not a number");
        return true;
    };
}

function require_number_pos(label) {
    return function (err, results) {
        assert.strictEqual(null, err, label + " expected positive number, got error: " + err);
        assert.strictEqual(true, (results > 0), label + " " + results + " is not a positive number");
        return true;
    };
}

function require_string(str, label) {
    return function (err, results) {
        assert.strictEqual(null, err, label + " expected string '" + str + "', got error: " + err);
        assert.equal(str, results, label + " " + str + " does not match " + results);
        return true;
    };
}

function require_null(label) {
    return function (err, results) {
        assert.strictEqual(null, err, label + " expected null, got error: " + err);
        assert.strictEqual(null, results, label + ": " + results + " is not null");
        return true;
    };
}

function require_error(label) {
    return function (err, results) {
        assert.notEqual(err, null, label + " err is null, but an error is expected here.");
        return true;
    };
}

function is_empty_array(obj) {
    return Array.isArray(obj) && obj.length === 0;
}

function last(name, fn) {
    return function (err, results) {
        fn(err, results);
        next(name);
    };
}

// Wraps the given callback in a timeout. If the returned function
// is not called within the timeout period, we fail the named test.
function with_timeout(name, cb, millis) {
    var timeoutId = setTimeout(function() {
        assert.fail("Callback timed out!", name);
    }, millis);
    return function() {
        clearTimeout(timeoutId);
        cb.apply(this, arguments);
    };
}

next = function next(name) {
    console.log(" \x1b[33m" + (Date.now() - cur_start) + "\x1b[0m ms");
    run_next_test();
};

// ------------------------------------------------------------------------ //

tests.doOrderCompleted = function() {
    var name = "doOrderCompleted";
    
    qihoo.doOrderCompleted(
        '123.125.80.5',
        'order_id=1308135278617459061&app_key=testkey&product_id=1&amount=100&app_uid=283181830&user_id=283181830&sign_type=md5&gateway_flag=success&sign=5f89e7bc0f47d72ae5576181e6df2eb3&sign_return=c18f7636a41e06ce803c31554db67321',
        function(text) {
        },
        function(result) {
            assert.strictEqual(true, result);
            next(name);
        }
    );
};

// ------------------------------------------------------------------------ //

all_tests = Object.keys(tests);
all_start = new Date();
test_count = 0;

run_next_test = function run_next_test() {
    var test_name = all_tests.shift();
    if (typeof tests[test_name] === 'function') {
        util.print('- \x1b[1m' + test_name.toLowerCase() + '\x1b[0m:');
        cur_start = new Date();
        test_count += 1;
        tests[test_name]();
    } else {
        console.log('\n  completed \x1b[32m%d\x1b[0m tests in \x1b[33m%d\x1b[0m ms\n', test_count, new Date() - all_start);
    }
};

// ------------------------------------------------------------------------ //

run_next_test();

// ------------------------------------------------------------------------ //

