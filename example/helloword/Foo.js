import { h, renderSlots } from '../../lib/guide-mini-vue.esm.js'

// export const Foo = {

//     setup(props, { emit }) {

//         const emitAdd = () => {
//             // console.log("emit add")
//             // emit("add", 1, 2);
//             // add-foo
//             emit("add-foo", 5, 6);
//         }

//         return {
//             emitAdd
//         }

//     },
//     render() {
//         const btn = h("button", {
//             onClick: this.emitAdd
//         },
//             "emitAdd"
//         );
//         const foo = h("p", {}, "foo")
//         return h("div", {}, [foo, btn])
//     }


// }

// 插槽

export const Foo = {
    setup() {
        return {};
    },
    render() {
        const foo = h("p", {}, "foo");

        // Foo .vnode. children
        // children => vnode
        // renderSlots
        // 具名插槽
        return h("div", {}, [
            renderSlots(this.$slots, "header", { age: 18 }),
            foo,
            renderSlots(this.$slots, "footer")
        ]);
    },
}