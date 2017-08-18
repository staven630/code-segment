```

var Utils = {
	//字符串操作函数	
	/**
	 * 以某字符分隔字符串
	 * @param {Object} num	每几位数
	 * @param {Object} regStr 替换字符串
	separateString: function(string, num, regStr) {
		var reg = new RegExp("\(\\d)(?=(?:\\d{" + num + "})+$)", 'g');
		return string.toString().replace(reg, '$1' + regStr);
	},
	
	/**
	 * 隐藏/替换字符串中间几位
	 * @param {Object} startNum 开始替换位数
	 * @param {Object} lastNum	结束替换为数
	 * @param {Object} regStr	替换的字符串
	 */
	hideMiddleString: function(string, startNum, lastNum, regStr) {
		var reg = new RegExp("\^(.{" + startNum + "})(?:\\d+)(.{" + lastNum + "})$");
		return string.toString().replace(reg, "$1"+ regStr +"$2");
	},
	
	/**
	 * 每三位正数添加逗号
	 * @param {Object} type 需要保留的小数
	 */
	separateMoney function(string, type) {
		if(/[^0-9\.]/.test(string) || string == null || string == "") return 0;
		string = string.toString().replace(/^(\d*)$/, "$1.");
		string = (string + "00").replace(/(\d*\.\d\d)\d*/, "$1");
		string = string.replace(".", ",");
		var re = /(\d)(\d{3},)/;
		while(re.test(string))
			string = string.replace(re, "$1,$2");
		string = string.replace(/,(\d\d)$/, ".$1");
		if(type == 0) { // 不带小数位(默认是有小数位)  
			var a = string.split(".");
			if(a[1] == "00") {
				string = a[0];
			}
		}
		return string;
	},
	
	//日期操作函数
    //获取YYYY-MM-DD格式日期
	getYYYYMMDD: function(time) {
		var date = time ? new Date(time) : new Date();
		return date.toISOString().match(/\d{4}-\d{2}-\d{2}/)[0];
	},
	
	
	//浏览器
	//判断是否是ie浏览器
	isIE: function() {
		return !!window.ActiveXObject || 'ActiveXObject' in window;
	},
	
    //获取浏览器版本
    getIEVersion: function() {
        var match = navigator.appVersion.match(/MSIE\s+\d+.0;/);
        if (match == null) return false;
        return +match[0].match(/\d+/)[0];
    },
    
    //浏览器事件对象系统
    //事件系统
    getEvent: function(event) {
        return event ? event : window.event;
    },

    //获取事件对象
    getTarget: function(event) {
        event = this.getEvent();
        return event.target || event.srcElement;
    },

    //添加事件
    addHandler: function(element, type, handler) {
        if(element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if(element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },

    //移除事件
    removeHandler: function(element, type, handler) {
        if(element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if(element.detachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },

    //阻止默认事件
    preventDefault: function(event) {
        event = this.getEvent();
        if(event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },

    //阻止冒泡
    stopPropagation: function(event) {
        event = this.getEvent();
        if(event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },

    //获取当前位置的X轴坐标
    getPageX: function(event) {
        event = this.getEvent(event);
        return typeof event.pageX === 'undefined' ? (event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft)) : event.pageX;
    },

    //获取当前位置的Y轴坐标
    getPageY: function(event) {
        event = this.getEvent(event);
        return typeof event.pageY === 'undefined' ? (event.clientY + (document.body.scrollTop || document.documentElement.scrollTop)) : event.pageX;
    },
    
    
    //性能优化
    //相同参数避免多次调用
    memoize: function(fn) {
        var cachedArg;
        var cachedResult;
        return function(arg) {
            if (cachedArg === arg) {
                return cachedResult;
            }
            cachedArg = arg;
            cachedResult = fn(arg);
            return cachedResult;
        }
    }
    
};

```