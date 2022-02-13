import { mutableHandlers, readonlyHandlers,shallowReadonlyHandlers } from './baseHandlers'

export const enum ReactiveFlages {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly'
}

export function reactive(raw) {
    return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers)
}

// 对象本身转换为Readonly，里面一层的对象不转换
export function shallowReadonly(raw){
    return createActiveObject(raw, shallowReadonlyHandlers)

}

export function isReactive(value) {
    //  触发get操作是是否是Reactive
    //  如果不是proxy值就返回布尔值
    return !!value[ReactiveFlages.IS_REACTIVE]
}


export function isReadonly(value) {
    return !!value[ReactiveFlages.IS_READONLY]
}

export function isProxy(value){
   return isReactive(value) || isReadonly(value)
}

function createActiveObject(raw: any, baseHandlers) {
    return new Proxy(raw, baseHandlers)
}