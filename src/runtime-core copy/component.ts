import { PublicInstanceProxyHandlers } from "./componentPublicInstance"
import { initprops } from './componentProps'
import { shallowReadonly } from "../reactivity/reactive"
import {emit} from './componentEmit'
import { initslots } from "./componentSlots"
//  初始化 创建组件实例
export function createComponentInstance(vnode,parent) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots:{},
        provides:parent ? parent.provides:{},
        parent,
        emit: () => { }
    }

    component.emit = emit.bind(null,component) as any 

    return component
}

 
//处理组件类型
export function setupComponent(instance) {
    //TODO
    initprops(instance, instance.vnode.props)
    initslots(instance,instance.vnode.children)
    // 调用setup函数
    setupStatefulComponent(instance)

}

function setupStatefulComponent(instance: any) {


    const Component = instance.type

    //ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)


    const { setup } = Component
    if (setup) {
        setCurrentInstance(instance)
        // function || object
        //setup的结果
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        })
        setCurrentInstance(null)

        handleSetupResult(setupResult, instance)
    }

}
// 判断setup函数返回的是object还是function
function handleSetupResult(setupResult: any, instance) {

    // 可能为function || object
    // TODO function 

    // 如果是object类型的话就把setup结果给组件实例
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult
    }

    finishComponentSetup(instance)
}

// 判断组件有没有render
function finishComponentSetup(instance) {

    const Component = instance.type


    instance.render = Component.render;

}

let currentInstance = null

export function getCurrentInstance(){
    return currentInstance
}

function setCurrentInstance(instance){
    currentInstance = instance
}