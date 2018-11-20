(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.myVue = factory());
}(this, (function () { 'use strict';

    const regs = {
        // 匹配指令缩写 (: || @)
        directiveShortReg: /^(\:|\@)\w+/,
        // 匹配指令
        directiveReg: /^v-(\w+)/,
        // 匹配对象( [] => .)
        replaceObjReg: /\[\S?(\w+)\S?\]/,
        // 匹配插值表达式
        interpolationReg: /\{\{(\w+)\}\}/
    };

    const directiveType = {
        ':': 'v-bind:',
        '@': 'v-on'
    };

    const compileUtil = {
        text(data, node, value = '') {
            let res = data;
            value.split(".").forEach(item => {
                res = res[item];
            });
            node.textContent = res;
        },
        html(data, node, value = '') {
            let res = data;
            value.split(".").forEach(item => {
                res = data[item];
            });
            node.innerHTML = res;
        },
        event(data, node, value = '') {
            node.addEventListener('');
        }
    };

    class Compile {
        constructor(vm) {
            this.vm = vm;
            this.el = document.querySelector(vm.$el);
            this.data = vm.$data || {};
            if(this.el) {
                // 1. 把el 中的子节点放入到内存中， fragment
                let fragment = this.node2fragment(this.el);
                // 2. 编译fragment
                this.compile(fragment);
                // 3. 编译好的fragment 插入到el中
                this.el.appendChild(fragment);
            }
        }
        node2fragment(node) {
            let fragment = document.createDocumentFragment();
            let childNodes = node.childNodes;
            Array.from(childNodes).forEach(v => {
                fragment.appendChild(v);
            });
            return fragment
        }
        compile(fragment) {
            let childNodes = fragment.childNodes;
            Array.from(childNodes).forEach(node => {
                if(node.childNodes && node.childNodes.length) {
                    this.compile(node);
                } else {
                    if(this.isTextNode(node)) {
                        
                        this.compileText(node);

                    } else if (this.isElementNode(node)) {
                        // 解析html
                        this.compileEle(node);
                    }
                }
            });
        }
        compileText(node) {
            let text = node.textContent;
            if (regs.interpolationReg.test(text)) {
                let res = this.data;
                RegExp.$1.split(".").forEach(v => {
                    res = res[v];
                });
                node.textContent = res;
            }
        }
        compileEle(node) {
            
            let attributes = node.attributes;
            let key = '';
           
            Array.from(attributes).forEach(attr => {
                key = attr.name;

                if (regs.directiveShortReg.test(attr.name)) {
                    key = key.replace(RegExp.$1, directiveType[RegExp.$1]);
                }

                if (regs.directiveReg.test(key)) {
                    if (key.startsWith("v-on:")) {
                        compileUtil.event(this.data, node, attr.value);
                    } else {
                        compileUtil[RegExp.$1] && compileUtil[RegExp.$1](this.data, node, attr.value);
                    }
                } 
            });
        }
        /**
         * 文本节点
         * @param node 
         */
        isTextNode(node) {
            return node.nodeType === 3
        }
        /**
         * dom节点
         * @param node 
         */
        isElementNode(node) {
            return node.nodeType === 1
        }
    }

    class Observe {
        constructor(data) {
            this.data = data;
            this.loop(data);
        }
        loop(data) {
            if (toString.call(data) === '[object Object]') {
                Object.keys(data).forEach(key => {
                    this.defineProperty(data, key, data[key]);
                    this.loop(data[key]);
                });
            }
        }
        defineProperty(data, key, value) {
            let self = this;
            Object.defineProperty(data, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return value
                },
                set(newVal) {
                    if (value === newVal) {
                        return
                    }
                    value = newVal;
                    self.loop(newVal);
                }
            });
        }
    }

    class Vue {
        constructor(option) {
            this.$el = option.el;
            this.$data = option.data || {};
            this.$el && new Compile(this);
            this.$el && new Observe(this.$data);
        }
    }

    return Vue;

})));
