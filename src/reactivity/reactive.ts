import { isObject } from '../shared/index'
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers'

export const enum ReactiveFlages {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly'
}

export function reactive(raw) {
    return createRctiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
    return createRctiveObject(raw, readonlyHandlers)
}

// 对象本身转换为Readonly，里面一层的对象不转换
export function shallowReadonly(raw) {
    return createRctiveObject(raw, shallowReadonlyHandlers)

}

export function isReactive(value) {
    //  触发get操作是是否是Reactive
    //  如果不是proxy值就返回布尔值
    return !!value[ReactiveFlages.IS_REACTIVE]
}


export function isReadonly(value) {
    return !!value[ReactiveFlages.IS_READONLY]
}

export function isProxy(value) {
    return isReactive(value) || isReadonly(value)
}

function createRctiveObject(raw: any, baseHandlers) {
    if (!isObject(raw)) {
        console.warn(`raw ${raw} 必须是一个对象`)
        return raw
    }

    return new Proxy(raw, baseHandlers)
}