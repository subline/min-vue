import {regs, directiveType} from './util.js'
const compileUtil = {
    text(data, node, value = '') {
        let res = data
        value.split(".").forEach(item => {
            res = res[item]
        })
        node.textContent = res
    },
    html(data, node, value = '') {
        let res = data
        value.split(".").forEach(item => {
            res = data[item]
        })
        node.innerHTML = res
    },
    event(data, node, value = '') {
        node.addEventListener('')
    }
}

export default class Compile {
    constructor(vm) {
        this.vm = vm
        this.el = document.querySelector(vm.$el)
        this.data = vm.$data || {}
        if(this.el) {
            // 1. 把el 中的子节点放入到内存中， fragment
            let fragment = this.node2fragment(this.el)
            // 2. 编译fragment
            this.compile(fragment)
            // 3. 编译好的fragment 插入到el中
            this.el.appendChild(fragment)
        }
    }
    node2fragment(node) {
        let fragment = document.createDocumentFragment()
        let childNodes = node.childNodes
        Array.from(childNodes).forEach(v => {
            fragment.appendChild(v)
        })
        return fragment
    }
    compile(fragment) {
        let childNodes = fragment.childNodes
        Array.from(childNodes).forEach(node => {
            if(node.childNodes && node.childNodes.length) {
                this.compile(node)
            } else {
                if(this.isTextNode(node)) {
                    
                    this.compileText(node)

                } else if (this.isElementNode(node)) {
                    // 解析html
                    this.compileEle(node)
                }
            }
        })
    }
    compileText(node) {
        let text = node.textContent
        if (regs.interpolationReg.test(text)) {
            let res = this.data
            RegExp.$1.split(".").forEach(v => {
                res = res[v]
            })
            node.textContent = res
        }
    }
    compileEle(node) {
        
        let attributes = node.attributes
        let key = ''
       
        Array.from(attributes).forEach(attr => {
            key = attr.name

            if (regs.directiveShortReg.test(attr.name)) {
                key = key.replace(RegExp.$1, directiveType[RegExp.$1])
            }

            if (regs.directiveReg.test(key)) {
                if (key.startsWith("v-on:")) {
                    compileUtil.event(this.data, node, attr.value)
                } else {
                    compileUtil[RegExp.$1] && compileUtil[RegExp.$1](this.data, node, attr.value)
                }
            } 
        })
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