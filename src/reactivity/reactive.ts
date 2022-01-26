import { mutableHandlers, readonlyHandlers } from './baseHandlers'

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

export function isReactive(value) {
    //  触发get操作是是否是Reactive
    //  如果不是proxy值就返回布尔值
    return !!value[ReactiveFlages.IS_REACTIVE]
}

export function isReadonly(value) {
    return !!value[ReactiveFlages.IS_READONLY]
}


function createActiveObject(raw: any, baseHandlers) {
    return new Proxy(raw, baseHandlers)
}