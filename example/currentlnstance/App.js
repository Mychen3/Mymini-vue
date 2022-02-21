import { h, getCurrentInstance } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'
window.self = null
// <template>最终会编译成render函数
export const App = {
    // 插槽 
    name: 'App',
    render() {
        return h("div", {}, [h("p", {}, 'currentInstance demo'), h(Foo)]);
    },


    setup() {
        const instance = getCurrentInstance()
        //composition api
        console.log("app:",instance);
        return {
            msg: "mini-vue",
        };
    }
}