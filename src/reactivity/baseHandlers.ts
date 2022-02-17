import { extend, isObject } from '../shared/index'
import { track, trigger } from './effect'
import { reactive, ReactiveFlages, readonly } from './reactive'


const get = createGetter()

const set = createSetter()

const readonlyGet = createGetter(true)

const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        // 触发get操作判断是否是reactive或Readonly
        if (key === ReactiveFlages.IS_REACTIVE) {
            return !isReadonly
        } else if (key === ReactiveFlages.IS_READONLY) {
            return isReadonly
        }
        const res = Reflect.get(target, key);
        // 判断是否执行了shallowReadonly
        if (shallow) {
            return res;
        }

        // 实现 reactive 和 readonly 嵌套对象转换功能
        if (isObject(res)) {
            // 判断是否是readonly还是reactive
            return isReadonly ? readonly(res) : reactive(res)
        }

        if (!isReadonly) {
            // 收集依赖
            track(target, key)
        }
        return res
    }
}

function createSetter(isReadonly = false) {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value)
        //触发依赖
        trigger(target, key)
        return res
    }
}



export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get: readonlyGet,

    // readonly只读
    set(target, key, value) {
        console.warn(`key${key} set 失败 因为 target是readonly`)
        return true;
    }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, { get: shallowReadonlyGet })