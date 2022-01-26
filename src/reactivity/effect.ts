import { extend } from "../shared";

class ReactiveEffect {
    private _fn: any;
    deps = [];
    active = true;
    public scheduler: Function | undefined
    constructor(fn, scheduler?: Function) {
        this._fn = fn;
        this.scheduler = scheduler
    }

    run() {
        activeEffect = this
        return this._fn();
    }
    stop() {
        if (this.active) {
            cleanupEffect(this)
            this.active = false;
        }
    }
}

function cleanupEffect(effect) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect)
    })
}

/*
* 全部的依赖收集到这里
* */
const targetMap = new Map()

// 收集依赖
export function track(target, key) {
    let depsMap = targetMap.get(target);
    //
    //  如果没有的话。初始化
    if (!depsMap) {
        depsMap = new Map()
        // 建立映射关系
        targetMap.set(target, depsMap);
    }

    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }
    if(!activeEffect) return;
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
}

/*
*  绑定到全局的activeEffect
*  方便依赖收集
* */
let activeEffect;

//触发依赖
export function trigger(target, key) {
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)

    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }

}

export function effect(fn, options: any = {}) {
    const scheduler = options.scheduler;

    // 创建一个effect
    const _effect = new ReactiveEffect(fn, scheduler)
    // options
     extend(_effect, options)
     
    _effect.run();
    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect

    return runner
}


export function stop(runner) {
    runner.effect.stop();
}