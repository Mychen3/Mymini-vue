import {
    h,
    provide,
    inject,
} from "../../lib/guide-mini-vue.esm.js";

const Provider = {
    name:"Provider",
    setup() {
        provide("foo", "fooVal");
        provide("bar", "barVal");
    },
    render() {
        return h("div", {}, [h("p", {}, "provider"), h(ProviderTwo)])
    }
};
const ProviderTwo = {
    name: "ProviderTwo",
    setup() { 

    },
    render() {
        return h("div", {}, [h("p", {}, "providerTwo"), h(Consumer)])
    }
};

// const ProviderTwo = {
//     setup() {
//         // override parent value
//         provide("foo", "fooOverride");
//         provide("baz", "baz");
//         const foo = inject("foo");
//         // 这里获取的 foo 的值应该是 "foo"
//         // 这个组件的子组件获取的 foo ，才应该是 fooOverride
//         if (foo !== "foo") {
//             throw new Error("Foo should equal to foo");
//         }
//         return () => h(Consumer);
//     },
// };

const Consumer = {
    name: "Consumer",
    setup() {
        const foo = inject("foo");
        const bar = inject("bar");
        const baz = inject("baz");
        return {
            foo,
            bar,
            baz
        }
    },
    render() {
        return h("div", {}, `Consumer:${this.foo}-${this.bar}-${this.baz}`);
     }
};

export default {
    name: "App",
    setup() {
  
    },
    render() {
        return h("div", {}, [h("p", {}, "apiInject"), h(Provider)])
    }
};