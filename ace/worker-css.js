function initBaseUrls(a) {
    require.tlns = a
}
function initSender() {
    var a = require(null, "ace/lib/event_emitter").EventEmitter, b = require(null, "ace/lib/oop"), c = function () {
    };
    return function () {
        b.implement(this, a), this.callback = function (a, b) {
            postMessage({type: "call", id: b, data: a})
        }, this.emit = function (a, b) {
            postMessage({type: "event", name: a, data: b})
        }
    }.call(c.prototype), new c
}
"no use strict";
var console = {
    log: function (a) {
        postMessage({type: "log", data: a})
    }
}, window = {console: console}, normalizeModule = function (a, b) {
    if (b.indexOf("!") !== -1) {
        var c = b.split("!");
        return normalizeModule(a, c[0]) + "!" + normalizeModule(a, c[1])
    }
    if (b.charAt(0) == ".") {
        var d = a.split("/").slice(0, -1).join("/"), b = d + "/" + b;
        while (b.indexOf(".") !== -1 && e != b)var e = b, b = b.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "")
    }
    return b
}, require = function (a, b) {
    var b = normalizeModule(a, b), c = require.modules[b];
    if (c)return c.initialized || (c.initialized = !0, c.exports = c.factory().exports), c.exports;
    var d = b.split("/");
    d[0] = require.tlns[d[0]] || d[0];
    var e = d.join("/") + ".js";
    return require.id = b, importScripts(e), require(a, b)
};
require.modules = {}, require.tlns = {};
var define = function (a, b, c) {
    arguments.length == 2 ? (c = b, typeof a != "string" && (b = a, a = require.id)) : arguments.length == 1 && (c = a, a = require.id);
    if (a.indexOf("text!") === 0)return;
    var d = function (b, c) {
        return require(a, b, c)
    };
    require.modules[a] = {
        factory: function () {
            var a = {exports: {}}, b = c(d, a.exports, a);
            return b && (a.exports = b), a
        }
    }
}, main, sender;
onmessage = function (a) {
    var b = a.data;
    if (b.command)main[b.command].apply(main, b.args); else if (b.init) {
        initBaseUrls(b.tlns), require(null, "ace/lib/fixoldbrowsers"), sender = initSender();
        var c = require(null, b.module)[b.classname];
        main = new c(sender)
    } else b.event && sender && sender._emit(b.event, b.data)
}, define("ace/lib/fixoldbrowsers", ["require", "exports", "module", "ace/lib/regexp", "ace/lib/es5-shim"], function (a, b, c) {
    a("./regexp"), a("./es5-shim")
}), define("ace/lib/regexp", ["require", "exports", "module"], function (a, b, c) {
    function g(a) {
        return (a.global ? "g" : "") + (a.ignoreCase ? "i" : "") + (a.multiline ? "m" : "") + (a.extended ? "x" : "") + (a.sticky ? "y" : "")
    }

    function h(a, b, c) {
        if (Array.prototype.indexOf)return a.indexOf(b, c);
        for (var d = c || 0; d < a.length; d++)if (a[d] === b)return d;
        return -1
    }

    var d = {
        exec: RegExp.prototype.exec,
        test: RegExp.prototype.test,
        match: String.prototype.match,
        replace: String.prototype.replace,
        split: String.prototype.split
    }, e = d.exec.call(/()??/, "")[1] === undefined, f = function () {
        var a = /^/g;
        return d.test.call(a, ""), !a.lastIndex
    }();
    if (f && e)return;
    RegExp.prototype.exec = function (a) {
        var b = d.exec.apply(this, arguments), c, i;
        if (typeof a == "string" && b) {
            !e && b.length > 1 && h(b, "") > -1 && (i = RegExp(this.source, d.replace.call(g(this), "g", "")), d.replace.call(a.slice(b.index), i, function () {
                for (var a = 1; a < arguments.length - 2; a++)arguments[a] === undefined && (b[a] = undefined)
            }));
            if (this._xregexp && this._xregexp.captureNames)for (var j = 1; j < b.length; j++)c = this._xregexp.captureNames[j - 1], c && (b[c] = b[j]);
            !f && this.global && !b[0].length && this.lastIndex > b.index && this.lastIndex--
        }
        return b
    }, f || (RegExp.prototype.test = function (a) {
        var b = d.exec.call(this, a);
        return b && this.global && !b[0].length && this.lastIndex > b.index && this.lastIndex--, !!b
    })
}), define("ace/lib/es5-shim", ["require", "exports", "module"], function (a, b, c) {
    function p(a) {
        try {
            return Object.defineProperty(a, "sentinel", {}), "sentinel" in a
        } catch (b) {
        }
    }

    Function.prototype.bind || (Function.prototype.bind = function (b) {
        var c = this;
        if (typeof c != "function")throw new TypeError;
        var d = g.call(arguments, 1), e = function () {
            if (this instanceof e) {
                var a = function () {
                };
                a.prototype = c.prototype;
                var f = new a, h = c.apply(f, d.concat(g.call(arguments)));
                return h !== null && Object(h) === h ? h : f
            }
            return c.apply(b, d.concat(g.call(arguments)))
        };
        return e
    });
    var d = Function.prototype.call, e = Array.prototype, f = Object.prototype, g = e.slice, h = d.bind(f.toString), i = d.bind(f.hasOwnProperty), j, k, l, m, n;
    if (n = i(f, "__defineGetter__"))j = d.bind(f.__defineGetter__), k = d.bind(f.__defineSetter__), l = d.bind(f.__lookupGetter__), m = d.bind(f.__lookupSetter__);
    Array.isArray || (Array.isArray = function (b) {
        return h(b) == "[object Array]"
    }), Array.prototype.forEach || (Array.prototype.forEach = function (b) {
        var c = G(this), d = arguments[1], e = 0, f = c.length >>> 0;
        if (h(b) != "[object Function]")throw new TypeError;
        while (e < f)e in c && b.call(d, c[e], e, c), e++
    }), Array.prototype.map || (Array.prototype.map = function (b) {
        var c = G(this), d = c.length >>> 0, e = Array(d), f = arguments[1];
        if (h(b) != "[object Function]")throw new TypeError;
        for (var g = 0; g < d; g++)g in c && (e[g] = b.call(f, c[g], g, c));
        return e
    }), Array.prototype.filter || (Array.prototype.filter = function (b) {
        var c = G(this), d = c.length >>> 0, e = [], f = arguments[1];
        if (h(b) != "[object Function]")throw new TypeError;
        for (var g = 0; g < d; g++)g in c && b.call(f, c[g], g, c) && e.push(c[g]);
        return e
    }), Array.prototype.every || (Array.prototype.every = function (b) {
        var c = G(this), d = c.length >>> 0, e = arguments[1];
        if (h(b) != "[object Function]")throw new TypeError;
        for (var f = 0; f < d; f++)if (f in c && !b.call(e, c[f], f, c))return !1;
        return !0
    }), Array.prototype.some || (Array.prototype.some = function (b) {
        var c = G(this), d = c.length >>> 0, e = arguments[1];
        if (h(b) != "[object Function]")throw new TypeError;
        for (var f = 0; f < d; f++)if (f in c && b.call(e, c[f], f, c))return !0;
        return !1
    }), Array.prototype.reduce || (Array.prototype.reduce = function (b) {
        var c = G(this), d = c.length >>> 0;
        if (h(b) != "[object Function]")throw new TypeError;
        if (!d && arguments.length == 1)throw new TypeError;
        var e = 0, f;
        if (arguments.length >= 2)f = arguments[1]; else do {
            if (e in c) {
                f = c[e++];
                break
            }
            if (++e >= d)throw new TypeError
        } while (!0);
        for (; e < d; e++)e in c && (f = b.call(void 0, f, c[e], e, c));
        return f
    }), Array.prototype.reduceRight || (Array.prototype.reduceRight = function (b) {
        var c = G(this), d = c.length >>> 0;
        if (h(b) != "[object Function]")throw new TypeError;
        if (!d && arguments.length == 1)throw new TypeError;
        var e, f = d - 1;
        if (arguments.length >= 2)e = arguments[1]; else do {
            if (f in c) {
                e = c[f--];
                break
            }
            if (--f < 0)throw new TypeError
        } while (!0);
        do f in this && (e = b.call(void 0, e, c[f], f, c)); while (f--);
        return e
    }), Array.prototype.indexOf || (Array.prototype.indexOf = function (b) {
        var c = G(this), d = c.length >>> 0;
        if (!d)return -1;
        var e = 0;
        arguments.length > 1 && (e = E(arguments[1])), e = e >= 0 ? e : Math.max(0, d + e);
        for (; e < d; e++)if (e in c && c[e] === b)return e;
        return -1
    }), Array.prototype.lastIndexOf || (Array.prototype.lastIndexOf = function (b) {
        var c = G(this), d = c.length >>> 0;
        if (!d)return -1;
        var e = d - 1;
        arguments.length > 1 && (e = Math.min(e, E(arguments[1]))), e = e >= 0 ? e : d - Math.abs(e);
        for (; e >= 0; e--)if (e in c && b === c[e])return e;
        return -1
    }), Object.getPrototypeOf || (Object.getPrototypeOf = function (b) {
        return b.__proto__ || (b.constructor ? b.constructor.prototype : f)
    });
    if (!Object.getOwnPropertyDescriptor) {
        var o = "Object.getOwnPropertyDescriptor called on a non-object: ";
        Object.getOwnPropertyDescriptor = function (b, c) {
            if (typeof b != "object" && typeof b != "function" || b === null)throw new TypeError(o + b);
            if (!i(b, c))return;
            var d, e, g;
            d = {enumerable: !0, configurable: !0};
            if (n) {
                var h = b.__proto__;
                b.__proto__ = f;
                var e = l(b, c), g = m(b, c);
                b.__proto__ = h;
                if (e || g)return e && (d.get = e), g && (d.set = g), d
            }
            return d.value = b[c], d
        }
    }
    Object.getOwnPropertyNames || (Object.getOwnPropertyNames = function (b) {
        return Object.keys(b)
    }), Object.create || (Object.create = function (b, c) {
        var d;
        if (b === null)d = {__proto__: null}; else {
            if (typeof b != "object")throw new TypeError("typeof prototype[" + typeof b + "] != 'object'");
            var e = function () {
            };
            e.prototype = b, d = new e, d.__proto__ = b
        }
        return c !== void 0 && Object.defineProperties(d, c), d
    });
    if (Object.defineProperty) {
        var q = p({}), r = typeof document == "undefined" || p(document.createElement("div"));
        if (!q || !r)var s = Object.defineProperty
    }
    if (!Object.defineProperty || s) {
        var t = "Property description must be an object: ", u = "Object.defineProperty called on non-object: ", v = "getters & setters can not be defined on this javascript engine";
        Object.defineProperty = function (b, c, d) {
            if (typeof b != "object" && typeof b != "function" || b === null)throw new TypeError(u + b);
            if (typeof d != "object" && typeof d != "function" || d === null)throw new TypeError(t + d);
            if (s)try {
                return s.call(Object, b, c, d)
            } catch (e) {
            }
            if (i(d, "value"))if (n && (l(b, c) || m(b, c))) {
                var g = b.__proto__;
                b.__proto__ = f, delete b[c], b[c] = d.value, b.__proto__ = g
            } else b[c] = d.value; else {
                if (!n)throw new TypeError(v);
                i(d, "get") && j(b, c, d.get), i(d, "set") && k(b, c, d.set)
            }
            return b
        }
    }
    Object.defineProperties || (Object.defineProperties = function (b, c) {
        for (var d in c)i(c, d) && Object.defineProperty(b, d, c[d]);
        return b
    }), Object.seal || (Object.seal = function (b) {
        return b
    }), Object.freeze || (Object.freeze = function (b) {
        return b
    });
    try {
        Object.freeze(function () {
        })
    } catch (w) {
        Object.freeze = function (b) {
            return function (c) {
                return typeof c == "function" ? c : b(c)
            }
        }(Object.freeze)
    }
    Object.preventExtensions || (Object.preventExtensions = function (b) {
        return b
    }), Object.isSealed || (Object.isSealed = function (b) {
        return !1
    }), Object.isFrozen || (Object.isFrozen = function (b) {
        return !1
    }), Object.isExtensible || (Object.isExtensible = function (b) {
        if (Object(b) === b)throw new TypeError;
        var c = "";
        while (i(b, c))c += "?";
        b[c] = !0;
        var d = i(b, c);
        return delete b[c], d
    });
    if (!Object.keys) {
        var x = !0, y = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"], z = y.length;
        for (var A in{toString: null})x = !1;
        Object.keys = function H(a) {
            if (typeof a != "object" && typeof a != "function" || a === null)throw new TypeError("Object.keys called on a non-object");
            var H = [];
            for (var b in a)i(a, b) && H.push(b);
            if (x)for (var c = 0, d = z; c < d; c++) {
                var e = y[c];
                i(a, e) && H.push(e)
            }
            return H
        }
    }
    if (!Date.prototype.toISOString || (new Date(-621987552e5)).toISOString().indexOf("-000001") === -1)Date.prototype.toISOString = function () {
        var b, c, d, e;
        if (!isFinite(this))throw new RangeError;
        b = [this.getUTCMonth() + 1, this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()], e = this.getUTCFullYear(), e = (e < 0 ? "-" : e > 9999 ? "+" : "") + ("00000" + Math.abs(e)).slice(0 <= e && e <= 9999 ? -4 : -6), c = b.length;
        while (c--)d = b[c], d < 10 && (b[c] = "0" + d);
        return e + "-" + b.slice(0, 2).join("-") + "T" + b.slice(2).join(":") + "." + ("000" + this.getUTCMilliseconds()).slice(-3) + "Z"
    };
    Date.now || (Date.now = function () {
        return (new Date).getTime()
    }), Date.prototype.toJSON || (Date.prototype.toJSON = function (b) {
        if (typeof this.toISOString != "function")throw new TypeError;
        return this.toISOString()
    }), Date.parse("+275760-09-13T00:00:00.000Z") !== 864e13 && (Date = function (a) {
        var b = function e(b, c, d, f, g, h, i) {
            var j = arguments.length;
            if (this instanceof a) {
                var k = j == 1 && String(b) === b ? new a(e.parse(b)) : j >= 7 ? new a(b, c, d, f, g, h, i) : j >= 6 ? new a(b, c, d, f, g, h) : j >= 5 ? new a(b, c, d, f, g) : j >= 4 ? new a(b, c, d, f) : j >= 3 ? new a(b, c, d) : j >= 2 ? new a(b, c) : j >= 1 ? new a(b) : new a;
                return k.constructor = e, k
            }
            return a.apply(this, arguments)
        }, c = new RegExp("^(\\d{4}|[+-]\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2})(?::(\\d{2})(?:\\.(\\d{3}))?)?(?:Z|(?:([-+])(\\d{2}):(\\d{2})))?)?)?)?$");
        for (var d in a)b[d] = a[d];
        return b.now = a.now, b.UTC = a.UTC, b.prototype = a.prototype, b.prototype.constructor = b, b.parse = function (d) {
            var e = c.exec(d);
            if (e) {
                e.shift();
                for (var f = 1; f < 7; f++)e[f] = +(e[f] || (f < 3 ? 1 : 0)), f == 1 && e[f]--;
                var g = +e.pop(), h = +e.pop(), i = e.pop(), j = 0;
                if (i) {
                    if (h > 23 || g > 59)return NaN;
                    j = (h * 60 + g) * 6e4 * (i == "+" ? -1 : 1)
                }
                var k = +e[0];
                return 0 <= k && k <= 99 ? (e[0] = k + 400, a.UTC.apply(this, e) + j - 126227808e5) : a.UTC.apply(this, e) + j
            }
            return a.parse.apply(this, arguments)
        }, b
    }(Date));
    var B = "	\n\f\r   ᠎             　\u2028\u2029﻿";
    if (!String.prototype.trim || B.trim()) {
        B = "[" + B + "]";
        var C = new RegExp("^" + B + B + "*"), D = new RegExp(B + B + "*$");
        String.prototype.trim = function () {
            return String(this).replace(C, "").replace(D, "")
        }
    }
    var E = function (a) {
        return a = +a, a !== a ? a = 0 : a !== 0 && a !== 1 / 0 && a !== -Infinity && (a = (a > 0 || -1) * Math.floor(Math.abs(a))), a
    }, F = "a"[0] != "a", G = function (a) {
        if (a == null)throw new TypeError;
        return F && typeof a == "string" && a ? a.split("") : Object(a)
    }
}), define("ace/lib/event_emitter", ["require", "exports", "module"], function (a, b, c) {
    var d = {};
    d._emit = d._dispatchEvent = function (a, b) {
        this._eventRegistry = this._eventRegistry || {}, this._defaultHandlers = this._defaultHandlers || {};
        var c = this._eventRegistry[a] || [], d = this._defaultHandlers[a];
        if (!c.length && !d)return;
        b = b || {}, b.type || (b.type = a), b.stopPropagation || (b.stopPropagation = function () {
            this.propagationStopped = !0
        }), b.preventDefault || (b.preventDefault = function () {
            this.defaultPrevented = !0
        });
        for (var e = 0; e < c.length; e++) {
            c[e](b);
            if (b.propagationStopped)break
        }
        if (d && !b.defaultPrevented)return d(b)
    }, d.setDefaultHandler = function (a, b) {
        this._defaultHandlers = this._defaultHandlers || {};
        if (this._defaultHandlers[a])throw new Error("The default handler for '" + a + "' is already set");
        this._defaultHandlers[a] = b
    }, d.on = d.addEventListener = function (a, b) {
        this._eventRegistry = this._eventRegistry || {};
        var c = this._eventRegistry[a];
        c || (c = this._eventRegistry[a] = []), c.indexOf(b) == -1 && c.push(b)
    }, d.removeListener = d.removeEventListener = function (a, b) {
        this._eventRegistry = this._eventRegistry || {};
        var c = this._eventRegistry[a];
        if (!c)return;
        var d = c.indexOf(b);
        d !== -1 && c.splice(d, 1)
    }, d.removeAllListeners = function (a) {
        this._eventRegistry && (this._eventRegistry[a] = [])
    }, b.EventEmitter = d
}), define("ace/lib/oop", ["require", "exports", "module"], function (a, b, c) {
    b.inherits = function () {
        var a = function () {
        };
        return function (b, c) {
            a.prototype = c.prototype, b.super_ = c.prototype, b.prototype = new a, b.prototype.constructor = b
        }
    }(), b.mixin = function (a, b) {
        for (var c in b)a[c] = b[c]
    }, b.implement = function (a, c) {
        b.mixin(a, c)
    }
}), define("ace/mode/css_worker", ["require", "exports", "module", "ace/lib/oop", "ace/worker/mirror", "ace/mode/css/csslint"], function (a, b, c) {
    var d = a("../lib/oop"), e = a("../worker/mirror").Mirror, f = a("./css/csslint").CSSLint, g = b.Worker = function (a) {
        e.call(this, a), this.setTimeout(200)
    };
    d.inherits(g, e), function () {
        this.onUpdate = function () {
            var a = this.doc.getValue(), b = f.verify(a);
            this.sender.emit("csslint", b.messages.map(function (a) {
                return delete a.rule, a
            }))
        }
    }.call(g.prototype)
}), define("ace/worker/mirror", ["require", "exports", "module", "ace/document", "ace/lib/lang"], function (a, b, c) {
    var d = a("../document").Document, e = a("../lib/lang"), f = b.Mirror = function (a) {
        this.sender = a;
        var b = this.doc = new d(""), c = this.deferredUpdate = e.deferredCall(this.onUpdate.bind(this)), f = this;
        a.on("change", function (a) {
            b.applyDeltas([a.data]), c.schedule(f.$timeout)
        })
    };
    (function () {
        this.$timeout = 500, this.setTimeout = function (a) {
            this.$timeout = a
        }, this.setValue = function (a) {
            this.doc.setValue(a), this.deferredUpdate.schedule(this.$timeout)
        }, this.getValue = function (a) {
            this.sender.callback(this.doc.getValue(), a)
        }, this.onUpdate = function () {
        }
    }).call(f.prototype)
}), define("ace/document", ["require", "exports", "module", "ace/lib/oop", "ace/lib/event_emitter", "ace/range", "ace/anchor"], function (a, b, c) {
    var d = a("./lib/oop"), e = a("./lib/event_emitter").EventEmitter, f = a("./range").Range, g = a("./anchor").Anchor, h = function (a) {
        this.$lines = [], a.length == 0 ? this.$lines = [""] : Array.isArray(a) ? this.insertLines(0, a) : this.insert({
            row: 0,
            column: 0
        }, a)
    };
    (function () {
        d.implement(this, e), this.setValue = function (a) {
            var b = this.getLength();
            this.remove(new f(0, 0, b, this.getLine(b - 1).length)), this.insert({row: 0, column: 0}, a)
        }, this.getValue = function () {
            return this.getAllLines().join(this.getNewLineCharacter())
        }, this.createAnchor = function (a, b) {
            return new g(this, a, b)
        }, "aaa".split(/a/).length == 0 ? this.$split = function (a) {
            return a.replace(/\r\n|\r/g, "\n").split("\n")
        } : this.$split = function (a) {
            return a.split(/\r\n|\r|\n/)
        }, this.$detectNewLine = function (a) {
            var b = a.match(/^.*?(\r\n|\r|\n)/m);
            b ? this.$autoNewLine = b[1] : this.$autoNewLine = "\n"
        }, this.getNewLineCharacter = function () {
            switch (this.$newLineMode) {
                case"windows":
                    return "\r\n";
                case"unix":
                    return "\n";
                case"auto":
                    return this.$autoNewLine
            }
        }, this.$autoNewLine = "\n", this.$newLineMode = "auto", this.setNewLineMode = function (a) {
            if (this.$newLineMode === a)return;
            this.$newLineMode = a
        }, this.getNewLineMode = function () {
            return this.$newLineMode
        }, this.isNewLine = function (a) {
            return a == "\r\n" || a == "\r" || a == "\n"
        }, this.getLine = function (a) {
            return this.$lines[a] || ""
        }, this.getLines = function (a, b) {
            return this.$lines.slice(a, b + 1)
        }, this.getAllLines = function () {
            return this.getLines(0, this.getLength())
        }, this.getLength = function () {
            return this.$lines.length
        }, this.getTextRange = function (a) {
            if (a.start.row == a.end.row)return this.$lines[a.start.row].substring(a.start.column, a.end.column);
            var b = this.getLines(a.start.row + 1, a.end.row - 1);
            return b.unshift((this.$lines[a.start.row] || "").substring(a.start.column)), b.push((this.$lines[a.end.row] || "").substring(0, a.end.column)), b.join(this.getNewLineCharacter())
        }, this.$clipPosition = function (a) {
            var b = this.getLength();
            return a.row >= b && (a.row = Math.max(0, b - 1), a.column = this.getLine(b - 1).length), a
        }, this.insert = function (a, b) {
            if (!b || b.length === 0)return a;
            a = this.$clipPosition(a), this.getLength() <= 1 && this.$detectNewLine(b);
            var c = this.$split(b), d = c.splice(0, 1)[0], e = c.length == 0 ? null : c.splice(c.length - 1, 1)[0];
            return a = this.insertInLine(a, d), e !== null && (a = this.insertNewLine(a), a = this.insertLines(a.row, c), a = this.insertInLine(a, e || "")), a
        }, this.insertLines = function (a, b) {
            if (b.length == 0)return {row: a, column: 0};
            if (b.length > 65535) {
                var c = this.insertLines(a, b.slice(65535));
                b = b.slice(0, 65535)
            }
            var d = [a, 0];
            d.push.apply(d, b), this.$lines.splice.apply(this.$lines, d);
            var e = new f(a, 0, a + b.length, 0), g = {action: "insertLines", range: e, lines: b};
            return this._emit("change", {data: g}), c || e.end
        }, this.insertNewLine = function (a) {
            a = this.$clipPosition(a);
            var b = this.$lines[a.row] || "";
            this.$lines[a.row] = b.substring(0, a.column), this.$lines.splice(a.row + 1, 0, b.substring(a.column, b.length));
            var c = {row: a.row + 1, column: 0}, d = {
                action: "insertText",
                range: f.fromPoints(a, c),
                text: this.getNewLineCharacter()
            };
            return this._emit("change", {data: d}), c
        }, this.insertInLine = function (a, b) {
            if (b.length == 0)return a;
            var c = this.$lines[a.row] || "";
            this.$lines[a.row] = c.substring(0, a.column) + b + c.substring(a.column);
            var d = {row: a.row, column: a.column + b.length}, e = {
                action: "insertText",
                range: f.fromPoints(a, d),
                text: b
            };
            return this._emit("change", {data: e}), d
        }, this.remove = function (a) {
            a.start = this.$clipPosition(a.start), a.end = this.$clipPosition(a.end);
            if (a.isEmpty())return a.start;
            var b = a.start.row, c = a.end.row;
            if (a.isMultiLine()) {
                var d = a.start.column == 0 ? b : b + 1, e = c - 1;
                a.end.column > 0 && this.removeInLine(c, 0, a.end.column), e >= d && this.removeLines(d, e), d != b && (this.removeInLine(b, a.start.column, this.getLine(b).length), this.removeNewLine(a.start.row))
            } else this.removeInLine(b, a.start.column, a.end.column);
            return a.start
        }, this.removeInLine = function (a, b, c) {
            if (b == c)return;
            var d = new f(a, b, a, c), e = this.getLine(a), g = e.substring(b, c), h = e.substring(0, b) + e.substring(c, e.length);
            this.$lines.splice(a, 1, h);
            var i = {action: "removeText", range: d, text: g};
            return this._emit("change", {data: i}), d.start
        }, this.removeLines = function (a, b) {
            var c = new f(a, 0, b + 1, 0), d = this.$lines.splice(a, b - a + 1), e = {
                action: "removeLines",
                range: c,
                nl: this.getNewLineCharacter(),
                lines: d
            };
            return this._emit("change", {data: e}), d
        }, this.removeNewLine = function (a) {
            var b = this.getLine(a), c = this.getLine(a + 1), d = new f(a, b.length, a + 1, 0), e = b + c;
            this.$lines.splice(a, 2, e);
            var g = {action: "removeText", range: d, text: this.getNewLineCharacter()};
            this._emit("change", {data: g})
        }, this.replace = function (a, b) {
            if (b.length == 0 && a.isEmpty())return a.start;
            if (b == this.getTextRange(a))return a.end;
            this.remove(a);
            if (b)var c = this.insert(a.start, b); else c = a.start;
            return c
        }, this.applyDeltas = function (a) {
            for (var b = 0; b < a.length; b++) {
                var c = a[b], d = f.fromPoints(c.range.start, c.range.end);
                c.action == "insertLines" ? this.insertLines(d.start.row, c.lines) : c.action == "insertText" ? this.insert(d.start, c.text) : c.action == "removeLines" ? this.removeLines(d.start.row, d.end.row - 1) : c.action == "removeText" && this.remove(d)
            }
        }, this.revertDeltas = function (a) {
            for (var b = a.length - 1; b >= 0; b--) {
                var c = a[b], d = f.fromPoints(c.range.start, c.range.end);
                c.action == "insertLines" ? this.removeLines(d.start.row, d.end.row - 1) : c.action == "insertText" ? this.remove(d) : c.action == "removeLines" ? this.insertLines(d.start.row, c.lines) : c.action == "removeText" && this.insert(d.start, c.text)
            }
        }
    }).call(h.prototype), b.Document = h
}), define("ace/range", ["require", "exports", "module"], function (a, b, c) {
    var d = function (a, b, c, d) {
        this.start = {row: a, column: b}, this.end = {row: c, column: d}
    };
    (function () {
        this.isEqual = function (a) {
            return this.start.row == a.start.row && this.end.row == a.end.row && this.start.column == a.start.column && this.end.column == a.end.column
        }, this.toString = function () {
            return "Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]"
        }, this.contains = function (a, b) {
            return this.compare(a, b) == 0
        }, this.compareRange = function (a) {
            var b, c = a.end, d = a.start;
            return b = this.compare(c.row, c.column), b == 1 ? (b = this.compare(d.row, d.column), b == 1 ? 2 : b == 0 ? 1 : 0) : b == -1 ? -2 : (b = this.compare(d.row, d.column), b == -1 ? -1 : b == 1 ? 42 : 0)
        }, this.comparePoint = function (a) {
            return this.compare(a.row, a.column)
        }, this.containsRange = function (a) {
            return this.comparePoint(a.start) == 0 && this.comparePoint(a.end) == 0
        }, this.intersects = function (a) {
            var b = this.compareRange(a);
            return b == -1 || b == 0 || b == 1
        }, this.isEnd = function (a, b) {
            return this.end.row == a && this.end.column == b
        }, this.isStart = function (a, b) {
            return this.start.row == a && this.start.column == b
        }, this.setStart = function (a, b) {
            typeof a == "object" ? (this.start.column = a.column, this.start.row = a.row) : (this.start.row = a, this.start.column = b)
        }, this.setEnd = function (a, b) {
            typeof a == "object" ? (this.end.column = a.column, this.end.row = a.row) : (this.end.row = a, this.end.column = b)
        }, this.inside = function (a, b) {
            return this.compare(a, b) == 0 ? this.isEnd(a, b) || this.isStart(a, b) ? !1 : !0 : !1
        }, this.insideStart = function (a, b) {
            return this.compare(a, b) == 0 ? this.isEnd(a, b) ? !1 : !0 : !1
        }, this.insideEnd = function (a, b) {
            return this.compare(a, b) == 0 ? this.isStart(a, b) ? !1 : !0 : !1
        }, this.compare = function (a, b) {
            return !this.isMultiLine() && a === this.start.row ? b < this.start.column ? -1 : b > this.end.column ? 1 : 0 : a < this.start.row ? -1 : a > this.end.row ? 1 : this.start.row === a ? b >= this.start.column ? 0 : -1 : this.end.row === a ? b <= this.end.column ? 0 : 1 : 0
        }, this.compareStart = function (a, b) {
            return this.start.row == a && this.start.column == b ? -1 : this.compare(a, b)
        }, this.compareEnd = function (a, b) {
            return this.end.row == a && this.end.column == b ? 1 : this.compare(a, b)
        }, this.compareInside = function (a, b) {
            return this.end.row == a && this.end.column == b ? 1 : this.start.row == a && this.start.column == b ? -1 : this.compare(a, b)
        }, this.clipRows = function (a, b) {
            if (this.end.row > b)var c = {row: b + 1, column: 0};
            if (this.start.row > b)var e = {row: b + 1, column: 0};
            if (this.start.row < a)var e = {row: a, column: 0};
            if (this.end.row < a)var c = {row: a, column: 0};
            return d.fromPoints(e || this.start, c || this.end)
        }, this.extend = function (a, b) {
            var c = this.compare(a, b);
            if (c == 0)return this;
            if (c == -1)var e = {row: a, column: b}; else var f = {row: a, column: b};
            return d.fromPoints(e || this.start, f || this.end)
        }, this.isEmpty = function () {
            return this.start.row == this.end.row && this.start.column == this.end.column
        }, this.isMultiLine = function () {
            return this.start.row !== this.end.row
        }, this.clone = function () {
            return d.fromPoints(this.start, this.end)
        }, this.collapseRows = function () {
            return this.end.column == 0 ? new d(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0) : new d(this.start.row, 0, this.end.row, 0)
        }, this.toScreenRange = function (a) {
            var b = a.documentToScreenPosition(this.start), c = a.documentToScreenPosition(this.end);
            return new d(b.row, b.column, c.row, c.column)
        }
    }).call(d.prototype), d.fromPoints = function (a, b) {
        return new d(a.row, a.column, b.row, b.column)
    }, b.Range = d
}), define("ace/anchor", ["require", "exports", "module", "ace/lib/oop", "ace/lib/event_emitter"], function (a, b, c) {
    var d = a("./lib/oop"), e = a("./lib/event_emitter").EventEmitter, f = b.Anchor = function (a, b, c) {
        this.document = a, typeof c == "undefined" ? this.setPosition(b.row, b.column) : this.setPosition(b, c), this.$onChange = this.onChange.bind(this), a.on("change", this.$onChange)
    };
    (function () {
        d.implement(this, e), this.getPosition = function () {
            return this.$clipPositionToDocument(this.row, this.column)
        }, this.getDocument = function () {
            return this.document
        }, this.onChange = function (a) {
            var b = a.data, c = b.range;
            if (c.start.row == c.end.row && c.start.row != this.row)return;
            if (c.start.row > this.row)return;
            if (c.start.row == this.row && c.start.column > this.column)return;
            var d = this.row, e = this.column;
            b.action === "insertText" ? c.start.row === d && c.start.column <= e ? c.start.row === c.end.row ? e += c.end.column - c.start.column : (e -= c.start.column, d += c.end.row - c.start.row) : c.start.row !== c.end.row && c.start.row < d && (d += c.end.row - c.start.row) : b.action === "insertLines" ? c.start.row <= d && (d += c.end.row - c.start.row) : b.action == "removeText" ? c.start.row == d && c.start.column < e ? c.end.column >= e ? e = c.start.column : e = Math.max(0, e - (c.end.column - c.start.column)) : c.start.row !== c.end.row && c.start.row < d ? (c.end.row == d && (e = Math.max(0, e - c.end.column) + c.start.column), d -= c.end.row - c.start.row) : c.end.row == d && (d -= c.end.row - c.start.row, e = Math.max(0, e - c.end.column) + c.start.column) : b.action == "removeLines" && c.start.row <= d && (c.end.row <= d ? d -= c.end.row - c.start.row : (d = c.start.row, e = 0)), this.setPosition(d, e, !0)
        }, this.setPosition = function (a, b, c) {
            var d;
            c ? d = {row: a, column: b} : d = this.$clipPositionToDocument(a, b);
            if (this.row == d.row && this.column == d.column)return;
            var e = {row: this.row, column: this.column};
            this.row = d.row, this.column = d.column, this._emit("change", {old: e, value: d})
        }, this.detach = function () {
            this.document.removeEventListener("change", this.$onChange)
        }, this.$clipPositionToDocument = function (a, b) {
            var c = {};
            return a >= this.document.getLength() ? (c.row = Math.max(0, this.document.getLength() - 1), c.column = this.document.getLine(c.row).length) : a < 0 ? (c.row = 0, c.column = 0) : (c.row = a, c.column = Math.min(this.document.getLine(c.row).length, Math.max(0, b))), b < 0 && (c.column = 0), c
        }
    }).call(f.prototype)
}), define("ace/lib/lang", ["require", "exports", "module"], function (a, b, c) {
    b.stringReverse = function (a) {
        return a.split("").reverse().join("")
    }, b.stringRepeat = function (a, b) {
        return (new Array(b + 1)).join(a)
    };
    var d = /^\s\s*/, e = /\s\s*$/;
    b.stringTrimLeft = function (a) {
        return a.replace(d, "")
    }, b.stringTrimRight = function (a) {
        return a.replace(e, "")
    }, b.copyObject = function (a) {
        var b = {};
        for (var c in a)b[c] = a[c];
        return b
    }, b.copyArray = function (a) {
        var b = [];
        for (var c = 0, d = a.length; c < d; c++)a[c] && typeof a[c] == "object" ? b[c] = this.copyObject(a[c]) : b[c] = a[c];
        return b
    }, b.deepCopy = function (a) {
        if (typeof a != "object")return a;
        var b = a.constructor();
        for (var c in a)typeof a[c] == "object" ? b[c] = this.deepCopy(a[c]) : b[c] = a[c];
        return b
    }, b.arrayToMap = function (a) {
        var b = {};
        for (var c = 0; c < a.length; c++)b[a[c]] = 1;
        return b
    }, b.createMap = function (a) {
        var b = Object.create(null);
        for (var c in a)b[c] = a[c];
        return b
    }, b.arrayRemove = function (a, b) {
        for (var c = 0; c <= a.length; c++)b === a[c] && a.splice(c, 1)
    }, b.escapeRegExp = function (a) {
        return a.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
    }, b.getMatchOffsets = function (a, b) {
        var c = [];
        return a.replace(b, function (a) {
            c.push({offset: arguments[arguments.length - 2], length: a.length})
        }), c
    }, b.deferredCall = function (a) {
        var b = null, c = function () {
            b = null, a()
        }, d = function (a) {
            return d.cancel(), b = setTimeout(c, a || 0), d
        };
        return d.schedule = d, d.call = function () {
            return this.cancel(), a(), d
        }, d.cancel = function () {
            return clearTimeout(b), b = null, d
        }, d
    }
}), define("ace/mode/css/csslint", ["require", "exports", "module"], function (require, exports, module) {
    function Reporter(a, b) {
        this.messages = [], this.stats = [], this.lines = a, this.ruleset = b
    }

    var parserlib = {};
    (function () {
        function a() {
            this._listeners = {}
        }

        function b(a) {
            this._input = a.replace(/\n\r?/g, "\n"), this._line = 1, this._col = 1, this._cursor = 0
        }

        function c(a, b, c) {
            this.col = c, this.line = b, this.message = a
        }

        function d(a, b, c, d) {
            this.col = c, this.line = b, this.text = a, this.type = d
        }

        function e(a, c) {
            this._reader = a ? new b(a.toString()) : null, this._token = null, this._tokenData = c, this._lt = [], this._ltIndex = 0, this._ltIndexCache = []
        }

        a.prototype = {
            constructor: a, addListener: function (a, b) {
                this._listeners[a] || (this._listeners[a] = []), this._listeners[a].push(b)
            }, fire: function (a) {
                typeof a == "string" && (a = {type: a}), typeof a.target != "undefined" && (a.target = this);
                if (typeof a.type == "undefined")throw new Error("Event object missing 'type' property.");
                if (this._listeners[a.type]) {
                    var b = this._listeners[a.type].concat();
                    for (var c = 0, d = b.length; c < d; c++)b[c].call(this, a)
                }
            }, removeListener: function (a, b) {
                if (this._listeners[a]) {
                    var c = this._listeners[a];
                    for (var d = 0, e = c.length; d < e; d++)if (c[d] === b) {
                        c.splice(d, 1);
                        break
                    }
                }
            }
        }, b.prototype = {
            constructor: b, getCol: function () {
                return this._col
            }, getLine: function () {
                return this._line
            }, eof: function () {
                return this._cursor == this._input.length
            }, peek: function (a) {
                var b = null;
                return a = typeof a == "undefined" ? 1 : a, this._cursor < this._input.length && (b = this._input.charAt(this._cursor + a - 1)), b
            }, read: function () {
                var a = null;
                return this._cursor < this._input.length && (this._input.charAt(this._cursor) == "\n" ? (this._line++, this._col = 1) : this._col++, a = this._input.charAt(this._cursor++)), a
            }, mark: function () {
                this._bookmark = {cursor: this._cursor, line: this._line, col: this._col}
            }, reset: function () {
                this._bookmark && (this._cursor = this._bookmark.cursor, this._line = this._bookmark.line, this._col = this._bookmark.col, delete this._bookmark)
            }, readTo: function (a) {
                var b = "", c;
                while (b.length < a.length || b.lastIndexOf(a) != b.length - a.length) {
                    c = this.read();
                    if (!c)throw new Error('Expected "' + a + '" at line ' + this._line + ", col " + this._col + ".");
                    b += c
                }
                return b
            }, readWhile: function (a) {
                var b = "", c = this.read();
                while (c !== null && a(c))b += c, c = this.read();
                return b
            }, readMatch: function (a) {
                var b = this._input.substring(this._cursor), c = null;
                return typeof a == "string" ? b.indexOf(a) === 0 && (c = this.readCount(a.length)) : a instanceof RegExp && a.test(b) && (c = this.readCount(RegExp.lastMatch.length)), c
            }, readCount: function (a) {
                var b = "";
                while (a--)b += this.read();
                return b
            }
        }, c.prototype = new Error, d.fromToken = function (a) {
            return new d(a.value, a.startLine, a.startCol)
        }, d.prototype = {
            constructor: d, valueOf: function () {
                return this.toString()
            }, toString: function () {
                return this.text
            }
        }, e.createTokenData = function (a) {
            var b = [], c = {}, d = a.concat([]), e = 0, f = d.length + 1;
            d.UNKNOWN = -1, d.unshift({name: "EOF"});
            for (; e < f; e++)b.push(d[e].name), d[d[e].name] = e, d[e].text && (c[d[e].text] = e);
            return d.name = function (a) {
                return b[a]
            }, d.type = function (a) {
                return c[a]
            }, d
        }, e.prototype = {
            constructor: e, match: function (a, b) {
                a instanceof Array || (a = [a]);
                var c = this.get(b), d = 0, e = a.length;
                while (d < e)if (c == a[d++])return !0;
                return this.unget(), !1
            }, mustMatch: function (a, b) {
                var d;
                a instanceof Array || (a = [a]);
                if (!this.match.apply(this, arguments))throw d = this.LT(1), new c("Expected " + this._tokenData[a[0]].name + " at line " + d.startLine + ", col " + d.startCol + ".", d.startLine, d.startCol)
            }, advance: function (a, b) {
                while (this.LA(0) !== 0 && !this.match(a, b))this.get();
                return this.LA(0)
            }, get: function (a) {
                var b = this._tokenData, c = this._reader, d, e = 0, f = b.length, g = !1, h, i;
                if (this._lt.length && this._ltIndex >= 0 && this._ltIndex < this._lt.length) {
                    e++, this._token = this._lt[this._ltIndex++], i = b[this._token.type];
                    while (i.channel !== undefined && a !== i.channel && this._ltIndex < this._lt.length)this._token = this._lt[this._ltIndex++], i = b[this._token.type], e++;
                    if ((i.channel === undefined || a === i.channel) && this._ltIndex <= this._lt.length)return this._ltIndexCache.push(e), this._token.type
                }
                return h = this._getToken(), h.type > -1 && !b[h.type].hide && (h.channel = b[h.type].channel, this._token = h, this._lt.push(h), this._ltIndexCache.push(this._lt.length - this._ltIndex + e), this._lt.length > 5 && this._lt.shift(), this._ltIndexCache.length > 5 && this._ltIndexCache.shift(), this._ltIndex = this._lt.length), i = b[h.type], i && (i.hide || i.channel !== undefined && a !== i.channel) ? this.get(a) : h.type
            }, LA: function (a) {
                var b = a, c;
                if (a > 0) {
                    if (a > 5)throw new Error("Too much lookahead.");
                    while (b)c = this.get(), b--;
                    while (b < a)this.unget(), b++
                } else if (a < 0) {
                    if (!this._lt[this._ltIndex + a])throw new Error("Too much lookbehind.");
                    c = this._lt[this._ltIndex + a].type
                } else c = this._token.type;
                return c
            }, LT: function (a) {
                return this.LA(a), this._lt[this._ltIndex + a - 1]
            }, peek: function () {
                return this.LA(1)
            }, token: function () {
                return this._token
            }, tokenName: function (a) {
                return a < 0 || a > this._tokenData.length ? "UNKNOWN_TOKEN" : this._tokenData[a].name
            }, tokenType: function (a) {
                return this._tokenData[a] || -1
            }, unget: function () {
                if (!this._ltIndexCache.length)throw new Error("Too much lookahead.");
                this._ltIndex -= this._ltIndexCache.pop(), this._token = this._lt[this._ltIndex - 1]
            }
        }, parserlib.util = {StringReader: b, SyntaxError: c, SyntaxUnit: d, EventTarget: a, TokenStreamBase: e}
    })(), function () {
        function Combinator(a, b, c) {
            SyntaxUnit.call(this, a, b, c, Parser.COMBINATOR_TYPE), this.type = "unknown", /^\s+$/.test(a) ? this.type = "descendant" : a == ">" ? this.type = "child" : a == "+" ? this.type = "adjacent-sibling" : a == "~" && (this.type = "sibling")
        }

        function MediaFeature(a, b) {
            SyntaxUnit.call(this, "(" + a + (b !== null ? ":" + b : "") + ")", a.startLine, a.startCol, Parser.MEDIA_FEATURE_TYPE), this.name = a, this.value = b
        }

        function MediaQuery(a, b, c, d, e) {
            SyntaxUnit.call(this, (a ? a + " " : "") + (b ? b + " " : "") + c.join(" and "), d, e, Parser.MEDIA_QUERY_TYPE), this.modifier = a, this.mediaType = b, this.features = c
        }

        function Parser(a) {
            EventTarget.call(this), this.options = a || {}, this._tokenStream = null
        }

        function PropertyName(a, b, c, d) {
            SyntaxUnit.call(this, a, c, d, Parser.PROPERTY_NAME_TYPE), this.hack = b
        }

        function PropertyValue(a, b, c) {
            SyntaxUnit.call(this, a.join(" "), b, c, Parser.PROPERTY_VALUE_TYPE), this.parts = a
        }

        function PropertyValueIterator(a) {
            this._i = 0, this._parts = a.parts, this._marks = [], this.value = a
        }

        function PropertyValuePart(text, line, col) {
            SyntaxUnit.call(this, text, line, col, Parser.PROPERTY_VALUE_PART_TYPE), this.type = "unknown";
            var temp;
            if (/^([+\-]?[\d\.]+)([a-z]+)$/i.test(text)) {
                this.type = "dimension", this.value = +RegExp.$1, this.units = RegExp.$2;
                switch (this.units.toLowerCase()) {
                    case"em":
                    case"rem":
                    case"ex":
                    case"px":
                    case"cm":
                    case"mm":
                    case"in":
                    case"pt":
                    case"pc":
                    case"ch":
                        this.type = "length";
                        break;
                    case"deg":
                    case"rad":
                    case"grad":
                        this.type = "angle";
                        break;
                    case"ms":
                    case"s":
                        this.type = "time";
                        break;
                    case"hz":
                    case"khz":
                        this.type = "frequency";
                        break;
                    case"dpi":
                    case"dpcm":
                        this.type = "resolution"
                }
            } else/^([+\-]?[\d\.]+)%$/i.test(text) ? (this.type = "percentage", this.value = +RegExp.$1) : /^([+\-]?[\d\.]+)%$/i.test(text) ? (this.type = "percentage", this.value = +RegExp.$1) : /^([+\-]?\d+)$/i.test(text) ? (this.type = "integer", this.value = +RegExp.$1) : /^([+\-]?[\d\.]+)$/i.test(text) ? (this.type = "number", this.value = +RegExp.$1) : /^#([a-f0-9]{3,6})/i.test(text) ? (this.type = "color", temp = RegExp.$1, temp.length == 3 ? (this.red = parseInt(temp.charAt(0) + temp.charAt(0), 16), this.green = parseInt(temp.charAt(1) + temp.charAt(1), 16), this.blue = parseInt(temp.charAt(2) + temp.charAt(2), 16)) : (this.red = parseInt(temp.substring(0, 2), 16), this.green = parseInt(temp.substring(2, 4), 16), this.blue = parseInt(temp.substring(4, 6), 16))) : /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i.test(text) ? (this.type = "color", this.red = +RegExp.$1, this.green = +RegExp.$2, this.blue = +RegExp.$3) : /^rgb\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i.test(text) ? (this.type = "color", this.red = +RegExp.$1 * 255 / 100, this.green = +RegExp.$2 * 255 / 100, this.blue = +RegExp.$3 * 255 / 100) : /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/i.test(text) ? (this.type = "color", this.red = +RegExp.$1, this.green = +RegExp.$2, this.blue = +RegExp.$3, this.alpha = +RegExp.$4) : /^rgba\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d\.]+)\s*\)/i.test(text) ? (this.type = "color", this.red = +RegExp.$1 * 255 / 100, this.green = +RegExp.$2 * 255 / 100, this.blue = +RegExp.$3 * 255 / 100, this.alpha = +RegExp.$4) : /^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i.test(text) ? (this.type = "color", this.hue = +RegExp.$1, this.saturation = +RegExp.$2 / 100, this.lightness = +RegExp.$3 / 100) : /^hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d\.]+)\s*\)/i.test(text) ? (this.type = "color", this.hue = +RegExp.$1, this.saturation = +RegExp.$2 / 100, this.lightness = +RegExp.$3 / 100, this.alpha = +RegExp.$4) : /^url\(["']?([^\)"']+)["']?\)/i.test(text) ? (this.type = "uri", this.uri = RegExp.$1) : /^([^\(]+)\(/i.test(text) ? (this.type = "function", this.name = RegExp.$1, this.value = text) : /^["'][^"']*["']/.test(text) ? (this.type = "string", this.value = eval(text)) : Colors[text.toLowerCase()] ? (this.type = "color", temp = Colors[text.toLowerCase()].substring(1), this.red = parseInt(temp.substring(0, 2), 16), this.green = parseInt(temp.substring(2, 4), 16), this.blue = parseInt(temp.substring(4, 6), 16)) : /^[\,\/]$/.test(text) ? (this.type = "operator", this.value = text) : /^[a-z\-\u0080-\uFFFF][a-z0-9\-\u0080-\uFFFF]*$/i.test(text) && (this.type = "identifier", this.value = text)
        }

        function Selector(a, b, c) {
            SyntaxUnit.call(this, a.join(" "), b, c, Parser.SELECTOR_TYPE), this.parts = a, this.specificity = Specificity.calculate(this)
        }

        function SelectorPart(a, b, c, d, e) {
            SyntaxUnit.call(this, c, d, e, Parser.SELECTOR_PART_TYPE), this.elementName = a, this.modifiers = b
        }

        function SelectorSubPart(a, b, c, d) {
            SyntaxUnit.call(this, a, c, d, Parser.SELECTOR_SUB_PART_TYPE), this.type = b, this.args = []
        }

        function Specificity(a, b, c, d) {
            this.a = a, this.b = b, this.c = c, this.d = d
        }

        function isHexDigit(a) {
            return a !== null && h.test(a)
        }

        function isDigit(a) {
            return a !== null && /\d/.test(a)
        }

        function isWhitespace(a) {
            return a !== null && /\s/.test(a)
        }

        function isNewLine(a) {
            return a !== null && nl.test(a)
        }

        function isNameStart(a) {
            return a !== null && /[a-z_\u0080-\uFFFF\\]/i.test(a)
        }

        function isNameChar(a) {
            return a !== null && (isNameStart(a) || /[0-9\-\\]/.test(a))
        }

        function isIdentStart(a) {
            return a !== null && (isNameStart(a) || /\-\\/.test(a))
        }

        function mix(a, b) {
            for (var c in b)b.hasOwnProperty(c) && (a[c] = b[c]);
            return a
        }

        function TokenStream(a) {
            TokenStreamBase.call(this, a, Tokens)
        }

        function ValidationError(a, b, c) {
            this.col = c, this.line = b, this.message = a
        }

        var EventTarget = parserlib.util.EventTarget, TokenStreamBase = parserlib.util.TokenStreamBase, StringReader = parserlib.util.StringReader, SyntaxError = parserlib.util.SyntaxError, SyntaxUnit = parserlib.util.SyntaxUnit, Colors = {
            aliceblue: "#f0f8ff",
            antiquewhite: "#faebd7",
            aqua: "#00ffff",
            aquamarine: "#7fffd4",
            azure: "#f0ffff",
            beige: "#f5f5dc",
            bisque: "#ffe4c4",
            black: "#000000",
            blanchedalmond: "#ffebcd",
            blue: "#0000ff",
            blueviolet: "#8a2be2",
            brown: "#a52a2a",
            burlywood: "#deb887",
            cadetblue: "#5f9ea0",
            chartreuse: "#7fff00",
            chocolate: "#d2691e",
            coral: "#ff7f50",
            cornflowerblue: "#6495ed",
            cornsilk: "#fff8dc",
            crimson: "#dc143c",
            cyan: "#00ffff",
            darkblue: "#00008b",
            darkcyan: "#008b8b",
            darkgoldenrod: "#b8860b",
            darkgray: "#a9a9a9",
            darkgreen: "#006400",
            darkkhaki: "#bdb76b",
            darkmagenta: "#8b008b",
            darkolivegreen: "#556b2f",
            darkorange: "#ff8c00",
            darkorchid: "#9932cc",
            darkred: "#8b0000",
            darksalmon: "#e9967a",
            darkseagreen: "#8fbc8f",
            darkslateblue: "#483d8b",
            darkslategray: "#2f4f4f",
            darkturquoise: "#00ced1",
            darkviolet: "#9400d3",
            deeppink: "#ff1493",
            deepskyblue: "#00bfff",
            dimgray: "#696969",
            dodgerblue: "#1e90ff",
            firebrick: "#b22222",
            floralwhite: "#fffaf0",
            forestgreen: "#228b22",
            fuchsia: "#ff00ff",
            gainsboro: "#dcdcdc",
            ghostwhite: "#f8f8ff",
            gold: "#ffd700",
            goldenrod: "#daa520",
            gray: "#808080",
            green: "#008000",
            greenyellow: "#adff2f",
            honeydew: "#f0fff0",
            hotpink: "#ff69b4",
            indianred: "#cd5c5c",
            indigo: "#4b0082",
            ivory: "#fffff0",
            khaki: "#f0e68c",
            lavender: "#e6e6fa",
            lavenderblush: "#fff0f5",
            lawngreen: "#7cfc00",
            lemonchiffon: "#fffacd",
            lightblue: "#add8e6",
            lightcoral: "#f08080",
            lightcyan: "#e0ffff",
            lightgoldenrodyellow: "#fafad2",
            lightgray: "#d3d3d3",
            lightgreen: "#90ee90",
            lightpink: "#ffb6c1",
            lightsalmon: "#ffa07a",
            lightseagreen: "#20b2aa",
            lightskyblue: "#87cefa",
            lightslategray: "#778899",
            lightsteelblue: "#b0c4de",
            lightyellow: "#ffffe0",
            lime: "#00ff00",
            limegreen: "#32cd32",
            linen: "#faf0e6",
            magenta: "#ff00ff",
            maroon: "#800000",
            mediumaquamarine: "#66cdaa",
            mediumblue: "#0000cd",
            mediumorchid: "#ba55d3",
            mediumpurple: "#9370d8",
            mediumseagreen: "#3cb371",
            mediumslateblue: "#7b68ee",
            mediumspringgreen: "#00fa9a",
            mediumturquoise: "#48d1cc",
            mediumvioletred: "#c71585",
            midnightblue: "#191970",
            mintcream: "#f5fffa",
            mistyrose: "#ffe4e1",
            moccasin: "#ffe4b5",
            navajowhite: "#ffdead",
            navy: "#000080",
            oldlace: "#fdf5e6",
            olive: "#808000",
            olivedrab: "#6b8e23",
            orange: "#ffa500",
            orangered: "#ff4500",
            orchid: "#da70d6",
            palegoldenrod: "#eee8aa",
            palegreen: "#98fb98",
            paleturquoise: "#afeeee",
            palevioletred: "#d87093",
            papayawhip: "#ffefd5",
            peachpuff: "#ffdab9",
            peru: "#cd853f",
            pink: "#ffc0cb",
            plum: "#dda0dd",
            powderblue: "#b0e0e6",
            purple: "#800080",
            red: "#ff0000",
            rosybrown: "#bc8f8f",
            royalblue: "#4169e1",
            saddlebrown: "#8b4513",
            salmon: "#fa8072",
            sandybrown: "#f4a460",
            seagreen: "#2e8b57",
            seashell: "#fff5ee",
            sienna: "#a0522d",
            silver: "#c0c0c0",
            skyblue: "#87ceeb",
            slateblue: "#6a5acd",
            slategray: "#708090",
            snow: "#fffafa",
            springgreen: "#00ff7f",
            steelblue: "#4682b4",
            tan: "#d2b48c",
            teal: "#008080",
            thistle: "#d8bfd8",
            tomato: "#ff6347",
            turquoise: "#40e0d0",
            violet: "#ee82ee",
            wheat: "#f5deb3",
            white: "#ffffff",
            whitesmoke: "#f5f5f5",
            yellow: "#ffff00",
            yellowgreen: "#9acd32"
        };
        Combinator.prototype = new SyntaxUnit, Combinator.prototype.constructor = Combinator, MediaFeature.prototype = new SyntaxUnit, MediaFeature.prototype.constructor = MediaFeature, MediaQuery.prototype = new SyntaxUnit, MediaQuery.prototype.constructor = MediaQuery, Parser.DEFAULT_TYPE = 0, Parser.COMBINATOR_TYPE = 1, Parser.MEDIA_FEATURE_TYPE = 2, Parser.MEDIA_QUERY_TYPE = 3, Parser.PROPERTY_NAME_TYPE = 4, Parser.PROPERTY_VALUE_TYPE = 5, Parser.PROPERTY_VALUE_PART_TYPE = 6, Parser.SELECTOR_TYPE = 7, Parser.SELECTOR_PART_TYPE = 8, Parser.SELECTOR_SUB_PART_TYPE = 9, Parser.prototype = function () {
            var a = new EventTarget, b, c = {
                constructor: Parser,
                DEFAULT_TYPE: 0,
                COMBINATOR_TYPE: 1,
                MEDIA_FEATURE_TYPE: 2,
                MEDIA_QUERY_TYPE: 3,
                PROPERTY_NAME_TYPE: 4,
                PROPERTY_VALUE_TYPE: 5,
                PROPERTY_VALUE_PART_TYPE: 6,
                SELECTOR_TYPE: 7,
                SELECTOR_PART_TYPE: 8,
                SELECTOR_SUB_PART_TYPE: 9,
                _stylesheet: function () {
                    var a = this._tokenStream, b = null, c, d, e;
                    this.fire("startstylesheet"), this._charset(), this._skipCruft();
                    while (a.peek() == Tokens.IMPORT_SYM)this._import(), this._skipCruft();
                    while (a.peek() == Tokens.NAMESPACE_SYM)this._namespace(), this._skipCruft();
                    e = a.peek();
                    while (e > Tokens.EOF) {
                        try {
                            switch (e) {
                                case Tokens.MEDIA_SYM:
                                    this._media(), this._skipCruft();
                                    break;
                                case Tokens.PAGE_SYM:
                                    this._page(), this._skipCruft();
                                    break;
                                case Tokens.FONT_FACE_SYM:
                                    this._font_face(), this._skipCruft();
                                    break;
                                case Tokens.KEYFRAMES_SYM:
                                    this._keyframes(), this._skipCruft();
                                    break;
                                case Tokens.UNKNOWN_SYM:
                                    a.get();
                                    if (!!this.options.strict)throw new SyntaxError("Unknown @ rule.", a.LT(0).startLine, a.LT(0).startCol);
                                    this.fire({
                                        type: "error",
                                        error: null,
                                        message: "Unknown @ rule: " + a.LT(0).value + ".",
                                        line: a.LT(0).startLine,
                                        col: a.LT(0).startCol
                                    }), c = 0;
                                    while (a.advance([Tokens.LBRACE, Tokens.RBRACE]) == Tokens.LBRACE)c++;
                                    while (c)a.advance([Tokens.RBRACE]), c--;
                                    break;
                                case Tokens.S:
                                    this._readWhitespace();
                                    break;
                                default:
                                    if (!this._ruleset())switch (e) {
                                        case Tokens.CHARSET_SYM:
                                            throw d = a.LT(1), this._charset(!1), new SyntaxError("@charset not allowed here.", d.startLine, d.startCol);
                                        case Tokens.IMPORT_SYM:
                                            throw d = a.LT(1), this._import(!1), new SyntaxError("@import not allowed here.", d.startLine, d.startCol);
                                        case Tokens.NAMESPACE_SYM:
                                            throw d = a.LT(1), this._namespace(!1), new SyntaxError("@namespace not allowed here.", d.startLine, d.startCol);
                                        default:
                                            a.get(), this._unexpectedToken(a.token())
                                    }
                            }
                        } catch (f) {
                            if (!(f instanceof SyntaxError && !this.options.strict))throw f;
                            this.fire({type: "error", error: f, message: f.message, line: f.line, col: f.col})
                        }
                        e = a.peek()
                    }
                    e != Tokens.EOF && this._unexpectedToken(a.token()), this.fire("endstylesheet")
                },
                _charset: function (a) {
                    var b = this._tokenStream, c, d, e, f;
                    b.match(Tokens.CHARSET_SYM) && (e = b.token().startLine, f = b.token().startCol, this._readWhitespace(), b.mustMatch(Tokens.STRING), d = b.token(), c = d.value, this._readWhitespace(), b.mustMatch(Tokens.SEMICOLON), a !== !1 && this.fire({
                        type: "charset",
                        charset: c,
                        line: e,
                        col: f
                    }))
                },
                _import: function (a) {
                    var b = this._tokenStream, c, d, e, f = [];
                    b.mustMatch(Tokens.IMPORT_SYM), e = b.token(), this._readWhitespace(), b.mustMatch([Tokens.STRING, Tokens.URI]), d = b.token().value.replace(/(?:url\()?["']([^"']+)["']\)?/, "$1"), this._readWhitespace(), f = this._media_query_list(), b.mustMatch(Tokens.SEMICOLON), this._readWhitespace(), a !== !1 && this.fire({
                        type: "import",
                        uri: d,
                        media: f,
                        line: e.startLine,
                        col: e.startCol
                    })
                },
                _namespace: function (a) {
                    var b = this._tokenStream, c, d, e, f;
                    b.mustMatch(Tokens.NAMESPACE_SYM), c = b.token().startLine, d = b.token().startCol, this._readWhitespace(), b.match(Tokens.IDENT) && (e = b.token().value, this._readWhitespace()), b.mustMatch([Tokens.STRING, Tokens.URI]), f = b.token().value.replace(/(?:url\()?["']([^"']+)["']\)?/, "$1"), this._readWhitespace(), b.mustMatch(Tokens.SEMICOLON), this._readWhitespace(), a !== !1 && this.fire({
                        type: "namespace",
                        prefix: e,
                        uri: f,
                        line: c,
                        col: d
                    })
                },
                _media: function () {
                    var a = this._tokenStream, b, c, d;
                    a.mustMatch(Tokens.MEDIA_SYM), b = a.token().startLine, c = a.token().startCol, this._readWhitespace(), d = this._media_query_list(), a.mustMatch(Tokens.LBRACE), this._readWhitespace(), this.fire({
                        type: "startmedia",
                        media: d,
                        line: b,
                        col: c
                    });
                    for (; ;)if (a.peek() == Tokens.PAGE_SYM)this._page(); else if (!this._ruleset())break;
                    a.mustMatch(Tokens.RBRACE), this._readWhitespace(), this.fire({
                        type: "endmedia",
                        media: d,
                        line: b,
                        col: c
                    })
                },
                _media_query_list: function () {
                    var a = this._tokenStream, b = [];
                    this._readWhitespace(), (a.peek() == Tokens.IDENT || a.peek() == Tokens.LPAREN) && b.push(this._media_query());
                    while (a.match(Tokens.COMMA))this._readWhitespace(), b.push(this._media_query());
                    return b
                },
                _media_query: function () {
                    var a = this._tokenStream, b = null, c = null, d = null, e = [];
                    a.match(Tokens.IDENT) && (c = a.token().value.toLowerCase(), c != "only" && c != "not" ? (a.unget(), c = null) : d = a.token()), this._readWhitespace(), a.peek() == Tokens.IDENT ? (b = this._media_type(), d === null && (d = a.token())) : a.peek() == Tokens.LPAREN && (d === null && (d = a.LT(1)), e.push(this._media_expression()));
                    if (b === null && e.length === 0)return null;
                    this._readWhitespace();
                    while (a.match(Tokens.IDENT))a.token().value.toLowerCase() != "and" && this._unexpectedToken(a.token()), this._readWhitespace(), e.push(this._media_expression());
                    return new MediaQuery(c, b, e, d.startLine, d.startCol)
                },
                _media_type: function () {
                    return this._media_feature()
                },
                _media_expression: function () {
                    var a = this._tokenStream, b = null, c, d = null;
                    return a.mustMatch(Tokens.LPAREN), b = this._media_feature(), this._readWhitespace(), a.match(Tokens.COLON) && (this._readWhitespace(), c = a.LT(1), d = this._expression()), a.mustMatch(Tokens.RPAREN), this._readWhitespace(), new MediaFeature(b, d ? new SyntaxUnit(d, c.startLine, c.startCol) : null)
                },
                _media_feature: function () {
                    var a = this._tokenStream;
                    return a.mustMatch(Tokens.IDENT), SyntaxUnit.fromToken(a.token())
                },
                _page: function () {
                    var a = this._tokenStream, b, c, d = null, e = null;
                    a.mustMatch(Tokens.PAGE_SYM), b = a.token().startLine, c = a.token().startCol, this._readWhitespace(), a.match(Tokens.IDENT) && (d = a.token().value, d.toLowerCase() === "auto" && this._unexpectedToken(a.token())), a.peek() == Tokens.COLON && (e = this._pseudo_page()), this._readWhitespace(), this.fire({
                        type: "startpage",
                        id: d,
                        pseudo: e,
                        line: b,
                        col: c
                    }), this._readDeclarations(!0, !0), this.fire({type: "endpage", id: d, pseudo: e, line: b, col: c})
                },
                _margin: function () {
                    var a = this._tokenStream, b, c, d = this._margin_sym();
                    return d ? (b = a.token().startLine, c = a.token().startCol, this.fire({
                        type: "startpagemargin",
                        margin: d,
                        line: b,
                        col: c
                    }), this._readDeclarations(!0), this.fire({
                        type: "endpagemargin",
                        margin: d,
                        line: b,
                        col: c
                    }), !0) : !1
                },
                _margin_sym: function () {
                    var a = this._tokenStream;
                    return a.match([Tokens.TOPLEFTCORNER_SYM, Tokens.TOPLEFT_SYM, Tokens.TOPCENTER_SYM, Tokens.TOPRIGHT_SYM, Tokens.TOPRIGHTCORNER_SYM, Tokens.BOTTOMLEFTCORNER_SYM, Tokens.BOTTOMLEFT_SYM, Tokens.BOTTOMCENTER_SYM, Tokens.BOTTOMRIGHT_SYM, Tokens.BOTTOMRIGHTCORNER_SYM, Tokens.LEFTTOP_SYM, Tokens.LEFTMIDDLE_SYM, Tokens.LEFTBOTTOM_SYM, Tokens.RIGHTTOP_SYM, Tokens.RIGHTMIDDLE_SYM, Tokens.RIGHTBOTTOM_SYM]) ? SyntaxUnit.fromToken(a.token()) : null
                },
                _pseudo_page: function () {
                    var a = this._tokenStream;
                    return a.mustMatch(Tokens.COLON), a.mustMatch(Tokens.IDENT), a.token().value
                },
                _font_face: function () {
                    var a = this._tokenStream, b, c;
                    a.mustMatch(Tokens.FONT_FACE_SYM), b = a.token().startLine, c = a.token().startCol, this._readWhitespace(), this.fire({
                        type: "startfontface",
                        line: b,
                        col: c
                    }), this._readDeclarations(!0), this.fire({type: "endfontface", line: b, col: c})
                },
                _operator: function () {
                    var a = this._tokenStream, b = null;
                    return a.match([Tokens.SLASH, Tokens.COMMA]) && (b = a.token(), this._readWhitespace()), b ? PropertyValuePart.fromToken(b) : null
                },
                _combinator: function () {
                    var a = this._tokenStream, b = null, c;
                    return a.match([Tokens.PLUS, Tokens.GREATER, Tokens.TILDE]) && (c = a.token(), b = new Combinator(c.value, c.startLine, c.startCol), this._readWhitespace()), b
                },
                _unary_operator: function () {
                    var a = this._tokenStream;
                    return a.match([Tokens.MINUS, Tokens.PLUS]) ? a.token().value : null
                },
                _property: function () {
                    var a = this._tokenStream, b = null, c = null, d, e, f, g;
                    return a.peek() == Tokens.STAR && this.options.starHack && (a.get(), e = a.token(), c = e.value, f = e.startLine, g = e.startCol), a.match(Tokens.IDENT) && (e = a.token(), d = e.value, d.charAt(0) == "_" && this.options.underscoreHack && (c = "_", d = d.substring(1)), b = new PropertyName(d, c, f || e.startLine, g || e.startCol), this._readWhitespace()), b
                },
                _ruleset: function () {
                    var a = this._tokenStream, b, c;
                    try {
                        c = this._selectors_group()
                    } catch (d) {
                        if (d instanceof SyntaxError && !this.options.strict) {
                            this.fire({
                                type: "error",
                                error: d,
                                message: d.message,
                                line: d.line,
                                col: d.col
                            }), b = a.advance([Tokens.RBRACE]);
                            if (b != Tokens.RBRACE)throw d;
                            return !0
                        }
                        throw d
                    }
                    return c && (this.fire({
                        type: "startrule",
                        selectors: c,
                        line: c[0].line,
                        col: c[0].col
                    }), this._readDeclarations(!0), this.fire({
                        type: "endrule",
                        selectors: c,
                        line: c[0].line,
                        col: c[0].col
                    })), c
                },
                _selectors_group: function () {
                    var a = this._tokenStream, b = [], c;
                    c = this._selector();
                    if (c !== null) {
                        b.push(c);
                        while (a.match(Tokens.COMMA))this._readWhitespace(), c = this._selector(), c !== null ? b.push(c) : this._unexpectedToken(a.LT(1))
                    }
                    return b.length ? b : null
                },
                _selector: function () {
                    var a = this._tokenStream, b = [], c = null, d = null, e = null;
                    c = this._simple_selector_sequence();
                    if (c === null)return null;
                    b.push(c);
                    do {
                        d = this._combinator();
                        if (d !== null)b.push(d), c = this._simple_selector_sequence(), c === null ? this._unexpectedToken(this.LT(1)) : b.push(c); else {
                            if (!this._readWhitespace())break;
                            e = new Combinator(a.token().value, a.token().startLine, a.token().startCol), d = this._combinator(), c = this._simple_selector_sequence(), c === null ? d !== null && this._unexpectedToken(a.LT(1)) : (d !== null ? b.push(d) : b.push(e), b.push(c))
                        }
                    } while (!0);
                    return new Selector(b, b[0].line, b[0].col)
                },
                _simple_selector_sequence: function () {
                    var a = this._tokenStream, b = null, c = [], d = "", e = [function () {
                        return a.match(Tokens.HASH) ? new SelectorSubPart(a.token().value, "id", a.token().startLine, a.token().startCol) : null
                    }, this._class, this._attrib, this._pseudo, this._negation], f = 0, g = e.length, h = null, i = !1, j, k;
                    j = a.LT(1).startLine, k = a.LT(1).startCol, b = this._type_selector(), b || (b = this._universal()), b !== null && (d += b);
                    for (; ;) {
                        if (a.peek() === Tokens.S)break;
                        while (f < g && h === null)h = e[f++].call(this);
                        if (h === null) {
                            if (d === "")return null;
                            break
                        }
                        f = 0, c.push(h), d += h.toString(), h = null
                    }
                    return d !== "" ? new SelectorPart(b, c, d, j, k) : null
                },
                _type_selector: function () {
                    var a = this._tokenStream, b = this._namespace_prefix(), c = this._element_name();
                    return c ? (b && (c.text = b + c.text, c.col -= b.length), c) : (b && (a.unget(), b.length > 1 && a.unget()), null)
                },
                _class: function () {
                    var a = this._tokenStream, b;
                    return a.match(Tokens.DOT) ? (a.mustMatch(Tokens.IDENT), b = a.token(), new SelectorSubPart("." + b.value, "class", b.startLine, b.startCol - 1)) : null
                },
                _element_name: function () {
                    var a = this._tokenStream, b;
                    return a.match(Tokens.IDENT) ? (b = a.token(), new SelectorSubPart(b.value, "elementName", b.startLine, b.startCol)) : null
                },
                _namespace_prefix: function () {
                    var a = this._tokenStream, b = "";
                    if (a.LA(1) === Tokens.PIPE || a.LA(2) === Tokens.PIPE)a.match([Tokens.IDENT, Tokens.STAR]) && (b += a.token().value), a.mustMatch(Tokens.PIPE), b += "|";
                    return b.length ? b : null
                },
                _universal: function () {
                    var a = this._tokenStream, b = "", c;
                    return c = this._namespace_prefix(), c && (b += c), a.match(Tokens.STAR) && (b += "*"), b.length ? b : null
                },
                _attrib: function () {
                    var a = this._tokenStream, b = null, c, d;
                    return a.match(Tokens.LBRACKET) ? (d = a.token(), b = d.value, b += this._readWhitespace(), c = this._namespace_prefix(), c && (b += c), a.mustMatch(Tokens.IDENT), b += a.token().value, b += this._readWhitespace(), a.match([Tokens.PREFIXMATCH, Tokens.SUFFIXMATCH, Tokens.SUBSTRINGMATCH, Tokens.EQUALS, Tokens.INCLUDES, Tokens.DASHMATCH]) && (b += a.token().value, b += this._readWhitespace(), a.mustMatch([Tokens.IDENT, Tokens.STRING]), b += a.token().value, b += this._readWhitespace()), a.mustMatch(Tokens.RBRACKET), new SelectorSubPart(b + "]", "attribute", d.startLine, d.startCol)) : null
                },
                _pseudo: function () {
                    var a = this._tokenStream, b = null, c = ":", d, e;
                    return a.match(Tokens.COLON) && (a.match(Tokens.COLON) && (c += ":"), a.match(Tokens.IDENT) ? (b = a.token().value, d = a.token().startLine, e = a.token().startCol - c.length) : a.peek() == Tokens.FUNCTION && (d = a.LT(1).startLine, e = a.LT(1).startCol - c.length, b = this._functional_pseudo()), b && (b = new SelectorSubPart(c + b, "pseudo", d, e))), b
                },
                _functional_pseudo: function () {
                    var a = this._tokenStream, b = null;
                    return a.match(Tokens.FUNCTION) && (b = a.token().value, b += this._readWhitespace(), b += this._expression(), a.mustMatch(Tokens.RPAREN), b += ")"), b
                },
                _expression: function () {
                    var a = this._tokenStream, b = "";
                    while (a.match([Tokens.PLUS, Tokens.MINUS, Tokens.DIMENSION, Tokens.NUMBER, Tokens.STRING, Tokens.IDENT, Tokens.LENGTH, Tokens.FREQ, Tokens.ANGLE, Tokens.TIME, Tokens.RESOLUTION]))b += a.token().value, b += this._readWhitespace();
                    return b.length ? b : null
                },
                _negation: function () {
                    var a = this._tokenStream, b, c, d = "", e, f = null;
                    return a.match(Tokens.NOT) && (d = a.token().value, b = a.token().startLine, c = a.token().startCol, d += this._readWhitespace(), e = this._negation_arg(), d += e, d += this._readWhitespace(), a.match(Tokens.RPAREN), d += a.token().value, f = new SelectorSubPart(d, "not", b, c), f.args.push(e)), f
                },
                _negation_arg: function () {
                    var a = this._tokenStream, b = [this._type_selector, this._universal, function () {
                        return a.match(Tokens.HASH) ? new SelectorSubPart(a.token().value, "id", a.token().startLine, a.token().startCol) : null
                    }, this._class, this._attrib, this._pseudo], c = null, d = 0, e = b.length, f, g, h, i;
                    g = a.LT(1).startLine, h = a.LT(1).startCol;
                    while (d < e && c === null)c = b[d].call(this), d++;
                    return c === null && this._unexpectedToken(a.LT(1)), c.type == "elementName" ? i = new SelectorPart(c, [], c.toString(), g, h) : i = new SelectorPart(null, [c], c.toString(), g, h), i
                },
                _declaration: function () {
                    var a = this._tokenStream, b = null, c = null, d = null, e = null, f = null;
                    b = this._property();
                    if (b !== null) {
                        a.mustMatch(Tokens.COLON), this._readWhitespace(), c = this._expr(), (!c || c.length === 0) && this._unexpectedToken(a.LT(1)), d = this._prio();
                        try {
                            this._validateProperty(b, c)
                        } catch (g) {
                            f = g
                        }
                        return this.fire({
                            type: "property",
                            property: b,
                            value: c,
                            important: d,
                            line: b.line,
                            col: b.col,
                            invalid: f
                        }), !0
                    }
                    return !1
                },
                _prio: function () {
                    var a = this._tokenStream, b = a.match(Tokens.IMPORTANT_SYM);
                    return this._readWhitespace(), b
                },
                _expr: function () {
                    var a = this._tokenStream, b = [], c = null, d = null;
                    c = this._term();
                    if (c !== null) {
                        b.push(c);
                        do {
                            d = this._operator(), d && b.push(d), c = this._term();
                            if (c === null)break;
                            b.push(c)
                        } while (!0)
                    }
                    return b.length > 0 ? new PropertyValue(b, b[0].line, b[0].col) : null
                },
                _term: function () {
                    var a = this._tokenStream, b = null, c = null, d, e, f;
                    return b = this._unary_operator(), b !== null && (e = a.token().startLine, f = a.token().startCol), a.peek() == Tokens.IE_FUNCTION && this.options.ieFilters ? (c = this._ie_function(), b === null && (e = a.token().startLine, f = a.token().startCol)) : a.match([Tokens.NUMBER, Tokens.PERCENTAGE, Tokens.LENGTH, Tokens.ANGLE, Tokens.TIME, Tokens.FREQ, Tokens.STRING, Tokens.IDENT, Tokens.URI, Tokens.UNICODE_RANGE]) ? (c = a.token().value, b === null && (e = a.token().startLine, f = a.token().startCol), this._readWhitespace()) : (d = this._hexcolor(), d === null ? (b === null && (e = a.LT(1).startLine, f = a.LT(1).startCol), c === null && (a.LA(3) == Tokens.EQUALS && this.options.ieFilters ? c = this._ie_function() : c = this._function())) : (c = d.value, b === null && (e = d.startLine, f = d.startCol))), c !== null ? new PropertyValuePart(b !== null ? b + c : c, e, f) : null
                },
                _function: function () {
                    var a = this._tokenStream, b = null, c = null, d;
                    if (a.match(Tokens.FUNCTION)) {
                        b = a.token().value, this._readWhitespace(), c = this._expr(), b += c;
                        if (this.options.ieFilters && a.peek() == Tokens.EQUALS)do {
                            this._readWhitespace() && (b += a.token().value), a.LA(0) == Tokens.COMMA && (b += a.token().value), a.match(Tokens.IDENT), b += a.token().value, a.match(Tokens.EQUALS), b += a.token().value, d = a.peek();
                            while (d != Tokens.COMMA && d != Tokens.S && d != Tokens.RPAREN)a.get(), b += a.token().value, d = a.peek()
                        } while (a.match([Tokens.COMMA, Tokens.S]));
                        a.match(Tokens.RPAREN), b += ")", this._readWhitespace()
                    }
                    return b
                },
                _ie_function: function () {
                    var a = this._tokenStream, b = null, c = null, d;
                    if (a.match([Tokens.IE_FUNCTION, Tokens.FUNCTION])) {
                        b = a.token().value;
                        do {
                            this._readWhitespace() && (b += a.token().value), a.LA(0) == Tokens.COMMA && (b += a.token().value), a.match(Tokens.IDENT), b += a.token().value, a.match(Tokens.EQUALS), b += a.token().value, d = a.peek();
                            while (d != Tokens.COMMA && d != Tokens.S && d != Tokens.RPAREN)a.get(), b += a.token().value, d = a.peek()
                        } while (a.match([Tokens.COMMA, Tokens.S]));
                        a.match(Tokens.RPAREN), b += ")", this._readWhitespace()
                    }
                    return b
                },
                _hexcolor: function () {
                    var a = this._tokenStream, b = null, c;
                    if (a.match(Tokens.HASH)) {
                        b = a.token(), c = b.value;
                        if (!/#[a-f0-9]{3,6}/i.test(c))throw new SyntaxError("Expected a hex color but found '" + c + "' at line " + b.startLine + ", col " + b.startCol + ".", b.startLine, b.startCol);
                        this._readWhitespace()
                    }
                    return b
                },
                _keyframes: function () {
                    var a = this._tokenStream, b, c, d;
                    a.mustMatch(Tokens.KEYFRAMES_SYM), this._readWhitespace(), d = this._keyframe_name(), this._readWhitespace(), a.mustMatch(Tokens.LBRACE), this.fire({
                        type: "startkeyframes",
                        name: d,
                        line: d.line,
                        col: d.col
                    }), this._readWhitespace(), c = a.peek();
                    while (c == Tokens.IDENT || c == Tokens.PERCENTAGE)this._keyframe_rule(), this._readWhitespace(), c = a.peek();
                    this.fire({
                        type: "endkeyframes",
                        name: d,
                        line: d.line,
                        col: d.col
                    }), this._readWhitespace(), a.mustMatch(Tokens.RBRACE)
                },
                _keyframe_name: function () {
                    var a = this._tokenStream, b;
                    return a.mustMatch([Tokens.IDENT, Tokens.STRING]), SyntaxUnit.fromToken(a.token())
                },
                _keyframe_rule: function () {
                    var a = this._tokenStream, b, c = this._key_list();
                    this.fire({
                        type: "startkeyframerule",
                        keys: c,
                        line: c[0].line,
                        col: c[0].col
                    }), this._readDeclarations(!0), this.fire({
                        type: "endkeyframerule",
                        keys: c,
                        line: c[0].line,
                        col: c[0].col
                    })
                },
                _key_list: function () {
                    var a = this._tokenStream, b, c, d = [];
                    d.push(this._key()), this._readWhitespace();
                    while (a.match(Tokens.COMMA))this._readWhitespace(), d.push(this._key()), this._readWhitespace();
                    return d
                },
                _key: function () {
                    var a = this._tokenStream, b;
                    if (a.match(Tokens.PERCENTAGE))return SyntaxUnit.fromToken(a.token());
                    if (a.match(Tokens.IDENT)) {
                        b = a.token();
                        if (/from|to/i.test(b.value))return SyntaxUnit.fromToken(b);
                        a.unget()
                    }
                    this._unexpectedToken(a.LT(1))
                },
                _skipCruft: function () {
                    while (this._tokenStream.match([Tokens.S, Tokens.CDO, Tokens.CDC]));
                },
                _readDeclarations: function (a, b) {
                    var c = this._tokenStream, d;
                    this._readWhitespace(), a && c.mustMatch(Tokens.LBRACE), this._readWhitespace();
                    try {
                        for (; ;) {
                            if (!(c.match(Tokens.SEMICOLON) || b && this._margin())) {
                                if (!this._declaration())break;
                                if (!c.match(Tokens.SEMICOLON))break
                            }
                            this._readWhitespace()
                        }
                        c.mustMatch(Tokens.RBRACE), this._readWhitespace()
                    } catch (e) {
                        if (!(e instanceof SyntaxError && !this.options.strict))throw e;
                        this.fire({
                            type: "error",
                            error: e,
                            message: e.message,
                            line: e.line,
                            col: e.col
                        }), d = c.advance([Tokens.SEMICOLON, Tokens.RBRACE]);
                        if (d == Tokens.SEMICOLON)this._readDeclarations(!1, b); else if (d != Tokens.RBRACE)throw e
                    }
                },
                _readWhitespace: function () {
                    var a = this._tokenStream, b = "";
                    while (a.match(Tokens.S))b += a.token().value;
                    return b
                },
                _unexpectedToken: function (a) {
                    throw new SyntaxError("Unexpected token '" + a.value + "' at line " + a.startLine + ", col " + a.startCol + ".", a.startLine, a.startCol)
                },
                _verifyEnd: function () {
                    this._tokenStream.LA(1) != Tokens.EOF && this._unexpectedToken(this._tokenStream.LT(1))
                },
                _validateProperty: function (a, b) {
                    Validation.validate(a, b)
                },
                parse: function (a) {
                    this._tokenStream = new TokenStream(a, Tokens), this._stylesheet()
                },
                parseStyleSheet: function (a) {
                    return this.parse(a)
                },
                parseMediaQuery: function (a) {
                    this._tokenStream = new TokenStream(a, Tokens);
                    var b = this._media_query();
                    return this._verifyEnd(), b
                },
                parsePropertyValue: function (a) {
                    this._tokenStream = new TokenStream(a, Tokens), this._readWhitespace();
                    var b = this._expr();
                    return this._readWhitespace(), this._verifyEnd(), b
                },
                parseRule: function (a) {
                    this._tokenStream = new TokenStream(a, Tokens), this._readWhitespace();
                    var b = this._ruleset();
                    return this._readWhitespace(), this._verifyEnd(), b
                },
                parseSelector: function (a) {
                    this._tokenStream = new TokenStream(a, Tokens), this._readWhitespace();
                    var b = this._selector();
                    return this._readWhitespace(), this._verifyEnd(), b
                },
                parseStyleAttribute: function (a) {
                    a += "}", this._tokenStream = new TokenStream(a, Tokens), this._readDeclarations()
                }
            };
            for (b in c)c.hasOwnProperty(b) && (a[b] = c[b]);
            return a
        }();
        var Properties = {
            "alignment-adjust": "auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical | <percentage> | <length>",
            "alignment-baseline": "baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical",
            animation: 1,
            "animation-delay": {multi: "<time>", comma: !0},
            "animation-direction": {multi: "normal | alternate", comma: !0},
            "animation-duration": {multi: "<time>", comma: !0},
            "animation-iteration-count": {multi: "<number> | infinite", comma: !0},
            "animation-name": {multi: "none | <ident>", comma: !0},
            "animation-play-state": {multi: "running | paused", comma: !0},
            "animation-timing-function": 1,
            "-moz-animation-delay": {multi: "<time>", comma: !0},
            "-moz-animation-direction": {multi: "normal | alternate", comma: !0},
            "-moz-animation-duration": {multi: "<time>", comma: !0},
            "-moz-animation-iteration-count": {multi: "<number> | infinite", comma: !0},
            "-moz-animation-name": {multi: "none | <ident>", comma: !0},
            "-moz-animation-play-state": {multi: "running | paused", comma: !0},
            "-ms-animation-delay": {multi: "<time>", comma: !0},
            "-ms-animation-direction": {multi: "normal | alternate", comma: !0},
            "-ms-animation-duration": {multi: "<time>", comma: !0},
            "-ms-animation-iteration-count": {multi: "<number> | infinite", comma: !0},
            "-ms-animation-name": {multi: "none | <ident>", comma: !0},
            "-ms-animation-play-state": {multi: "running | paused", comma: !0},
            "-webkit-animation-delay": {multi: "<time>", comma: !0},
            "-webkit-animation-direction": {multi: "normal | alternate", comma: !0},
            "-webkit-animation-duration": {multi: "<time>", comma: !0},
            "-webkit-animation-iteration-count": {multi: "<number> | infinite", comma: !0},
            "-webkit-animation-name": {multi: "none | <ident>", comma: !0},
            "-webkit-animation-play-state": {multi: "running | paused", comma: !0},
            "-o-animation-delay": {multi: "<time>", comma: !0},
            "-o-animation-direction": {multi: "normal | alternate", comma: !0},
            "-o-animation-duration": {multi: "<time>", comma: !0},
            "-o-animation-iteration-count": {multi: "<number> | infinite", comma: !0},
            "-o-animation-name": {multi: "none | <ident>", comma: !0},
            "-o-animation-play-state": {multi: "running | paused", comma: !0},
            appearance: "icon | window | desktop | workspace | document | tooltip | dialog | button | push-button | hyperlink | radio-button | checkbox | menu-item | tab | menu | menubar | pull-down-menu | pop-up-menu | list-menu | radio-group | checkbox-group | outline-tree | range | field | combo-box | signature | password | normal | inherit",
            azimuth: function (a) {
                var b = "<angle> | leftwards | rightwards | inherit", c = "left-side | far-left | left | center-left | center | center-right | right | far-right | right-side", d = !1, e = !1, f;
                ValidationTypes.isAny(a, b) || (ValidationTypes.isAny(a, "behind") && (d = !0, e = !0), ValidationTypes.isAny(a, c) && (e = !0, d || ValidationTypes.isAny(a, "behind")));
                if (a.hasNext())throw f = a.next(), e ? new ValidationError("Expected end of value but found '" + f + "'.", f.line, f.col) : new ValidationError("Expected (<'azimuth'>) but found '" + f + "'.", f.line, f.col)
            },
            "backface-visibility": "visible | hidden",
            background: 1,
            "background-attachment": {multi: "<attachment>", comma: !0},
            "background-clip": {multi: "<box>", comma: !0},
            "background-color": "<color> | inherit",
            "background-image": {multi: "<bg-image>", comma: !0},
            "background-origin": {multi: "<box>", comma: !0},
            "background-position": {multi: "<bg-position>", comma: !0},
            "background-repeat": {multi: "<repeat-style>"},
            "background-size": {multi: "<bg-size>", comma: !0},
            "baseline-shift": "baseline | sub | super | <percentage> | <length>",
            binding: 1,
            bleed: "<length>",
            "bookmark-label": "<content> | <attr> | <string>",
            "bookmark-level": "none | <integer>",
            "bookmark-state": "open | closed",
            "bookmark-target": "none | <uri> | <attr>",
            border: "<border-width> || <border-style> || <color>",
            "border-bottom": "<border-width> || <border-style> || <color>",
            "border-bottom-color": "<color>",
            "border-bottom-left-radius": "<x-one-radius>",
            "border-bottom-right-radius": "<x-one-radius>",
            "border-bottom-style": "<border-style>",
            "border-bottom-width": "<border-width>",
            "border-collapse": "collapse | separate | inherit",
            "border-color": {multi: "<color> | inherit", max: 4},
            "border-image": 1,
            "border-image-outset": {multi: "<length> | <number>", max: 4},
            "border-image-repeat": {multi: "stretch | repeat | round", max: 2},
            "border-image-slice": function (a) {
                var b = !1, c = "<number> | <percentage>", d = !1, e = 0, f = 4, g;
                ValidationTypes.isAny(a, "fill") && (d = !0, b = !0);
                while (a.hasNext() && e < f) {
                    b = ValidationTypes.isAny(a, c);
                    if (!b)break;
                    e++
                }
                d ? b = !0 : ValidationTypes.isAny(a, "fill");
                if (a.hasNext())throw g = a.next(), b ? new ValidationError("Expected end of value but found '" + g + "'.", g.line, g.col) : new ValidationError("Expected ([<number> | <percentage>]{1,4} && fill?) but found '" + g + "'.", g.line, g.col)
            },
            "border-image-source": "<image> | none",
            "border-image-width": {multi: "<length> | <percentage> | <number> | auto", max: 4},
            "border-left": "<border-width> || <border-style> || <color>",
            "border-left-color": "<color> | inherit",
            "border-left-style": "<border-style>",
            "border-left-width": "<border-width>",
            "border-radius": function (a) {
                var b = !1, c = "<length> | <percentage>", d = !1, e = !1, f = 0, g = 8, h;
                while (a.hasNext() && f < g) {
                    b = ValidationTypes.isAny(a, c);
                    if (!b) {
                        if (!(a.peek() == "/" && f > 1 && !d))break;
                        d = !0, g = f + 5, a.next()
                    }
                    f++
                }
                if (a.hasNext())throw h = a.next(), b ? new ValidationError("Expected end of value but found '" + h + "'.", h.line, h.col) : new ValidationError("Expected (<'border-radius'>) but found '" + h + "'.", h.line, h.col)
            },
            "border-right": "<border-width> || <border-style> || <color>",
            "border-right-color": "<color> | inherit",
            "border-right-style": "<border-style>",
            "border-right-width": "<border-width>",
            "border-spacing": {multi: "<length> | inherit", max: 2},
            "border-style": {multi: "<border-style>", max: 4},
            "border-top": "<border-width> || <border-style> || <color>",
            "border-top-color": "<color> | inherit",
            "border-top-left-radius": "<x-one-radius>",
            "border-top-right-radius": "<x-one-radius>",
            "border-top-style": "<border-style>",
            "border-top-width": "<border-width>",
            "border-width": {multi: "<border-width>", max: 4},
            bottom: "<margin-width> | inherit",
            "box-align": "start | end | center | baseline | stretch",
            "box-decoration-break": "slice |clone",
            "box-direction": "normal | reverse | inherit",
            "box-flex": "<number>",
            "box-flex-group": "<integer>",
            "box-lines": "single | multiple",
            "box-ordinal-group": "<integer>",
            "box-orient": "horizontal | vertical | inline-axis | block-axis | inherit",
            "box-pack": "start | end | center | justify",
            "box-shadow": function (a) {
                var b = !1, c;
                if (!ValidationTypes.isAny(a, "none"))Validation.multiProperty("<shadow>", a, !0, Infinity); else if (a.hasNext())throw c = a.next(), new ValidationError("Expected end of value but found '" + c + "'.", c.line, c.col)
            },
            "box-sizing": "content-box | border-box | inherit",
            "break-after": "auto | always | avoid | left | right | page | column | avoid-page | avoid-column",
            "break-before": "auto | always | avoid | left | right | page | column | avoid-page | avoid-column",
            "break-inside": "auto | avoid | avoid-page | avoid-column",
            "caption-side": "top | bottom | inherit",
            clear: "none | right | left | both | inherit",
            clip: 1,
            color: "<color> | inherit",
            "color-profile": 1,
            "column-count": "<integer> | auto",
            "column-fill": "auto | balance",
            "column-gap": "<length> | normal",
            "column-rule": "<border-width> || <border-style> || <color>",
            "column-rule-color": "<color>",
            "column-rule-style": "<border-style>",
            "column-rule-width": "<border-width>",
            "column-span": "none | all",
            "column-width": "<length> | auto",
            columns: 1,
            content: 1,
            "counter-increment": 1,
            "counter-reset": 1,
            crop: "<shape> | auto",
            cue: "cue-after | cue-before | inherit",
            "cue-after": 1,
            "cue-before": 1,
            cursor: 1,
            direction: "ltr | rtl | inherit",
            display: "inline | block | list-item | inline-block | table | inline-table | table-row-group | table-header-group | table-footer-group | table-row | table-column-group | table-column | table-cell | table-caption | box | inline-box | grid | inline-grid | none | inherit",
            "dominant-baseline": 1,
            "drop-initial-after-adjust": "central | middle | after-edge | text-after-edge | ideographic | alphabetic | mathematical | <percentage> | <length>",
            "drop-initial-after-align": "baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical",
            "drop-initial-before-adjust": "before-edge | text-before-edge | central | middle | hanging | mathematical | <percentage> | <length>",
            "drop-initial-before-align": "caps-height | baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical",
            "drop-initial-size": "auto | line | <length> | <percentage>",
            "drop-initial-value": "initial | <integer>",
            elevation: "<angle> | below | level | above | higher | lower | inherit",
            "empty-cells": "show | hide | inherit",
            filter: 1,
            fit: "fill | hidden | meet | slice",
            "fit-position": 1,
            "float": "left | right | none | inherit",
            "float-offset": 1,
            font: 1,
            "font-family": 1,
            "font-size": "<absolute-size> | <relative-size> | <length> | <percentage> | inherit",
            "font-size-adjust": "<number> | none | inherit",
            "font-stretch": "normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded | inherit",
            "font-style": "normal | italic | oblique | inherit",
            "font-variant": "normal | small-caps | inherit",
            "font-weight": "normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | inherit",
            "grid-cell-stacking": "columns | rows | layer",
            "grid-column": 1,
            "grid-columns": 1,
            "grid-column-align": "start | end | center | stretch",
            "grid-column-sizing": 1,
            "grid-column-span": "<integer>",
            "grid-flow": "none | rows | columns",
            "grid-layer": "<integer>",
            "grid-row": 1,
            "grid-rows": 1,
            "grid-row-align": "start | end | center | stretch",
            "grid-row-span": "<integer>",
            "grid-row-sizing": 1,
            "hanging-punctuation": 1,
            height: "<margin-width> | inherit",
            "hyphenate-after": "<integer> | auto",
            "hyphenate-before": "<integer> | auto",
            "hyphenate-character": "<string> | auto",
            "hyphenate-lines": "no-limit | <integer>",
            "hyphenate-resource": 1,
            hyphens: "none | manual | auto",
            icon: 1,
            "image-orientation": "angle | auto",
            "image-rendering": 1,
            "image-resolution": 1,
            "inline-box-align": "initial | last | <integer>",
            left: "<margin-width> | inherit",
            "letter-spacing": "<length> | normal | inherit",
            "line-height": "<number> | <length> | <percentage> | normal | inherit",
            "line-break": "auto | loose | normal | strict",
            "line-stacking": 1,
            "line-stacking-ruby": "exclude-ruby | include-ruby",
            "line-stacking-shift": "consider-shifts | disregard-shifts",
            "line-stacking-strategy": "inline-line-height | block-line-height | max-height | grid-height",
            "list-style": 1,
            "list-style-image": "<uri> | none | inherit",
            "list-style-position": "inside | outside | inherit",
            "list-style-type": "disc | circle | square | decimal | decimal-leading-zero | lower-roman | upper-roman | lower-greek | lower-latin | upper-latin | armenian | georgian | lower-alpha | upper-alpha | none | inherit",
            margin: {multi: "<margin-width> | inherit", max: 4},
            "margin-bottom": "<margin-width> | inherit",
            "margin-left": "<margin-width> | inherit",
            "margin-right": "<margin-width> | inherit",
            "margin-top": "<margin-width> | inherit",
            mark: 1,
            "mark-after": 1,
            "mark-before": 1,
            marks: 1,
            "marquee-direction": 1,
            "marquee-play-count": 1,
            "marquee-speed": 1,
            "marquee-style": 1,
            "max-height": "<length> | <percentage> | none | inherit",
            "max-width": "<length> | <percentage> | none | inherit",
            "min-height": "<length> | <percentage> | inherit",
            "min-width": "<length> | <percentage> | inherit",
            "move-to": 1,
            "nav-down": 1,
            "nav-index": 1,
            "nav-left": 1,
            "nav-right": 1,
            "nav-up": 1,
            opacity: "<number> | inherit",
            orphans: "<integer> | inherit",
            outline: 1,
            "outline-color": "<color> | invert | inherit",
            "outline-offset": 1,
            "outline-style": "<border-style> | inherit",
            "outline-width": "<border-width> | inherit",
            overflow: "visible | hidden | scroll | auto | inherit",
            "overflow-style": 1,
            "overflow-x": 1,
            "overflow-y": 1,
            padding: {multi: "<padding-width> | inherit", max: 4},
            "padding-bottom": "<padding-width> | inherit",
            "padding-left": "<padding-width> | inherit",
            "padding-right": "<padding-width> | inherit",
            "padding-top": "<padding-width> | inherit",
            page: 1,
            "page-break-after": "auto | always | avoid | left | right | inherit",
            "page-break-before": "auto | always | avoid | left | right | inherit",
            "page-break-inside": "auto | avoid | inherit",
            "page-policy": 1,
            pause: 1,
            "pause-after": 1,
            "pause-before": 1,
            perspective: 1,
            "perspective-origin": 1,
            phonemes: 1,
            pitch: 1,
            "pitch-range": 1,
            "play-during": 1,
            position: "static | relative | absolute | fixed | inherit",
            "presentation-level": 1,
            "punctuation-trim": 1,
            quotes: 1,
            "rendering-intent": 1,
            resize: 1,
            rest: 1,
            "rest-after": 1,
            "rest-before": 1,
            richness: 1,
            right: "<margin-width> | inherit",
            rotation: 1,
            "rotation-point": 1,
            "ruby-align": 1,
            "ruby-overhang": 1,
            "ruby-position": 1,
            "ruby-span": 1,
            size: 1,
            speak: "normal | none | spell-out | inherit",
            "speak-header": "once | always | inherit",
            "speak-numeral": "digits | continuous | inherit",
            "speak-punctuation": "code | none | inherit",
            "speech-rate": 1,
            src: 1,
            stress: 1,
            "string-set": 1,
            "table-layout": "auto | fixed | inherit",
            "tab-size": "<integer> | <length>",
            target: 1,
            "target-name": 1,
            "target-new": 1,
            "target-position": 1,
            "text-align": "left | right | center | justify | inherit",
            "text-align-last": 1,
            "text-decoration": 1,
            "text-emphasis": 1,
            "text-height": 1,
            "text-indent": "<length> | <percentage> | inherit",
            "text-justify": "auto | none | inter-word | inter-ideograph | inter-cluster | distribute | kashida",
            "text-outline": 1,
            "text-overflow": 1,
            "text-shadow": 1,
            "text-transform": "capitalize | uppercase | lowercase | none | inherit",
            "text-wrap": "normal | none | avoid",
            top: "<margin-width> | inherit",
            transform: 1,
            "transform-origin": 1,
            "transform-style": 1,
            transition: 1,
            "transition-delay": 1,
            "transition-duration": 1,
            "transition-property": 1,
            "transition-timing-function": 1,
            "unicode-bidi": "normal | embed | bidi-override | inherit",
            "user-modify": "read-only | read-write | write-only | inherit",
            "user-select": "none | text | toggle | element | elements | all | inherit",
            "vertical-align": "<percentage> | <length> | baseline | sub | super | top | text-top | middle | bottom | text-bottom | inherit",
            visibility: "visible | hidden | collapse | inherit",
            "voice-balance": 1,
            "voice-duration": 1,
            "voice-family": 1,
            "voice-pitch": 1,
            "voice-pitch-range": 1,
            "voice-rate": 1,
            "voice-stress": 1,
            "voice-volume": 1,
            volume: 1,
            "white-space": "normal | pre | nowrap | pre-wrap | pre-line | inherit",
            "white-space-collapse": 1,
            widows: "<integer> | inherit",
            width: "<length> | <percentage> | auto | inherit",
            "word-break": "normal | keep-all | break-all",
            "word-spacing": "<length> | normal | inherit",
            "word-wrap": 1,
            "z-index": "<integer> | auto | inherit",
            zoom: "<number> | <percentage> | normal"
        };
        PropertyName.prototype = new SyntaxUnit, PropertyName.prototype.constructor = PropertyName, PropertyName.prototype.toString = function () {
            return (this.hack ? this.hack : "") + this.text
        }, PropertyValue.prototype = new SyntaxUnit, PropertyValue.prototype.constructor = PropertyValue, PropertyValueIterator.prototype.count = function () {
            return this._parts.length
        }, PropertyValueIterator.prototype.isFirst = function () {
            return this._i === 0
        }, PropertyValueIterator.prototype.hasNext = function () {
            return this._i < this._parts.length
        }, PropertyValueIterator.prototype.mark = function () {
            this._marks.push(this._i)
        }, PropertyValueIterator.prototype.peek = function (a) {
            return this.hasNext() ? this._parts[this._i + (a || 0)] : null
        }, PropertyValueIterator.prototype.next = function () {
            return this.hasNext() ? this._parts[this._i++] : null
        }, PropertyValueIterator.prototype.previous = function () {
            return this._i > 0 ? this._parts[--this._i] : null
        }, PropertyValueIterator.prototype.restore = function () {
            this._marks.length && (this._i = this._marks.pop())
        }, PropertyValuePart.prototype = new SyntaxUnit, PropertyValuePart.prototype.constructor = PropertyValuePart, PropertyValuePart.fromToken = function (a) {
            return new PropertyValuePart(a.value, a.startLine, a.startCol)
        };
        var Pseudos = {":first-letter": 1, ":first-line": 1, ":before": 1, ":after": 1};
        Pseudos.ELEMENT = 1, Pseudos.CLASS = 2, Pseudos.isElement = function (a) {
            return a.indexOf("::") === 0 || Pseudos[a.toLowerCase()] == Pseudos.ELEMENT
        }, Selector.prototype = new SyntaxUnit, Selector.prototype.constructor = Selector, SelectorPart.prototype = new SyntaxUnit, SelectorPart.prototype.constructor = SelectorPart, SelectorSubPart.prototype = new SyntaxUnit, SelectorSubPart.prototype.constructor = SelectorSubPart, Specificity.prototype = {
            constructor: Specificity,
            compare: function (a) {
                var b = ["a", "b", "c", "d"], c, d;
                for (c = 0, d = b.length; c < d; c++) {
                    if (this[b[c]] < a[b[c]])return -1;
                    if (this[b[c]] > a[b[c]])return 1
                }
                return 0
            },
            valueOf: function () {
                return this.a * 1e3 + this.b * 100 + this.c * 10 + this.d
            },
            toString: function () {
                return this.a + "," + this.b + "," + this.c + "," + this.d
            }
        }, Specificity.calculate = function (a) {
            function h(a) {
                var b, c, d, i, j = a.elementName ? a.elementName.text : "", k;
                j && j.charAt(j.length - 1) != "*" && g++;
                for (b = 0, d = a.modifiers.length; b < d; b++) {
                    k = a.modifiers[b];
                    switch (k.type) {
                        case"class":
                        case"attribute":
                            f++;
                            break;
                        case"id":
                            e++;
                            break;
                        case"pseudo":
                            Pseudos.isElement(k.text) ? g++ : f++;
                            break;
                        case"not":
                            for (c = 0, i = k.args.length; c < i; c++)h(k.args[c])
                    }
                }
            }

            var b, c, d, e = 0, f = 0, g = 0;
            for (b = 0, c = a.parts.length; b < c; b++)d = a.parts[b], d instanceof SelectorPart && h(d);
            return new Specificity(0, e, f, g)
        };
        var h = /^[0-9a-fA-F]$/, nonascii = /^[\u0080-\uFFFF]$/, nl = /\n|\r\n|\r|\f/;
        TokenStream.prototype = mix(new TokenStreamBase, {
            _getToken: function (a) {
                var b, c = this._reader, d = null, e = c.getLine(), f = c.getCol();
                b = c.read();
                while (b) {
                    switch (b) {
                        case"/":
                            c.peek() == "*" ? d = this.commentToken(b, e, f) : d = this.charToken(b, e, f);
                            break;
                        case"|":
                        case"~":
                        case"^":
                        case"$":
                        case"*":
                            c.peek() == "=" ? d = this.comparisonToken(b, e, f) : d = this.charToken(b, e, f);
                            break;
                        case'"':
                        case"'":
                            d = this.stringToken(b, e, f);
                            break;
                        case"#":
                            isNameChar(c.peek()) ? d = this.hashToken(b, e, f) : d = this.charToken(b, e, f);
                            break;
                        case".":
                            isDigit(c.peek()) ? d = this.numberToken(b, e, f) : d = this.charToken(b, e, f);
                            break;
                        case"-":
                            c.peek() == "-" ? d = this.htmlCommentEndToken(b, e, f) : isNameStart(c.peek()) ? d = this.identOrFunctionToken(b, e, f) : d = this.charToken(b, e, f);
                            break;
                        case"!":
                            d = this.importantToken(b, e, f);
                            break;
                        case"@":
                            d = this.atRuleToken(b, e, f);
                            break;
                        case":":
                            d = this.notToken(b, e, f);
                            break;
                        case"<":
                            d = this.htmlCommentStartToken(b, e, f);
                            break;
                        case"U":
                        case"u":
                            if (c.peek() == "+") {
                                d = this.unicodeRangeToken(b, e, f);
                                break
                            }
                            ;
                        default:
                            isDigit(b) ? d = this.numberToken(b, e, f) : isWhitespace(b) ? d = this.whitespaceToken(b, e, f) : isIdentStart(b) ? d = this.identOrFunctionToken(b, e, f) : d = this.charToken(b, e, f)
                    }
                    break
                }
                return !d && b === null && (d = this.createToken(Tokens.EOF, null, e, f)), d
            }, createToken: function (a, b, c, d, e) {
                var f = this._reader;
                return e = e || {}, {
                    value: b,
                    type: a,
                    channel: e.channel,
                    hide: e.hide || !1,
                    startLine: c,
                    startCol: d,
                    endLine: f.getLine(),
                    endCol: f.getCol()
                }
            }, atRuleToken: function (a, b, c) {
                var d = a, e = this._reader, f = Tokens.CHAR, g = !1, h, i;
                e.mark(), h = this.readName(), d = a + h, f = Tokens.type(d.toLowerCase());
                if (f == Tokens.CHAR || f == Tokens.UNKNOWN)d.length > 1 ? f = Tokens.UNKNOWN_SYM : (f = Tokens.CHAR, d = a, e.reset());
                return this.createToken(f, d, b, c)
            }, charToken: function (a, b, c) {
                var d = Tokens.type(a);
                return d == -1 && (d = Tokens.CHAR), this.createToken(d, a, b, c)
            }, commentToken: function (a, b, c) {
                var d = this._reader, e = this.readComment(a);
                return this.createToken(Tokens.COMMENT, e, b, c)
            }, comparisonToken: function (a, b, c) {
                var d = this._reader, e = a + d.read(), f = Tokens.type(e) || Tokens.CHAR;
                return this.createToken(f, e, b, c)
            }, hashToken: function (a, b, c) {
                var d = this._reader, e = this.readName(a);
                return this.createToken(Tokens.HASH, e, b, c)
            }, htmlCommentStartToken: function (a, b, c) {
                var d = this._reader, e = a;
                return d.mark(), e += d.readCount(3), e == "<!--" ? this.createToken(Tokens.CDO, e, b, c) : (d.reset(), this.charToken(a, b, c))
            }, htmlCommentEndToken: function (a, b, c) {
                var d = this._reader, e = a;
                return d.mark(), e += d.readCount(2), e == "-->" ? this.createToken(Tokens.CDC, e, b, c) : (d.reset(), this.charToken(a, b, c))
            }, identOrFunctionToken: function (a, b, c) {
                var d = this._reader, e = this.readName(a), f = Tokens.IDENT;
                return d.peek() == "(" ? (e += d.read(), e.toLowerCase() == "url(" ? (f = Tokens.URI, e = this.readURI(e), e.toLowerCase() == "url(" && (f = Tokens.FUNCTION)) : f = Tokens.FUNCTION) : d.peek() == ":" && e.toLowerCase() == "progid" && (e += d.readTo("("), f = Tokens.IE_FUNCTION), this.createToken(f, e, b, c)
            }, importantToken: function (a, b, c) {
                var d = this._reader, e = a, f = Tokens.CHAR, g, h;
                d.mark(), h = d.read();
                while (h) {
                    if (h == "/") {
                        if (d.peek() != "*")break;
                        g = this.readComment(h);
                        if (g === "")break
                    } else {
                        if (!isWhitespace(h)) {
                            if (/i/i.test(h)) {
                                g = d.readCount(8), /mportant/i.test(g) && (e += h + g, f = Tokens.IMPORTANT_SYM);
                                break
                            }
                            break
                        }
                        e += h + this.readWhitespace()
                    }
                    h = d.read()
                }
                return f == Tokens.CHAR ? (d.reset(), this.charToken(a, b, c)) : this.createToken(f, e, b, c)
            }, notToken: function (a, b, c) {
                var d = this._reader, e = a;
                return d.mark(), e += d.readCount(4), e.toLowerCase() == ":not(" ? this.createToken(Tokens.NOT, e, b, c) : (d.reset(), this.charToken(a, b, c))
            }, numberToken: function (a, b, c) {
                var d = this._reader, e = this.readNumber(a), f, g = Tokens.NUMBER, h = d.peek();
                return isIdentStart(h) ? (f = this.readName(d.read()), e += f, /^em$|^ex$|^px$|^gd$|^rem$|^vw$|^vh$|^vm$|^ch$|^cm$|^mm$|^in$|^pt$|^pc$/i.test(f) ? g = Tokens.LENGTH : /^deg|^rad$|^grad$/i.test(f) ? g = Tokens.ANGLE : /^ms$|^s$/i.test(f) ? g = Tokens.TIME : /^hz$|^khz$/i.test(f) ? g = Tokens.FREQ : /^dpi$|^dpcm$/i.test(f) ? g = Tokens.RESOLUTION : g = Tokens.DIMENSION) : h == "%" && (e += d.read(), g = Tokens.PERCENTAGE), this.createToken(g, e, b, c)
            }, stringToken: function (a, b, c) {
                var d = a, e = a, f = this._reader, g = a, h = Tokens.STRING, i = f.read();
                while (i) {
                    e += i;
                    if (i == d && g != "\\")break;
                    if (isNewLine(f.peek()) && i != "\\") {
                        h = Tokens.INVALID;
                        break
                    }
                    g = i, i = f.read()
                }
                return i === null && (h = Tokens.INVALID), this.createToken(h, e, b, c)
            }, unicodeRangeToken: function (a, b, c) {
                var d = this._reader, e = a, f, g = Tokens.CHAR;
                return d.peek() == "+" && (d.mark(), e += d.read(), e += this.readUnicodeRangePart(!0), e.length == 2 ? d.reset() : (g = Tokens.UNICODE_RANGE, e.indexOf("?") == -1 && d.peek() == "-" && (d.mark(), f = d.read(), f += this.readUnicodeRangePart(!1), f.length == 1 ? d.reset() : e += f))), this.createToken(g, e, b, c)
            }, whitespaceToken: function (a, b, c) {
                var d = this._reader, e = a + this.readWhitespace();
                return this.createToken(Tokens.S, e, b, c)
            }, readUnicodeRangePart: function (a) {
                var b = this._reader, c = "", d = b.peek();
                while (isHexDigit(d) && c.length < 6)b.read(), c += d, d = b.peek();
                if (a)while (d == "?" && c.length < 6)b.read(), c += d, d = b.peek();
                return c
            }, readWhitespace: function () {
                var a = this._reader, b = "", c = a.peek();
                while (isWhitespace(c))a.read(), b += c, c = a.peek();
                return b
            }, readNumber: function (a) {
                var b = this._reader, c = a, d = a == ".", e = b.peek();
                while (e) {
                    if (isDigit(e))c += b.read(); else {
                        if (e != ".")break;
                        if (d)break;
                        d = !0, c += b.read()
                    }
                    e = b.peek()
                }
                return c
            }, readString: function () {
                var a = this._reader, b = a.read(), c = b, d = b, e = a.peek();
                while (e) {
                    e = a.read(), c += e;
                    if (e == b && d != "\\")break;
                    if (isNewLine(a.peek()) && e != "\\") {
                        c = "";
                        break
                    }
                    d = e, e = a.peek()
                }
                return e === null && (c = ""), c
            }, readURI: function (a) {
                var b = this._reader, c = a, d = "", e = b.peek();
                b.mark();
                while (e && isWhitespace(e))b.read(), e = b.peek();
                e == "'" || e == '"' ? d = this.readString() : d = this.readURL(), e = b.peek();
                while (e && isWhitespace(e))b.read(), e = b.peek();
                return d === "" || e != ")" ? (c = a, b.reset()) : c += d + b.read(), c
            }, readURL: function () {
                var a = this._reader, b = "", c = a.peek();
                while (/^[!#$%&\\*-~]$/.test(c))b += a.read(), c = a.peek();
                return b
            }, readName: function (a) {
                var b = this._reader, c = a || "", d = b.peek();
                for (; ;)if (d == "\\")c += this.readEscape(b.read()), d = b.peek(); else {
                    if (!d || !isNameChar(d))break;
                    c += b.read(), d = b.peek()
                }
                return c
            }, readEscape: function (a) {
                var b = this._reader, c = a || "", d = 0, e = b.peek();
                if (isHexDigit(e))do c += b.read(), e = b.peek(); while (e && isHexDigit(e) && ++d < 6);
                return c.length == 3 && /\s/.test(e) || c.length == 7 || c.length == 1 ? b.read() : e = "", c + e
            }, readComment: function (a) {
                var b = this._reader, c = a || "", d = b.read();
                if (d == "*") {
                    while (d) {
                        c += d;
                        if (c.length > 2 && d == "*" && b.peek() == "/") {
                            c += b.read();
                            break
                        }
                        d = b.read()
                    }
                    return c
                }
                return ""
            }
        });
        var Tokens = [{name: "CDO"}, {name: "CDC"}, {name: "S", whitespace: !0}, {
            name: "COMMENT",
            comment: !0,
            hide: !0,
            channel: "comment"
        }, {name: "INCLUDES", text: "~="}, {name: "DASHMATCH", text: "|="}, {
            name: "PREFIXMATCH",
            text: "^="
        }, {name: "SUFFIXMATCH", text: "$="}, {
            name: "SUBSTRINGMATCH",
            text: "*="
        }, {name: "STRING"}, {name: "IDENT"}, {name: "HASH"}, {name: "IMPORT_SYM", text: "@import"}, {
            name: "PAGE_SYM",
            text: "@page"
        }, {name: "MEDIA_SYM", text: "@media"}, {name: "FONT_FACE_SYM", text: "@font-face"}, {
            name: "CHARSET_SYM",
            text: "@charset"
        }, {name: "NAMESPACE_SYM", text: "@namespace"}, {name: "UNKNOWN_SYM"}, {
            name: "KEYFRAMES_SYM",
            text: ["@keyframes", "@-webkit-keyframes", "@-moz-keyframes", "@-ms-keyframes"]
        }, {name: "IMPORTANT_SYM"}, {name: "LENGTH"}, {name: "ANGLE"}, {name: "TIME"}, {name: "FREQ"}, {name: "DIMENSION"}, {name: "PERCENTAGE"}, {name: "NUMBER"}, {name: "URI"}, {name: "FUNCTION"}, {name: "UNICODE_RANGE"}, {name: "INVALID"}, {
            name: "PLUS",
            text: "+"
        }, {name: "GREATER", text: ">"}, {name: "COMMA", text: ","}, {
            name: "TILDE",
            text: "~"
        }, {name: "NOT"}, {name: "TOPLEFTCORNER_SYM", text: "@top-left-corner"}, {
            name: "TOPLEFT_SYM",
            text: "@top-left"
        }, {name: "TOPCENTER_SYM", text: "@top-center"}, {
            name: "TOPRIGHT_SYM",
            text: "@top-right"
        }, {name: "TOPRIGHTCORNER_SYM", text: "@top-right-corner"}, {
            name: "BOTTOMLEFTCORNER_SYM",
            text: "@bottom-left-corner"
        }, {name: "BOTTOMLEFT_SYM", text: "@bottom-left"}, {
            name: "BOTTOMCENTER_SYM",
            text: "@bottom-center"
        }, {name: "BOTTOMRIGHT_SYM", text: "@bottom-right"}, {
            name: "BOTTOMRIGHTCORNER_SYM",
            text: "@bottom-right-corner"
        }, {name: "LEFTTOP_SYM", text: "@left-top"}, {
            name: "LEFTMIDDLE_SYM",
            text: "@left-middle"
        }, {name: "LEFTBOTTOM_SYM", text: "@left-bottom"}, {
            name: "RIGHTTOP_SYM",
            text: "@right-top"
        }, {name: "RIGHTMIDDLE_SYM", text: "@right-middle"}, {
            name: "RIGHTBOTTOM_SYM",
            text: "@right-bottom"
        }, {name: "RESOLUTION", state: "media"}, {name: "IE_FUNCTION"}, {name: "CHAR"}, {
            name: "PIPE",
            text: "|"
        }, {name: "SLASH", text: "/"}, {name: "MINUS", text: "-"}, {name: "STAR", text: "*"}, {
            name: "LBRACE",
            text: "{"
        }, {name: "RBRACE", text: "}"}, {name: "LBRACKET", text: "["}, {name: "RBRACKET", text: "]"}, {
            name: "EQUALS",
            text: "="
        }, {name: "COLON", text: ":"}, {name: "SEMICOLON", text: ";"}, {name: "LPAREN", text: "("}, {
            name: "RPAREN",
            text: ")"
        }, {name: "DOT", text: "."}];
        (function () {
            var a = [], b = {};
            Tokens.UNKNOWN = -1, Tokens.unshift({name: "EOF"});
            for (var c = 0, d = Tokens.length; c < d; c++) {
                a.push(Tokens[c].name), Tokens[Tokens[c].name] = c;
                if (Tokens[c].text)if (Tokens[c].text instanceof Array)for (var e = 0; e < Tokens[c].text.length; e++)b[Tokens[c].text[e]] = c; else b[Tokens[c].text] = c
            }
            Tokens.name = function (b) {
                return a[b]
            }, Tokens.type = function (a) {
                return b[a] || -1
            }
        })();
        var Validation = {
            validate: function (a, b) {
                var c = a.toString().toLowerCase(), d = b.parts, e = new PropertyValueIterator(b), f = Properties[c], g, h, i, j, k, l, m, n, o, p, q;
                if (!f) {
                    if (c.indexOf("-") !== 0)throw new ValidationError("Unknown property '" + a + "'.", a.line, a.col)
                } else typeof f != "number" && (typeof f == "string" ? f.indexOf("||") > -1 ? this.groupProperty(f, e) : this.singleProperty(f, e, 1) : f.multi ? this.multiProperty(f.multi, e, f.comma, f.max || Infinity) : typeof f == "function" && f(e))
            }, singleProperty: function (a, b, c, d) {
                var e = !1, f = b.value, g = 0, h;
                while (b.hasNext() && g < c) {
                    e = ValidationTypes.isAny(b, a);
                    if (!e)break;
                    g++
                }
                if (!e)throw b.hasNext() && !b.isFirst() ? (h = b.peek(), new ValidationError("Expected end of value but found '" + h + "'.", h.line, h.col)) : new ValidationError("Expected (" + a + ") but found '" + f + "'.", f.line, f.col);
                if (b.hasNext())throw h = b.next(), new ValidationError("Expected end of value but found '" + h + "'.", h.line, h.col)
            }, multiProperty: function (a, b, c, d) {
                var e = !1, f = b.value, g = 0, h = !1, i;
                while (b.hasNext() && !e && g < d) {
                    if (!ValidationTypes.isAny(b, a))break;
                    g++;
                    if (!b.hasNext())e = !0; else if (c) {
                        if (b.peek() != ",")break;
                        i = b.next()
                    }
                }
                if (!e)throw b.hasNext() && !b.isFirst() ? (i = b.peek(), new ValidationError("Expected end of value but found '" + i + "'.", i.line, i.col)) : (i = b.previous(), c && i == "," ? new ValidationError("Expected end of value but found '" + i + "'.", i.line, i.col) : new ValidationError("Expected (" + a + ") but found '" + f + "'.", f.line, f.col));
                if (b.hasNext())throw i = b.next(), new ValidationError("Expected end of value but found '" + i + "'.", i.line, i.col)
            }, groupProperty: function (a, b, c) {
                var d = !1, e = b.value, f = a.split("||").length, g = {count: 0}, h = !1, i, j;
                while (b.hasNext() && !d) {
                    i = ValidationTypes.isAnyOfGroup(b, a);
                    if (!i)break;
                    if (g[i])break;
                    g[i] = 1, g.count++, h = !0;
                    if (g.count == f || !b.hasNext())d = !0
                }
                if (!d)throw h && b.hasNext() ? (j = b.peek(), new ValidationError("Expected end of value but found '" + j + "'.", j.line, j.col)) : new ValidationError("Expected (" + a + ") but found '" + e + "'.", e.line, e.col);
                if (b.hasNext())throw j = b.next(), new ValidationError("Expected end of value but found '" + j + "'.", j.line, j.col)
            }
        };
        ValidationError.prototype = new Error;
        var ValidationTypes = {
            isLiteral: function (a, b) {
                var c = a.text.toString().toLowerCase(), d = b.split(" | "), e, f, g = !1;
                for (e = 0, f = d.length; e < f && !g; e++)c == d[e] && (g = !0);
                return g
            }, isSimple: function (a) {
                return !!this.simple[a]
            }, isComplex: function (a) {
                return !!this.complex[a]
            }, isAny: function (a, b) {
                var c = b.split(" | "), d, e, f = !1;
                for (d = 0, e = c.length; d < e && !f && a.hasNext(); d++)f = this.isType(a, c[d]);
                return f
            }, isAnyOfGroup: function (a, b) {
                var c = b.split(" || "), d, e, f = !1;
                for (d = 0, e = c.length; d < e && !f; d++)f = this.isType(a, c[d]);
                return f ? c[d - 1] : !1
            }, isType: function (a, b) {
                var c = a.peek(), d = !1;
                return b.charAt(0) != "<" ? (d = this.isLiteral(c, b), d && a.next()) : this.simple[b] ? (d = this.simple[b](c), d && a.next()) : d = this.complex[b](a), d
            }, simple: {
                "<absolute-size>": function (a) {
                    return ValidationTypes.isLiteral(a, "xx-small | x-small | small | medium | large | x-large | xx-large")
                }, "<attachment>": function (a) {
                    return ValidationTypes.isLiteral(a, "scroll | fixed | local")
                }, "<attr>": function (a) {
                    return a.type == "function" && a.name == "attr"
                }, "<bg-image>": function (a) {
                    return this["<image>"](a) || this["<gradient>"](a) || a == "none"
                }, "<gradient>": function (a) {
                    return a.type == "function" && /^(?:\-(?:ms|moz|o|webkit)\-)?(?:repeating\-)?(?:radial|linear)\-gradient/i.test(a)
                }, "<box>": function (a) {
                    return ValidationTypes.isLiteral(a, "padding-box | border-box | content-box")
                }, "<content>": function (a) {
                    return a.type == "function" && a.name == "content"
                }, "<relative-size>": function (a) {
                    return ValidationTypes.isLiteral(a, "smaller | larger")
                }, "<ident>": function (a) {
                    return a.type == "identifier"
                }, "<length>": function (a) {
                    return a.type == "length" || a.type == "number" || a.type == "integer" || a == "0"
                }, "<color>": function (a) {
                    return a.type == "color" || a == "transparent"
                }, "<number>": function (a) {
                    return a.type == "number" || this["<integer>"](a)
                }, "<integer>": function (a) {
                    return a.type == "integer"
                }, "<line>": function (a) {
                    return a.type == "integer"
                }, "<angle>": function (a) {
                    return a.type == "angle"
                }, "<uri>": function (a) {
                    return a.type == "uri"
                }, "<image>": function (a) {
                    return this["<uri>"](a)
                }, "<percentage>": function (a) {
                    return a.type == "percentage" || a == "0"
                }, "<border-width>": function (a) {
                    return this["<length>"](a) || ValidationTypes.isLiteral(a, "thin | medium | thick")
                }, "<border-style>": function (a) {
                    return ValidationTypes.isLiteral(a, "none | hidden | dotted | dashed | solid | double | groove | ridge | inset | outset")
                }, "<margin-width>": function (a) {
                    return this["<length>"](a) || this["<percentage>"](a) || ValidationTypes.isLiteral(a, "auto")
                }, "<padding-width>": function (a) {
                    return this["<length>"](a) || this["<percentage>"](a)
                }, "<shape>": function (a) {
                    return a.type == "function" && (a.name == "rect" || a.name == "inset-rect")
                }, "<time>": function (a) {
                    return a.type == "time"
                }
            }, complex: {
                "<bg-position>": function (a) {
                    var b = this, c = !1, d = "<percentage> | <length>", e = "left | center | right", f = "top | center | bottom", g, h, i;
                    return ValidationTypes.isAny(a, "top | bottom") ? c = !0 : ValidationTypes.isAny(a, d) ? a.hasNext() && (c = ValidationTypes.isAny(a, d + " | " + f)) : ValidationTypes.isAny(a, e) && a.hasNext() && (ValidationTypes.isAny(a, f) ? (c = !0, ValidationTypes.isAny(a, d)) : ValidationTypes.isAny(a, d) && (ValidationTypes.isAny(a, f) && ValidationTypes.isAny(a, d), c = !0)), c
                }, "<bg-size>": function (a) {
                    var b = this, c = !1, d = "<percentage> | <length> | auto", e, f, g;
                    return ValidationTypes.isAny(a, "cover | contain") ? c = !0 : ValidationTypes.isAny(a, d) && (c = !0, ValidationTypes.isAny(a, d)), c
                }, "<repeat-style>": function (a) {
                    var b = !1, c = "repeat | space | round | no-repeat", d;
                    return a.hasNext() && (d = a.next(), ValidationTypes.isLiteral(d, "repeat-x | repeat-y") ? b = !0 : ValidationTypes.isLiteral(d, c) && (b = !0, a.hasNext() && ValidationTypes.isLiteral(a.peek(), c) && a.next())), b
                }, "<shadow>": function (a) {
                    var b = !1, c = 0, d = !1, e = !1, f;
                    if (a.hasNext()) {
                        ValidationTypes.isAny(a, "inset") && (d = !0), ValidationTypes.isAny(a, "<color>") && (e = !0);
                        while (ValidationTypes.isAny(a, "<length>") && c < 4)c++;
                        a.hasNext() && (e || ValidationTypes.isAny(a, "<color>"), d || ValidationTypes.isAny(a, "inset")), b = c >= 2 && c <= 4
                    }
                    return b
                }, "<x-one-radius>": function (a) {
                    var b = !1, c = 0, d = "<length> | <percentage>", e;
                    return ValidationTypes.isAny(a, d) && (b = !0, ValidationTypes.isAny(a, d)), b
                }
            }
        };
        parserlib.css = {
            Colors: Colors,
            Combinator: Combinator,
            Parser: Parser,
            PropertyName: PropertyName,
            PropertyValue: PropertyValue,
            PropertyValuePart: PropertyValuePart,
            MediaFeature: MediaFeature,
            MediaQuery: MediaQuery,
            Selector: Selector,
            SelectorPart: SelectorPart,
            SelectorSubPart: SelectorSubPart,
            Specificity: Specificity,
            TokenStream: TokenStream,
            Tokens: Tokens,
            ValidationError: ValidationError
        }
    }();
    var CSSLint = function () {
        var a = [], b = [], c = new parserlib.util.EventTarget;
        return c.version = "0.9.7", c.addRule = function (b) {
            a.push(b), a[b.id] = b
        }, c.clearRules = function () {
            a = []
        }, c.getRules = function () {
            return [].concat(a).sort(function (a, b) {
                return a.id > b.id ? 1 : 0
            })
        }, c.addFormatter = function (a) {
            b[a.id] = a
        }, c.getFormatter = function (a) {
            return b[a]
        }, c.format = function (a, b, c, d) {
            var e = this.getFormatter(c), f = null;
            return e && (f = e.startFormat(), f += e.formatResults(a, b, d || {}), f += e.endFormat()), f
        }, c.hasFormat = function (a) {
            return b.hasOwnProperty(a)
        }, c.verify = function (b, c) {
            var d = 0, e = a.length, f, g, h, i = new parserlib.css.Parser({
                starHack: !0,
                ieFilters: !0,
                underscoreHack: !0,
                strict: !1
            });
            g = b.replace(/\n\r?/g, "$split$").split("$split$");
            if (!c) {
                c = {};
                while (d < e)c[a[d++].id] = 1
            }
            f = new Reporter(g, c), c.errors = 2;
            for (d in c)c.hasOwnProperty(d) && a[d] && a[d].init(i, f);
            try {
                i.parse(b)
            } catch (j) {
                f.error("Fatal error, cannot continue: " + j.message, j.line, j.col, {})
            }
            return h = {messages: f.messages, stats: f.stats}, h.messages.sort(function (a, b) {
                return a.rollup && !b.rollup ? 1 : !a.rollup && b.rollup ? -1 : a.line - b.line
            }), h
        }, c
    }();
    Reporter.prototype = {
        constructor: Reporter, error: function (a, b, c, d) {
            this.messages.push({type: "error", line: b, col: c, message: a, evidence: this.lines[b - 1], rule: d || {}})
        }, warn: function (a, b, c, d) {
            this.report(a, b, c, d)
        }, report: function (a, b, c, d) {
            this.messages.push({
                type: this.ruleset[d.id] == 2 ? "error" : "warning",
                line: b,
                col: c,
                message: a,
                evidence: this.lines[b - 1],
                rule: d
            })
        }, info: function (a, b, c, d) {
            this.messages.push({type: "info", line: b, col: c, message: a, evidence: this.lines[b - 1], rule: d})
        }, rollupError: function (a, b) {
            this.messages.push({type: "error", rollup: !0, message: a, rule: b})
        }, rollupWarn: function (a, b) {
            this.messages.push({type: "warning", rollup: !0, message: a, rule: b})
        }, stat: function (a, b) {
            this.stats[a] = b
        }
    }, CSSLint._Reporter = Reporter, CSSLint.Util = {
        mix: function (a, b) {
            var c;
            for (c in b)b.hasOwnProperty(c) && (a[c] = b[c]);
            return c
        }, indexOf: function (a, b) {
            if (a.indexOf)return a.indexOf(b);
            for (var c = 0, d = a.length; c < d; c++)if (a[c] === b)return c;
            return -1
        }, forEach: function (a, b) {
            if (a.forEach)return a.forEach(b);
            for (var c = 0, d = a.length; c < d; c++)b(a[c], c, a)
        }
    }, CSSLint.addRule({
        id: "adjoining-classes",
        name: "Disallow adjoining classes",
        desc: "Don't use adjoining classes.",
        browsers: "IE6",
        init: function (a, b) {
            var c = this;
            a.addListener("startrule", function (d) {
                var e = d.selectors, f, g, h, i, j, k, l;
                for (j = 0; j < e.length; j++) {
                    f = e[j];
                    for (k = 0; k < f.parts.length; k++) {
                        g = f.parts[k];
                        if (g.type == a.SELECTOR_PART_TYPE) {
                            i = 0;
                            for (l = 0; l < g.modifiers.length; l++)h = g.modifiers[l], h.type == "class" && i++, i > 1 && b.report("Don't use adjoining classes.", g.line, g.col, c)
                        }
                    }
                }
            })
        }
    }), CSSLint.addRule({
        id: "box-model",
        name: "Beware of broken box size",
        desc: "Don't use width or height when using padding or border.",
        browsers: "All",
        init: function (a, b) {
            function g() {
                f = {}
            }

            function h() {
                var a;
                if (f.height)for (a in e)e.hasOwnProperty(a) && f[a] && (a != "padding" || f[a].value.parts.length !== 2 || f[a].value.parts[0].value !== 0) && b.report("Using height with " + a + " can sometimes make elements larger than you expect.", f[a].line, f[a].col, c);
                if (f.width)for (a in d)d.hasOwnProperty(a) && f[a] && (a != "padding" || f[a].value.parts.length !== 2 || f[a].value.parts[1].value !== 0) && b.report("Using width with " + a + " can sometimes make elements larger than you expect.", f[a].line, f[a].col, c)
            }

            var c = this, d = {
                border: 1,
                "border-left": 1,
                "border-right": 1,
                padding: 1,
                "padding-left": 1,
                "padding-right": 1
            }, e = {
                border: 1,
                "border-bottom": 1,
                "border-top": 1,
                padding: 1,
                "padding-bottom": 1,
                "padding-top": 1
            }, f;
            a.addListener("startrule", g), a.addListener("startfontface", g), a.addListener("startpage", g), a.addListener("startpagemargin", g), a.addListener("startkeyframerule", g), a.addListener("property", function (a) {
                var b = a.property.text.toLowerCase();
                if (e[b] || d[b])!/^0\S*$/.test(a.value) && (b != "border" || a.value != "none") && (f[b] = {
                    line: a.property.line,
                    col: a.property.col,
                    value: a.value
                }); else if (b == "width" || b == "height")f[b] = 1
            }), a.addListener("endrule", h), a.addListener("endfontface", h), a.addListener("endpage", h), a.addListener("endpagemargin", h), a.addListener("endkeyframerule", h)
        }
    }), CSSLint.addRule({
        id: "box-sizing",
        name: "Disallow use of box-sizing",
        desc: "The box-sizing properties isn't supported in IE6 and IE7.",
        browsers: "IE6, IE7",
        tags: ["Compatibility"],
        init: function (a, b) {
            var c = this;
            a.addListener("property", function (a) {
                var d = a.property.text.toLowerCase();
                d == "box-sizing" && b.report("The box-sizing property isn't supported in IE6 and IE7.", a.line, a.col, c)
            })
        }
    }), CSSLint.addRule({
        id: "compatible-vendor-prefixes",
        name: "Require compatible vendor prefixes",
        desc: "Include all compatible vendor prefixes to reach a wider range of users.",
        browsers: "All",
        init: function (a, b) {
            var c = this, d, e, f, g, h, i, j, k = Array.prototype.push, l = [];
            d = {
                animation: "webkit moz ms",
                "animation-delay": "webkit moz ms",
                "animation-direction": "webkit moz ms",
                "animation-duration": "webkit moz ms",
                "animation-fill-mode": "webkit moz ms",
                "animation-iteration-count": "webkit moz ms",
                "animation-name": "webkit moz ms",
                "animation-play-state": "webkit moz ms",
                "animation-timing-function": "webkit moz ms",
                appearance: "webkit moz",
                "border-end": "webkit moz",
                "border-end-color": "webkit moz",
                "border-end-style": "webkit moz",
                "border-end-width": "webkit moz",
                "border-image": "webkit moz o",
                "border-radius": "webkit moz",
                "border-start": "webkit moz",
                "border-start-color": "webkit moz",
                "border-start-style": "webkit moz",
                "border-start-width": "webkit moz",
                "box-align": "webkit moz ms",
                "box-direction": "webkit moz ms",
                "box-flex": "webkit moz ms",
                "box-lines": "webkit ms",
                "box-ordinal-group": "webkit moz ms",
                "box-orient": "webkit moz ms",
                "box-pack": "webkit moz ms",
                "box-sizing": "webkit moz",
                "box-shadow": "webkit moz",
                "column-count": "webkit moz ms",
                "column-gap": "webkit moz ms",
                "column-rule": "webkit moz ms",
                "column-rule-color": "webkit moz ms",
                "column-rule-style": "webkit moz ms",
                "column-rule-width": "webkit moz ms",
                "column-width": "webkit moz ms",
                hyphens: "epub moz",
                "line-break": "webkit ms",
                "margin-end": "webkit moz",
                "margin-start": "webkit moz",
                "marquee-speed": "webkit wap",
                "marquee-style": "webkit wap",
                "padding-end": "webkit moz",
                "padding-start": "webkit moz",
                "tab-size": "moz o",
                "text-size-adjust": "webkit ms",
                transform: "webkit moz ms o",
                "transform-origin": "webkit moz ms o",
                transition: "webkit moz o ms",
                "transition-delay": "webkit moz o ms",
                "transition-duration": "webkit moz o ms",
                "transition-property": "webkit moz o ms",
                "transition-timing-function": "webkit moz o ms",
                "user-modify": "webkit moz",
                "user-select": "webkit moz ms",
                "word-break": "epub ms",
                "writing-mode": "epub ms"
            };
            for (f in d)if (d.hasOwnProperty(f)) {
                g = [], h = d[f].split(" ");
                for (i = 0, j = h.length; i < j; i++)g.push("-" + h[i] + "-" + f);
                d[f] = g, k.apply(l, g)
            }
            a.addListener("startrule", function () {
                e = []
            }), a.addListener("property", function (a) {
                var b = a.property;
                CSSLint.Util.indexOf(l, b.text) > -1 && e.push(b)
            }), a.addListener("endrule", function (a) {
                if (!e.length)return;
                var f = {}, g, h, i, j, k, l, m, n, o, p;
                for (g = 0, h = e.length; g < h; g++) {
                    i = e[g];
                    for (j in d)d.hasOwnProperty(j) && (k = d[j], CSSLint.Util.indexOf(k, i.text) > -1 && (f[j] || (f[j] = {
                        full: k.slice(0),
                        actual: [],
                        actualNodes: []
                    }), CSSLint.Util.indexOf(f[j].actual, i.text) === -1 && (f[j].actual.push(i.text), f[j].actualNodes.push(i))))
                }
                for (j in f)if (f.hasOwnProperty(j)) {
                    l = f[j], m = l.full, n = l.actual;
                    if (m.length > n.length)for (g = 0, h = m.length; g < h; g++)o = m[g], CSSLint.Util.indexOf(n, o) === -1 && (p = n.length === 1 ? n[0] : n.length == 2 ? n.join(" and ") : n.join(", "), b.report("The property " + o + " is compatible with " + p + " and should be included as well.", l.actualNodes[0].line, l.actualNodes[0].col, c))
                }
            })
        }
    }), CSSLint.addRule({
        id: "display-property-grouping",
        name: "Require properties appropriate for display",
        desc: "Certain properties shouldn't be used with certain display property values.",
        browsers: "All",
        init: function (a, b) {
            function f(a, f, g) {
                e[a] && (typeof d[a] != "string" || e[a].value.toLowerCase() != d[a]) && b.report(g || a + " can't be used with display: " + f + ".", e[a].line, e[a].col, c)
            }

            function g() {
                e = {}
            }

            function h() {
                var a = e.display ? e.display.value : null;
                if (a)switch (a) {
                    case"inline":
                        f("height", a), f("width", a), f("margin", a), f("margin-top", a), f("margin-bottom", a), f("float", a, "display:inline has no effect on floated elements (but may be used to fix the IE6 double-margin bug).");
                        break;
                    case"block":
                        f("vertical-align", a);
                        break;
                    case"inline-block":
                        f("float", a);
                        break;
                    default:
                        a.indexOf("table-") === 0 && (f("margin", a), f("margin-left", a), f("margin-right", a), f("margin-top", a), f("margin-bottom", a), f("float", a))
                }
            }

            var c = this, d = {
                display: 1,
                "float": "none",
                height: 1,
                width: 1,
                margin: 1,
                "margin-left": 1,
                "margin-right": 1,
                "margin-bottom": 1,
                "margin-top": 1,
                padding: 1,
                "padding-left": 1,
                "padding-right": 1,
                "padding-bottom": 1,
                "padding-top": 1,
                "vertical-align": 1
            }, e;
            a.addListener("startrule", g), a.addListener("startfontface", g), a.addListener("startkeyframerule", g), a.addListener("startpagemargin", g), a.addListener("startpage", g), a.addListener("property", function (a) {
                var b = a.property.text.toLowerCase();
                d[b] && (e[b] = {value: a.value.text, line: a.property.line, col: a.property.col})
            }), a.addListener("endrule", h), a.addListener("endfontface", h), a.addListener("endkeyframerule", h), a.addListener("endpagemargin", h), a.addListener("endpage", h)
        }
    }), CSSLint.addRule({
        id: "duplicate-background-images",
        name: "Disallow duplicate background images",
        desc: "Every background-image should be unique. Use a common class for e.g. sprites.",
        browsers: "All",
        init: function (a, b) {
            var c = this, d = {};
            a.addListener("property", function (a) {
                var e = a.property.text, f = a.value, g, h;
                if (e.match(/background/i))for (g = 0, h = f.parts.length; g < h; g++)f.parts[g].type == "uri" && (typeof d[f.parts[g].uri] == "undefined" ? d[f.parts[g].uri] = a : b.report("Background image '" + f.parts[g].uri + "' was used multiple times, first declared at line " + d[f.parts[g].uri].line + ", col " + d[f.parts[g].uri].col + ".", a.line, a.col, c))
            })
        }
    }), CSSLint.addRule({
        id: "duplicate-properties",
        name: "Disallow duplicate properties",
        desc: "Duplicate properties must appear one after the other.",
        browsers: "All",
        init: function (a, b) {
            function f(a) {
                d = {}
            }

            var c = this, d, e;
            a.addListener("startrule", f), a.addListener("startfontface", f), a.addListener("startpage", f), a.addListener("startpagemargin", f), a.addListener("startkeyframerule", f), a.addListener("property", function (a) {
                var f = a.property, g = f.text.toLowerCase();
                d[g] && (e != g || d[g] == a.value.text) && b.report("Duplicate property '" + a.property + "' found.", a.line, a.col, c), d[g] = a.value.text, e = g
            })
        }
    }), CSSLint.addRule({
        id: "empty-rules",
        name: "Disallow empty rules",
        desc: "Rules without any properties specified should be removed.",
        browsers: "All",
        init: function (a, b) {
            var c = this, d = 0;
            a.addListener("startrule", function () {
                d = 0
            }), a.addListener("property", function () {
                d++
            }), a.addListener("endrule", function (a) {
                var e = a.selectors;
                d === 0 && b.report("Rule is empty.", e[0].line, e[0].col, c)
            })
        }
    }), CSSLint.addRule({
        id: "errors",
        name: "Parsing Errors",
        desc: "This rule looks for recoverable syntax errors.",
        browsers: "All",
        init: function (a, b) {
            var c = this;
            a.addListener("error", function (a) {
                b.error(a.message, a.line, a.col, c)
            })
        }
    }), CSSLint.addRule({
        id: "fallback-colors",
        name: "Require fallback colors",
        desc: "For older browsers that don't support RGBA, HSL, or HSLA, provide a fallback color.",
        browsers: "IE6,IE7,IE8",
        init: function (a, b) {
            function g(a) {
                f = {}, d = null
            }

            var c = this, d, e = {color: 1, background: 1, "background-color": 1}, f;
            a.addListener("startrule", g), a.addListener("startfontface", g), a.addListener("startpage", g), a.addListener("startpagemargin", g), a.addListener("startkeyframerule", g), a.addListener("property", function (a) {
                var f = a.property, g = f.text.toLowerCase(), h = a.value.parts, i = 0, j = "", k = h.length;
                if (e[g])while (i < k)h[i].type == "color" && ("alpha" in h[i] || "hue" in h[i] ? (/([^\)]+)\(/.test(h[i]) && (j = RegExp.$1.toUpperCase()), (!d || d.property.text.toLowerCase() != g || d.colorType != "compat") && b.report("Fallback " + g + " (hex or RGB) should precede " + j + " " + g + ".", a.line, a.col, c)) : a.colorType = "compat"), i++;
                d = a
            })
        }
    }), CSSLint.addRule({
        id: "floats",
        name: "Disallow too many floats",
        desc: "This rule tests if the float property is used too many times",
        browsers: "All",
        init: function (a, b) {
            var c = this, d = 0;
            a.addListener("property", function (a) {
                a.property.text.toLowerCase() == "float" && a.value.text.toLowerCase() != "none" && d++
            }), a.addListener("endstylesheet", function () {
                b.stat("floats", d), d >= 10 && b.rollupWarn("Too many floats (" + d + "), you're probably using them for layout. Consider using a grid system instead.", c)
            })
        }
    }), CSSLint.addRule({
        id: "font-faces",
        name: "Don't use too many web fonts",
        desc: "Too many different web fonts in the same stylesheet.",
        browsers: "All",
        init: function (a, b) {
            var c = this, d = 0;
            a.addListener("startfontface", function () {
                d++
            }), a.addListener("endstylesheet", function () {
                d > 5 && b.rollupWarn("Too many @font-face declarations (" + d + ").", c)
            })
        }
    }), CSSLint.addRule({
        id: "font-sizes",
        name: "Disallow too many font sizes",
        desc: "Checks the number of font-size declarations.",
        browsers: "All",
        init: function (a, b) {
            var c = this, d = 0;
            a.addListener("property", function (a) {
                a.property == "font-size" && d++
            }), a.addListener("endstylesheet", function () {
                b.stat("font-sizes", d), d >= 10 && b.rollupWarn("Too many font-size declarations (" + d + "), abstraction needed.", c)
            })
        }
    }), CSSLint.addRule({
        id: "gradients",
        name: "Require all gradient definitions",
        desc: "When using a vendor-prefixed gradient, make sure to use them all.",
        browsers: "All",
        init: function (a, b) {
            var c = this, d;
            a.addListener("startrule", function () {
                d = {moz: 0, webkit: 0, oldWebkit: 0, ms: 0, o: 0}
            }), a.addListener("property", function (a) {
                /\-(moz|ms|o|webkit)(?:\-(?:linear|radial))\-gradient/i.test(a.value) ? d[RegExp.$1] = 1 : /\-webkit\-gradient/i.test(a.value) && (d.oldWebkit = 1)
            }), a.addListener("endrule", function (a) {
                var e = [];
                d.moz || e.push("Firefox 3.6+"), d.webkit || e.push("Webkit (Safari 5+, Chrome)"), d.oldWebkit || e.push("Old Webkit (Safari 4+, Chrome)"), d.ms || e.push("Internet Explorer 10+"), d.o || e.push("Opera 11.1+"), e.length && e.length < 5 && b.report("Missing vendor-prefixed CSS gradients for " + e.join(", ") + ".", a.selectors[0].line, a.selectors[0].col, c)
            })
        }
    }), CSSLint.addRule({
        id: "ids",
        name: "Disallow IDs in selectors",
        desc: "Selectors should not contain IDs.",
        browsers: "All",
        init: function (a, b) {
            var c = this;
            a.addListener("startrule", function (d) {
                var e = d.selectors, f, g, h, i, j, k, l;
                for (j = 0; j < e.length; j++) {
                    f = e[j], i = 0;
                    for (k = 0; k < f.parts.length; k++) {
                        g = f.parts[k];
                        if (g.type == a.SELECTOR_PART_TYPE)for (l = 0; l < g.modifiers.length; l++)h = g.modifiers[l], h.type == "id" && i++
                    }
                    i == 1 ? b.report("Don't use IDs in selectors.", f.line, f.col, c) : i > 1 && b.report(i + " IDs in the selector, really?", f.line, f.col, c)
                }
            })
        }
    }), CSSLint.addRule({
        id: "import",
        name: "Disallow @import",
        desc: "Don't use @import, use <link> instead.",
        browsers: "All",
        init: function (a, b) {
            var c = this;
            a.addListener("import", function (a) {
                b.report("@import prevents parallel downloads, use <link> instead.", a.line, a.col, c)
            })
        }
    }), CSSLint.addRule({
        id: "important",
        name: "Disallow !important",
        desc: "Be careful when using !important declaration",
        browsers: "All",
        init: function (a, b) {
            var c = this, d = 0;
            a.addListener("property", function (a) {
                a.important === !0 && (d++, b.report("Use of !important", a.line, a.col, c))
            }), a.addListener("endstylesheet", function () {
                b.stat("important", d), d >= 10 && b.rollupWarn("Too many !important declarations (" + d + "), try to use less than 10 to avoid specifity issues.", c)
            })
        }
    }), CSSLint.addRule({
        id: "known-properties",
        name: "Require use of known properties",
        desc: "Properties should be known (listed in CSS specification) or be a vendor-prefixed property.",
        browsers: "All",
        init: function (a, b) {
            var c = this, d = {
                "alignment-adjust": 1,
                "alignment-baseline": 1,
                animation: 1,
                "animation-delay": 1,
                "animation-direction": 1,
                "animation-duration": 1,
                "animation-fill-mode": 1,
                "animation-iteration-count": 1,
                "animation-name": 1,
                "animation-play-state": 1,
                "animation-timing-function": 1,
                appearance: 1,
                azimuth: 1,
                "backface-visibility": 1,
                background: 1,
                "background-attachment": 1,
                "background-break": 1,
                "background-clip": 1,
                "background-color": 1,
                "background-image": 1,
                "background-origin": 1,
                "background-position": 1,
                "background-repeat": 1,
                "background-size": 1,
                "baseline-shift": 1,
                binding: 1,
                bleed: 1,
                "bookmark-label": 1,
                "bookmark-level": 1,
                "bookmark-state": 1,
                "bookmark-target": 1,
                border: 1,
                "border-bottom": 1,
                "border-bottom-color": 1,
                "border-bottom-left-radius": 1,
                "border-bottom-right-radius": 1,
                "border-bottom-style": 1,
                "border-bottom-width": 1,
                "border-collapse": 1,
                "border-color": 1,
                "border-image": 1,
                "border-image-outset": 1,
                "border-image-repeat": 1,
                "border-image-slice": 1,
                "border-image-source": 1,
                "border-image-width": 1,
                "border-left": 1,
                "border-left-color": 1,
                "border-left-style": 1,
                "border-left-width": 1,
                "border-radius": 1,
                "border-right": 1,
                "border-right-color": 1,
                "border-right-style": 1,
                "border-right-width": 1,
                "border-spacing": 1,
                "border-style": 1,
                "border-top": 1,
                "border-top-color": 1,
                "border-top-left-radius": 1,
                "border-top-right-radius": 1,
                "border-top-style": 1,
                "border-top-width": 1,
                "border-width": 1,
                bottom: 1,
                "box-align": 1,
                "box-decoration-break": 1,
                "box-direction": 1,
                "box-flex": 1,
                "box-flex-group": 1,
                "box-lines": 1,
                "box-ordinal-group": 1,
                "box-orient": 1,
                "box-pack": 1,
                "box-shadow": 1,
                "box-sizing": 1,
                "break-after": 1,
                "break-before": 1,
                "break-inside": 1,
                "caption-side": 1,
                clear: 1,
                clip: 1,
                color: 1,
                "color-profile": 1,
                "column-count": 1,
                "column-fill": 1,
                "column-gap": 1,
                "column-rule": 1,
                "column-rule-color": 1,
                "column-rule-style": 1,
                "column-rule-width": 1,
                "column-span": 1,
                "column-width": 1,
                columns: 1,
                content: 1,
                "counter-increment": 1,
                "counter-reset": 1,
                crop: 1,
                cue: 1,
                "cue-after": 1,
                "cue-before": 1,
                cursor: 1,
                direction: 1,
                display: 1,
                "dominant-baseline": 1,
                "drop-initial-after-adjust": 1,
                "drop-initial-after-align": 1,
                "drop-initial-before-adjust": 1,
                "drop-initial-before-align": 1,
                "drop-initial-size": 1,
                "drop-initial-value": 1,
                elevation: 1,
                "empty-cells": 1,
                fit: 1,
                "fit-position": 1,
                "float": 1,
                "float-offset": 1,
                font: 1,
                "font-family": 1,
                "font-size": 1,
                "font-size-adjust": 1,
                "font-stretch": 1,
                "font-style": 1,
                "font-variant": 1,
                "font-weight": 1,
                "grid-columns": 1,
                "grid-rows": 1,
                "hanging-punctuation": 1,
                height: 1,
                "hyphenate-after": 1,
                "hyphenate-before": 1,
                "hyphenate-character": 1,
                "hyphenate-lines": 1,
                "hyphenate-resource": 1,
                hyphens: 1,
                icon: 1,
                "image-orientation": 1,
                "image-rendering": 1,
                "image-resolution": 1,
                "inline-box-align": 1,
                left: 1,
                "letter-spacing": 1,
                "line-height": 1,
                "line-stacking": 1,
                "line-stacking-ruby": 1,
                "line-stacking-shift": 1,
                "line-stacking-strategy": 1,
                "list-style": 1,
                "list-style-image": 1,
                "list-style-position": 1,
                "list-style-type": 1,
                margin: 1,
                "margin-bottom": 1,
                "margin-left": 1,
                "margin-right": 1,
                "margin-top": 1,
                mark: 1,
                "mark-after": 1,
                "mark-before": 1,
                marks: 1,
                "marquee-direction": 1,
                "marquee-play-count": 1,
                "marquee-speed": 1,
                "marquee-style": 1,
                "max-height": 1,
                "max-width": 1,
                "min-height": 1,
                "min-width": 1,
                "move-to": 1,
                "nav-down": 1,
                "nav-index": 1,
                "nav-left": 1,
                "nav-right": 1,
                "nav-up": 1,
                opacity: 1,
                orphans: 1,
                outline: 1,
                "outline-color": 1,
                "outline-offset": 1,
                "outline-style": 1,
                "outline-width": 1,
                overflow: 1,
                "overflow-style": 1,
                "overflow-x": 1,
                "overflow-y": 1,
                padding: 1,
                "padding-bottom": 1,
                "padding-left": 1,
                "padding-right": 1,
                "padding-top": 1,
                page: 1,
                "page-break-after": 1,
                "page-break-before": 1,
                "page-break-inside": 1,
                "page-policy": 1,
                pause: 1,
                "pause-after": 1,
                "pause-before": 1,
                perspective: 1,
                "perspective-origin": 1,
                phonemes: 1,
                pitch: 1,
                "pitch-range": 1,
                "play-during": 1,
                position: 1,
                "presentation-level": 1,
                "punctuation-trim": 1,
                quotes: 1,
                "rendering-intent": 1,
                resize: 1,
                rest: 1,
                "rest-after": 1,
                "rest-before": 1,
                richness: 1,
                right: 1,
                rotation: 1,
                "rotation-point": 1,
                "ruby-align": 1,
                "ruby-overhang": 1,
                "ruby-position": 1,
                "ruby-span": 1,
                size: 1,
                speak: 1,
                "speak-header": 1,
                "speak-numeral": 1,
                "speak-punctuation": 1,
                "speech-rate": 1,
                stress: 1,
                "string-set": 1,
                "table-layout": 1,
                target: 1,
                "target-name": 1,
                "target-new": 1,
                "target-position": 1,
                "text-align": 1,
                "text-align-last": 1,
                "text-decoration": 1,
                "text-emphasis": 1,
                "text-height": 1,
                "text-indent": 1,
                "text-justify": 1,
                "text-outline": 1,
                "text-shadow": 1,
                "text-transform": 1,
                "text-wrap": 1,
                top: 1,
                transform: 1,
                "transform-origin": 1,
                "transform-style": 1,
                transition: 1,
                "transition-delay": 1,
                "transition-duration": 1,
                "transition-property": 1,
                "transition-timing-function": 1,
                "unicode-bidi": 1,
                "user-modify": 1,
                "user-select": 1,
                "vertical-align": 1,
                visibility: 1,
                "voice-balance": 1,
                "voice-duration": 1,
                "voice-family": 1,
                "voice-pitch": 1,
                "voice-pitch-range": 1,
                "voice-rate": 1,
                "voice-stress": 1,
                "voice-volume": 1,
                volume: 1,
                "white-space": 1,
                "white-space-collapse": 1,
                widows: 1,
                width: 1,
                "word-break": 1,
                "word-spacing": 1,
                "word-wrap": 1,
                "z-index": 1,
                filter: 1,
                zoom: 1,
                src: 1
            };
            a.addListener("property", function (a) {
                var d = a.property.text.toLowerCase();
                a.invalid && b.report(a.invalid.message, a.line, a.col, c)
            })
        }
    }), CSSLint.addRule({
        id: "outline-none",
        name: "Disallow outline: none",
        desc: "Use of outline: none or outline: 0 should be limited to :focus rules.",
        browsers: "All",
        tags: ["Accessibility"],
        init: function (a, b) {
            function e(a) {
                a.selectors ? d = {
                    line: a.line,
                    col: a.col,
                    selectors: a.selectors,
                    propCount: 0,
                    outline: !1
                } : d = null
            }

            function f(a) {
                d && d.outline && (d.selectors.toString().toLowerCase().indexOf(":focus") == -1 ? b.report("Outlines should only be modified using :focus.", d.line, d.col, c) : d.propCount == 1 && b.report("Outlines shouldn't be hidden unless other visual changes are made.", d.line, d.col, c))
            }

            var c = this, d;
            a.addListener("startrule", e), a.addListener("startfontface", e), a.addListener("startpage", e), a.addListener("startpagemargin", e), a.addListener("startkeyframerule", e), a.addListener("property", function (a) {
                var b = a.property.text.toLowerCase(), c = a.value;
                d && (d.propCount++, b == "outline" && (c == "none" || c == "0") && (d.outline = !0))
            }), a.addListener("endrule", f), a.addListener("endfontface", f), a.addListener("endpage", f), a.addListener("endpagemargin", f), a.addListener("endkeyframerule", f)
        }
    }), CSSLint.addRule({
        id: "overqualified-elements",
        name: "Disallow overqualified elements",
        desc: "Don't use classes or IDs with elements (a.foo or a#foo).",
        browsers: "All",
        init: function (a, b) {
            var c = this, d = {};
            a.addListener("startrule", function (e) {
                var f = e.selectors, g, h, i, j, k, l;
                for (j = 0; j < f.length; j++) {
                    g = f[j];
                    for (k = 0; k < g.parts.length; k++) {
                        h = g.parts[k];
                        if (h.type == a.SELECTOR_PART_TYPE)for (l = 0; l < h.modifiers.length; l++)i = h.modifiers[l], h.elementName && i.type == "id" ? b.report("Element (" + h + ") is overqualified, just use " + i + " without element name.", h.line, h.col, c) : i.type == "class" && (d[i] || (d[i] = []), d[i].push({
                            modifier: i,
                            part: h
                        }))
                    }
                }
            }), a.addListener("endstylesheet", function () {
                var a;
                for (a in d)d.hasOwnProperty(a) && d[a].length == 1 && d[a][0].part.elementName && b.report("Element (" + d[a][0].part + ") is overqualified, just use " + d[a][0].modifier + " without element name.", d[a][0].part.line, d[a][0].part.col, c)
            })
        }
    }), CSSLint.addRule({
        id: "qualified-headings",
        name: "Disallow qualified headings",
        desc: "Headings should not be qualified (namespaced).",
        browsers: "All",
        init: function (a, b) {
            var c = this;
            a.addListener("startrule", function (d) {
                var e = d.selectors, f, g, h, i;
                for (h = 0; h < e.length; h++) {
                    f = e[h];
                    for (i = 0; i < f.parts.length; i++)g = f.parts[i], g.type == a.SELECTOR_PART_TYPE && g.elementName && /h[1-6]/.test(g.elementName.toString()) && i > 0 && b.report("Heading (" + g.elementName + ") should not be qualified.", g.line, g.col, c)
                }
            })
        }
    }), CSSLint.addRule({
        id: "regex-selectors",
        name: "Disallow selectors that look like regexs",
        desc: "Selectors that look like regular expressions are slow and should be avoided.",
        browsers: "All",
        init: function (a, b) {
            var c = this;
            a.addListener("startrule", function (d) {
                var e = d.selectors, f, g, h, i, j, k;
                for (i = 0; i < e.length; i++) {
                    f = e[i];
                    for (j = 0; j < f.parts.length; j++) {
                        g = f.parts[j];
                        if (g.type == a.SELECTOR_PART_TYPE)for (k = 0; k < g.modifiers.length; k++)h = g.modifiers[k], h.type == "attribute" && /([\~\|\^\$\*]=)/.test(h) && b.report("Attribute selectors with " + RegExp.$1 + " are slow!", h.line, h.col, c)
                    }
                }
            })
        }
    }), CSSLint.addRule({
        id: "rules-count",
        name: "Rules Count",
        desc: "Track how many rules there are.",
        browsers: "All",
        init: function (a, b) {
            var c = this, d = 0;
            a.addListener("startrule", function () {
                d++
            }), a.addListener("endstylesheet", function () {
                b.stat("rule-count", d)
            })
        }
    }), CSSLint.addRule({
        id: "shorthand",
        name: "Require shorthand properties",
        desc: "Use shorthand properties where possible.",
        browsers: "All",
        init: function (a, b) {
            function j(a) {
                h = {}
            }

            function k(a) {
                var d, e, f, g;
                for (d in i)if (i.hasOwnProperty(d)) {
                    g = 0;
                    for (e = 0, f = i[d].length; e < f; e++)g += h[i[d][e]] ? 1 : 0;
                    g == i[d].length && b.report("The properties " + i[d].join(", ") + " can be replaced by " + d + ".", a.line, a.col, c)
                }
            }

            var c = this, d, e, f, g = {}, h, i = {
                margin: ["margin-top", "margin-bottom", "margin-left", "margin-right"],
                padding: ["padding-top", "padding-bottom", "padding-left", "padding-right"]
            };
            for (d in i)if (i.hasOwnProperty(d))for (e = 0, f = i[d].length; e < f; e++)g[i[d][e]] = d;
            a.addListener("startrule", j), a.addListener("startfontface", j), a.addListener("property", function (a) {
                var b = a.property.toString().toLowerCase(), c = a.value.parts[0].value;
                g[b] && (h[b] = 1)
            }), a.addListener("endrule", k), a.addListener("endfontface", k)
        }
    }), CSSLint.addRule({
        id: "text-indent",
        name: "Disallow negative text-indent",
        desc: "Checks for text indent less than -99px",
        browsers: "All",
        init: function (a, b) {
            function e(a) {
                d = !1
            }

            function f(a) {
                d && b.report("Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set direction for that item to ltr.", d.line, d.col, c)
            }

            var c = this, d = !1;
            a.addListener("startrule", e), a.addListener("startfontface", e), a.addListener("property", function (a) {
                var b = a.property.toString().toLowerCase(), c = a.value;
                b == "text-indent" && c.parts[0].value < -99 ? d = a.property : b == "direction" && c == "ltr" && (d = !1)
            }), a.addListener("endrule", f), a.addListener("endfontface", f)
        }
    }), CSSLint.addRule({
        id: "unique-headings",
        name: "Headings should only be defined once",
        desc: "Headings should be defined only once.",
        browsers: "All",
        init: function (a, b) {
            var c = this, d = {h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0};
            a.addListener("startrule", function (a) {
                var e = a.selectors, f, g, h, i, j;
                for (i = 0; i < e.length; i++) {
                    f = e[i], g = f.parts[f.parts.length - 1];
                    if (g.elementName && /(h[1-6])/i.test(g.elementName.toString())) {
                        for (j = 0; j < g.modifiers.length; j++)if (g.modifiers[j].type == "pseudo") {
                            h = !0;
                            break
                        }
                        h || (d[RegExp.$1]++, d[RegExp.$1] > 1 && b.report("Heading (" + g.elementName + ") has already been defined.", g.line, g.col, c))
                    }
                }
            }), a.addListener("endstylesheet", function (a) {
                var e, f = [];
                for (e in d)d.hasOwnProperty(e) && d[e] > 1 && f.push(d[e] + " " + e + "s");
                f.length && b.rollupWarn("You have " + f.join(", ") + " defined in this stylesheet.", c)
            })
        }
    }), CSSLint.addRule({
        id: "universal-selector",
        name: "Disallow universal selector",
        desc: "The universal selector (*) is known to be slow.",
        browsers: "All",
        init: function (a, b) {
            var c = this;
            a.addListener("startrule", function (a) {
                var d = a.selectors, e, f, g, h, i, j;
                for (h = 0; h < d.length; h++)e = d[h], f = e.parts[e.parts.length - 1], f.elementName == "*" && b.report(c.desc, f.line, f.col, c)
            })
        }
    }), CSSLint.addRule({
        id: "unqualified-attributes",
        name: "Disallow unqualified attribute selectors",
        desc: "Unqualified attribute selectors are known to be slow.",
        browsers: "All",
        init: function (a, b) {
            var c = this;
            a.addListener("startrule", function (d) {
                var e = d.selectors, f, g, h, i, j, k;
                for (i = 0; i < e.length; i++) {
                    f = e[i], g = f.parts[f.parts.length - 1];
                    if (g.type == a.SELECTOR_PART_TYPE)for (k = 0; k < g.modifiers.length; k++)h = g.modifiers[k], h.type == "attribute" && (!g.elementName || g.elementName == "*") && b.report(c.desc, g.line, g.col, c)
                }
            })
        }
    }), CSSLint.addRule({
        id: "vendor-prefix",
        name: "Require standard property with vendor prefix",
        desc: "When using a vendor-prefixed property, make sure to include the standard one.",
        browsers: "All",
        init: function (a, b) {
            function g() {
                d = {}, e = 1
            }

            function h(a) {
                var e, g, h, i, j, k, l = [];
                for (e in d)f[e] && l.push({actual: e, needed: f[e]});
                for (g = 0, h = l.length; g < h; g++)j = l[g].needed, k = l[g].actual, d[j] ? d[j][0].pos < d[k][0].pos && b.report("Standard property '" + j + "' should come after vendor-prefixed property '" + k + "'.", d[k][0].name.line, d[k][0].name.col, c) : b.report("Missing standard property '" + j + "' to go along with '" + k + "'.", d[k][0].name.line, d[k][0].name.col, c)
            }

            var c = this, d, e, f = {
                "-webkit-border-radius": "border-radius",
                "-webkit-border-top-left-radius": "border-top-left-radius",
                "-webkit-border-top-right-radius": "border-top-right-radius",
                "-webkit-border-bottom-left-radius": "border-bottom-left-radius",
                "-webkit-border-bottom-right-radius": "border-bottom-right-radius",
                "-o-border-radius": "border-radius",
                "-o-border-top-left-radius": "border-top-left-radius",
                "-o-border-top-right-radius": "border-top-right-radius",
                "-o-border-bottom-left-radius": "border-bottom-left-radius",
                "-o-border-bottom-right-radius": "border-bottom-right-radius",
                "-moz-border-radius": "border-radius",
                "-moz-border-radius-topleft": "border-top-left-radius",
                "-moz-border-radius-topright": "border-top-right-radius",
                "-moz-border-radius-bottomleft": "border-bottom-left-radius",
                "-moz-border-radius-bottomright": "border-bottom-right-radius",
                "-moz-column-count": "column-count",
                "-webkit-column-count": "column-count",
                "-moz-column-gap": "column-gap",
                "-webkit-column-gap": "column-gap",
                "-moz-column-rule": "column-rule",
                "-webkit-column-rule": "column-rule",
                "-moz-column-rule-style": "column-rule-style",
                "-webkit-column-rule-style": "column-rule-style",
                "-moz-column-rule-color": "column-rule-color",
                "-webkit-column-rule-color": "column-rule-color",
                "-moz-column-rule-width": "column-rule-width",
                "-webkit-column-rule-width": "column-rule-width",
                "-moz-column-width": "column-width",
                "-webkit-column-width": "column-width",
                "-webkit-column-span": "column-span",
                "-webkit-columns": "columns",
                "-moz-box-shadow": "box-shadow",
                "-webkit-box-shadow": "box-shadow",
                "-moz-transform": "transform",
                "-webkit-transform": "transform",
                "-o-transform": "transform",
                "-ms-transform": "transform",
                "-moz-transform-origin": "transform-origin",
                "-webkit-transform-origin": "transform-origin",
                "-o-transform-origin": "transform-origin",
                "-ms-transform-origin": "transform-origin",
                "-moz-box-sizing": "box-sizing",
                "-webkit-box-sizing": "box-sizing",
                "-moz-user-select": "user-select",
                "-khtml-user-select": "user-select",
                "-webkit-user-select": "user-select"
            };
            a.addListener("startrule", g), a.addListener("startfontface", g), a.addListener("startpage", g), a.addListener("startpagemargin", g), a.addListener("startkeyframerule", g), a.addListener("property", function (a) {
                var b = a.property.text.toLowerCase();
                d[b] || (d[b] = []), d[b].push({name: a.property, value: a.value, pos: e++})
            }), a.addListener("endrule", h), a.addListener("endfontface", h), a.addListener("endpage", h), a.addListener("endpagemargin", h), a.addListener("endkeyframerule", h)
        }
    }), CSSLint.addRule({
        id: "zero-units",
        name: "Disallow units for 0 values",
        desc: "You don't need to specify units when a value is 0.",
        browsers: "All",
        init: function (a, b) {
            var c = this;
            a.addListener("property", function (a) {
                var d = a.value.parts, e = 0, f = d.length;
                while (e < f)(d[e].units || d[e].type == "percentage") && d[e].value === 0 && d[e].type != "time" && b.report("Values of 0 shouldn't have units specified.", d[e].line, d[e].col, c), e++
            })
        }
    }), CSSLint.addFormatter({
        id: "checkstyle-xml", name: "Checkstyle XML format", startFormat: function () {
            return '<?xml version="1.0" encoding="utf-8"?><checkstyle>'
        }, endFormat: function () {
            return "</checkstyle>"
        }, formatResults: function (a, b, c) {
            var d = a.messages, e = [], f = function (a) {
                return !!a && "name" in a ? "net.csslint." + a.name.replace(/\s/g, "") : ""
            }, g = function (a) {
                return !a || a.constructor !== String ? "" : a.replace(/\"/g, "'").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            };
            return d.length > 0 && (e.push('<file name="' + b + '">'), CSSLint.Util.forEach(d, function (a, b) {
                a.rollup || e.push('<error line="' + a.line + '" column="' + a.col + '" severity="' + a.type + '"' + ' message="' + g(a.message) + '" source="' + f(a.rule) + '"/>')
            }), e.push("</file>")), e.join("")
        }
    }), CSSLint.addFormatter({
        id: "compact", name: "Compact, 'porcelain' format", startFormat: function () {
            return ""
        }, endFormat: function () {
            return ""
        }, formatResults: function (a, b, c) {
            var d = a.messages, e = "";
            c = c || {};
            var f = function (a) {
                return a.charAt(0).toUpperCase() + a.slice(1)
            };
            return d.length === 0 ? c.quiet ? "" : b + ": Lint Free!" : (CSSLint.Util.forEach(d, function (a, c) {
                a.rollup ? e += b + ": " + f(a.type) + " - " + a.message + "\n" : e += b + ": " + "line " + a.line + ", col " + a.col + ", " + f(a.type) + " - " + a.message + "\n"
            }), e)
        }
    }), CSSLint.addFormatter({
        id: "csslint-xml", name: "CSSLint XML format", startFormat: function () {
            return '<?xml version="1.0" encoding="utf-8"?><csslint>'
        }, endFormat: function () {
            return "</csslint>"
        }, formatResults: function (a, b, c) {
            var d = a.messages, e = [], f = function (a) {
                return !a || a.constructor !== String ? "" : a.replace(/\"/g, "'").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            };
            return d.length > 0 && (e.push('<file name="' + b + '">'), CSSLint.Util.forEach(d, function (a, b) {
                a.rollup ? e.push('<issue severity="' + a.type + '" reason="' + f(a.message) + '" evidence="' + f(a.evidence) + '"/>') : e.push('<issue line="' + a.line + '" char="' + a.col + '" severity="' + a.type + '"' + ' reason="' + f(a.message) + '" evidence="' + f(a.evidence) + '"/>')
            }), e.push("</file>")), e.join("")
        }
    }), CSSLint.addFormatter({
        id: "lint-xml", name: "Lint XML format", startFormat: function () {
            return '<?xml version="1.0" encoding="utf-8"?><lint>'
        }, endFormat: function () {
            return "</lint>"
        }, formatResults: function (a, b, c) {
            var d = a.messages, e = [], f = function (a) {
                return !a || a.constructor !== String ? "" : a.replace(/\"/g, "'").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            };
            return d.length > 0 && (e.push('<file name="' + b + '">'), CSSLint.Util.forEach(d, function (a, b) {
                a.rollup ? e.push('<issue severity="' + a.type + '" reason="' + f(a.message) + '" evidence="' + f(a.evidence) + '"/>') : e.push('<issue line="' + a.line + '" char="' + a.col + '" severity="' + a.type + '"' + ' reason="' + f(a.message) + '" evidence="' + f(a.evidence) + '"/>')
            }), e.push("</file>")), e.join("")
        }
    }), CSSLint.addFormatter({
        id: "text", name: "Plain Text", startFormat: function () {
            return ""
        }, endFormat: function () {
            return ""
        }, formatResults: function (a, b, c) {
            var d = a.messages, e = "";
            c = c || {};
            if (d.length === 0)return c.quiet ? "" : "\n\ncsslint: No errors in " + b + ".";
            e = "\n\ncsslint: There are " + d.length + " problems in " + b + ".";
            var f = b.lastIndexOf("/"), g = b;
            return f === -1 && (f = b.lastIndexOf("\\")), f > -1 && (g = b.substring(f + 1)), CSSLint.Util.forEach(d, function (a, b) {
                e = e + "\n\n" + g, a.rollup ? (e += "\n" + (b + 1) + ": " + a.type, e += "\n" + a.message) : (e += "\n" + (b + 1) + ": " + a.type + " at line " + a.line + ", col " + a.col, e += "\n" + a.message, e += "\n" + a.evidence)
            }), e
        }
    }), exports.CSSLint = CSSLint
})