export const regs = {
    // 匹配指令缩写 (: || @)
    directiveShortReg: /^(\:|\@)\w+/,
    // 匹配指令
    directiveReg: /^v-(\w+)/,
    // 匹配对象( [] => .)
    replaceObjReg: /\[\S?(\w+)\S?\]/,
    // 匹配插值表达式
    interpolationReg: /\{\{(\w+)\}\}/
}

export const directiveType = {
    ':': 'v-bind:',
    '@': 'v-on'
}