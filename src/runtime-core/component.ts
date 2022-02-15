//  初始化 创建组件实例
export function createComonentInstance(vnode) {
    
    const component = {
        vnode,
        type: vnode.type
    }

    return component
}


//处理组件类型
export function setupComponent(instance) {
    //TODO
    // initprops()
    // initslots()


    // 调用setup函数
    setupStatefulComponent(instance)

}

function setupStatefulComponent(instance: any) {

    const Component = instance.type

    const { setup } = Component
    if (setup) {
        // function || object
        const setupResult = setup()

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