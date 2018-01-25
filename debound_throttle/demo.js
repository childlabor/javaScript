var scrollNum = 0;

window.onload = function () {
    var demos = document.querySelectorAll(".demo");
    var demo0 = document.getElementById("demo0");
    var demo1 = document.getElementById("demo1");
    var demo2 = document.getElementById("demo2");
    var demo3 = document.getElementById("demo3");
    var demo4 = document.getElementById("demo4");
    var demo5 = document.getElementById("demo5");
    var demo6 = document.getElementById("demo6");

    // 原始状态
    demo0.onmousemove = function () {
        testEvent();
    }

    // 基础防抖
    demo1.onmousemove = function () {
        debounce1(testEvent);
    }

    // 基础防抖2			
    demo2.onmousemove = debounce2(testEvent, 100);

    // 高级防抖 第三参数为false时与demo2效果相同
    demo3.onmousemove = debounce3(testEvent, 100, true);


    // 基础节流
    demo4.onmousemove = throttle1(testEvent, 1000, 5000);

    // 高级节流
    demo5.onmousemove = throttle2(testEvent, 1000, { leading: false });
    demo6.onmousemove = throttle2(testEvent, 1000, { trailing: false });

    // 清空console 初始计数
    window.onclick = function () {
        console.clear();
        scrollNum = 0;
    }
};
//=======================

function testEvent() {
    scrollNum++;
    console.log("鼠标移动了" + scrollNum + "次");
};

// 防抖基础版1（高程三），利用定时器
function debounce1(method, context) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function () {
        method.call(context);
    }, 100);
};

// 防抖基础版2，通过返回闭包的形式。
function debounce2(method, delay) {
    var timer = null;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            method.apply(context, args);
        }, delay);
    }
};

// 防抖3升级版（underscore.js），通过返回闭包的形式。(应用级)
// sample 1: debounce(function(){}, 1000)
// 连续事件结束后的 1000ms 后触发
// sample 1: debounce(function(){}, 1000, true)
// 连续事件触发后立即触发（此时会忽略第二个参数）
function debounce3(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function () {
        // 定时器设置的回调 later 方法的触发时间，和连续事件触发的最后一次时间戳的间隔
        // 如果间隔为 wait（或者刚好大于 wait），则触发事件
        var last = new Date() - timestamp;

        // 时间间隔 last 在 [0, wait) 中
        // 还没到触发的点，则继续设置定时器
        // last 值应该不会小于 0 吧？
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            // 到了可以触发的时间点
            timeout = null;
            // 可以触发了
            // 并且不是设置为立即触发的
            // 因为如果是立即触发（callNow），也会进入这个回调中
            // 主要是为了将 timeout 值置为空，使之不影响下次连续事件的触发
            // 如果不是立即执行，随即执行 func 方法
            if (!immediate) {
                // 执行 func 函数
                result = func.apply(context, args);
                // 这里的 timeout 一定是 null 了吧
                // 感觉这个判断多余了
                if (!timeout) {
                    context = args = null;
                }
            }
        }
    };
    // 嗯，闭包返回的函数，是可以传入参数的
    return function () {
        // 可以指定 this 指向
        context = this;
        args = arguments;

        // 每次触发函数，更新时间戳
        // later 方法中取 last 值时用到该变量
        // 判断距离上次触发事件是否已经过了 wait seconds 了
        // 即我们需要距离最后一次触发事件 wait seconds 后触发这个回调方法
        timestamp = new Date();

        // 立即触发需要满足两个条件
        // immediate 参数为 true，并且 timeout 还没设置
        // immediate 参数为 true 是显而易见的
        // 如果去掉 !timeout 的条件，就会一直触发，而不是触发一次
        // 因为第一次触发后已经设置了 timeout，所以根据 timeout 是否为空可以判断是否是首次触发
        var callNow = immediate && !timeout;

        // 设置 wait seconds 后触发 later 方法
        // 无论是否 callNow（如果是 callNow，也进入 later 方法，去 later 方法中判断是否执行相应回调函数）
        // 在某一段的连续触发中，只会在第一次触发时进入这个 if 分支中
        if (!timeout) {
            // 设置了 timeout，所以以后不会进入这个 if 分支了
            timeout = setTimeout(later, wait);
        }

        // 如果是立即触发
        if (callNow) {
            // func 可能是有返回值的
            result = func.apply(context, args);
            // 解除引用
            context = args = null;
        }

        return result;
    };
};


// 节流基础版 固定间隔执行
function throttle1(method, delay, time) {
    var timeout, startTime = new Date();
    return function () {
        var context = this,
            args = arguments,
            curTime = new Date();
        clearTimeout(timeout);
        // 如果达到了规定的触发时间间隔，触发 handler
        if (curTime - startTime >= time) {
            method.apply(context, args);
            startTime = curTime;
            // 没达到触发间隔，重新设定定时器
        } else {
            timeout = setTimeout(method, delay);
        }
    };
};

// 节流升级版（应用级） underscore.js
/**
* 函数节流（如果有连续事件响应，则每间隔一定时间段触发）
* 每间隔 wait(Number) milliseconds 触发一次 func 方法
* 如果 options 参数传入 {leading: false}
* 那么不会马上触发（等待 wait milliseconds 后第一次触发 func）
* 如果 options 参数传入 {trailing: false}
* 那么最后一次回调不会被触发
* *Notice: options 不能同时设置 leading 和 trailing 为 false**
* 示例：
* var throttled = _.throttle(updatePosition, 100);
* $(window).scroll(throttled);
* 调用方式（注意看 A 和 B console.log 打印的位置）：
* _.throttle(function, wait, [options])
* sample 1: _.throttle(function(){}, 1000)
* print: A, B, B, B ...
* sample 2: _.throttle(function(){}, 1000, {leading: false})
* print: B, B, B, B ...
* sample 3: _.throttle(function(){}, 1000, {trailing: false})
* print: A, A, A, A ...
**/
function throttle2(func, wait, options) {
    var context, args, result;

    // setTimeout 的 handler
    var timeout = null;

    // 标记时间戳
    // 上一次执行回调的时间戳
    var previous = 0;

    // 如果没有传入 options 参数
    // 则将 options 参数置为空对象
    if (!options) {
        options = {};
    }

    var later = function () {
        // 如果 options.leading === false
        // 则每次触发回调后将 previous 置为 0
        // 否则置为当前时间戳
        previous = options.leading === false ? 0 : new Date();
        timeout = null;
        // console.log('B')
        result = func.apply(context, args);

        // 这里的 timeout 变量一定是 null 了吧
        // 是否没有必要进行判断？
        if (!timeout) {
            context = args = null;
        }
    };

    // 以滚轮事件为例（scroll）
    // 每次触发滚轮事件即执行这个返回的方法
    // _.throttle 方法返回的函数
    return function () {
        // 记录当前时间戳
        var now = new Date();

        // 第一次执行回调（此时 previous 为 0，之后 previous 值为上一次时间戳）
        // 并且如果程序设定第一个回调不是立即执行的（options.leading === false）
        // 则将 previous 值（表示上次执行的时间戳）设为 now 的时间戳（第一次触发时）
        // 表示刚执行过，这次就不用执行了
        if (!previous && options.leading === false) {
            previous = now;
        }

        // 距离下次触发 func 还需要等待的时间
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;

        // 要么是到了间隔时间了，随即触发方法（remaining <= 0）
        // 要么是没有传入 {leading: false}，且第一次触发回调，即立即触发
        // 此时 previous 为 0，wait - (now - previous) 也满足 <= 0
        // 之后便会把 previous 值迅速置为 now
        // ========= //
        // remaining > wait，表示客户端系统时间被调整过
        // 则马上执行 func 函数
        // @see https://blog.coding.net/blog/the-difference-between-throttle-and-debounce-in-underscorejs
        // ========= //

        // console.log(remaining) 可以打印出来看看
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                // 解除引用，防止内存泄露
                timeout = null;
            }

            // 重置前一次触发的时间戳
            previous = now;

            // 触发方法
            // result 为该方法返回值
            // console.log('A')
            result = func.apply(context, args);

            // 引用置为空，防止内存泄露
            // 感觉这里的 timeout 肯定是 null 啊？这个 if 判断没必要吧？
            if (!timeout) {
                context = args = null;
            }

        } else if (!timeout && options.trailing !== false) { // 最后一次需要触发的情况
            // 如果已经存在一个定时器，则不会进入该 if 分支
            // 如果 {trailing: false}，即最后一次不需要触发了，也不会进入这个分支
            // 间隔 remaining milliseconds 后触发 later 方法
            timeout = setTimeout(later, remaining);
        }

        // 回调返回值
        return result;
    };
};