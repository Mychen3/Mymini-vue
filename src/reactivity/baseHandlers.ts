import { track, trigger } from './effect'
import { ReactiveFlages } from './reactive'


const get = createGetter()

const set = createSetter()

const readonlyGet = createGetter(true)

function createGetter(isReadonly = false) {
    return function get(target, key) {
        // 触发get操作判断是否是reactive或Readonly
        if (key === ReactiveFlages.IS_REACTIVE) {
            return !isReadonly
        } else if (key === ReactiveFlages.IS_READONLY) {
            return isReadonly
        }

        const res = Reflect.get(target, key);
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

    set(target, key, value) {
        console.warn(`key${key} set 失败 因为 target是readonly`)
        return true;
    }
}