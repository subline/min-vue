import Compile from './compile'
import Observe from './observe'

export default class Vue {
    constructor(option) {
        this.$el = option.el
        this.$data = option.data || {}
        this.$el && new Compile(this)
        this.$el && new Observe(this.$data)
    }
}