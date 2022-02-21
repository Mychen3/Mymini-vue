import { h,createTextVnode } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'
window.self = null
// <template>最终会编译成render函数
export const App = {
    // 插槽 
    name: 'App',
    render() {
        const app = h("div", {}, "App");
        const foo = h(Foo, {}, {
            header: ({ age }) => [h("p", {}, "header" + age),createTextVnode('text节点渲染')],
            footer: () => h("p", {}, "footer" + this.msg)
        });
        return h("div", {}, [app, foo])
    },

    // render() {
    //     window.self = this
    //     return h("div", {
    //         id: "root",
    //         class: ["red", "hard"],
    //         // onClick() {
    //         //     console.log('click')
    //         // },
    //         // onMousedown() {
    //         //     console.log('mousedown')
    //         // }
    //     },
    //         [h("div", { ss: '牛逼class' }, "hi" + this.msg), h(Foo,
    //             // on + Event
    //             {
    //                 onAdd(a,b) {
    //                    console.log('onAdd',a,b)
    //                 },
    //                 // add-foo => addFoo 
    //                 // 横杆写法转变了
    //                 addFoo(a,b) {
    //                     console.log('onAdd',a,b)
    //                  }

    //             }, '牛逼')]
    //         //   string 
    //         //  "hi, " + this.msg
    //         //array 类型
    //         //    [ h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "蓝色")]  

    //     );
    // },
    setup() {
        //composition api
        return {
            msg: "mini-vue",
        };
    }
}