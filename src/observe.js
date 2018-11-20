export default class Observe {
    constructor(data) {
        this.data = data
        this.loop(data)
    }
    loop(data) {
        if (toString.call(data) === '[object Object]') {
            Object.keys(data).forEach(key => {
                this.defineProperty(data, key, data[key])
                this.loop(data[key])
            })
        }
    }
    defineProperty(data, key, value) {
        let self = this
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
                value = newVal
                self.loop(newVal)
            }
        })
    }
}