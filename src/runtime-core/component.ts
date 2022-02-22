import { proxyRefs } from ".."
import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { PublicInstanceProxyHandlers } from "./componentPublicInstance"
import { initSlots } from "./componentSlots"
//  初始化 创建组件实例
export function createComponentInstance(vnode,parent) {

    console.log("createcomponentInstance",parent)

    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        provides:parent ? parent.provides:{},
        parent,
        subTree:{},
        isMounted:false,
        emit: () => { }
    }
    component.emit = emit.bind(null, component) as any
    return component
}
//处理组件类型
export function setupComponent(instance: any) {
    initProps(instance, instance.vnode.props)
    initSlots(instance, instance.vnode.children)
    // 调用setup函数
    setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
    const Component = instance.type

    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)

    const { setup } = Component

    if (setup) {
        setCurrenInstance(instance)
         // function || object
        //setup的结果
        const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit })
        setCurrenInstance(null)
        handleSetupResult(setupResult, instance)
    }
}
// 判断setup函数返回的是object还是function
function handleSetupResult(setupResult, instance) {
    // 可能为function || object
    // TODO function 

    // 如果是object类型的话就把setup结果给组件实例
    if (typeof setupResult === 'object') {
        instance.setupState = proxyRefs(setupResult)
    }

    finishComponentSetup(instance)

}
// 判断组件有没有render
function finishComponentSetup(instance) {
    const Component = instance.type

    instance.render = Component.render

}

let currenInstance = null

// 获取当前组件实例
export function getCurrentInstance() {
    return currenInstance
}
//设置组件实例
export function setCurrenInstance(instance) {
    currenInstance = instance
}