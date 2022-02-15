import { ReactiveEffect } from "./effect"

class ComputedRefImpl {
    private _getter: any;
    private _dirty: boolean = true;
    private _value: any;
    private _effect: any;

    constructor(getter) {
        this._getter = getter;

        this._effect = new ReactiveEffect(getter, () => {
            if (!this._dirty) {
                this._dirty = true;
            }
        });
    }
    get value() {
        // 缓存
        if (this._dirty) {
            this._dirty = false
            this._value = this._effect.run()
        }
               // 当第二次调用，依赖值没有发生改变就不执行计算属性的函数
        return this._value
    }
}


export function computed(getter) {

    return new ComputedRefImpl(getter)
}