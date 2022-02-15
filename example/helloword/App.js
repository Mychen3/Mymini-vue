import { h } from '../../lib/guide-mini-vue.esm.js'

   // <template>最终会编译成render函数
export const App = {
    render() {
        return h("div", "hi, " + this.msg);
    },
    setup() {
        //composition api
        return {
            msg: "mini-vue",
        };
    }
}