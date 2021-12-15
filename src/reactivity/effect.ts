class ReactiveEffect {
    private _fn: any

    constructor(fn) {
        this._fn = fn;
    }
    run() {
        activeEffect = this
        this._fn();
    }

}
/*
* 全部的依赖收集到这里
* */
const targetMap = new Map()


// 收集依赖
export function track(target, key) {
    let depsMap = targetMap.get(target);
    console.log(depsMap,'判断的')
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
    dep.add(activeEffect)
}

/*
*  绑定到全局的activeEffect
*  方便依赖收集
* */
let activeEffect;

//触发依赖
export function trigger (target,key){
      let depsMap =targetMap.get(target)
      let dep = depsMap.get(key)

    for(const effect of dep){
        effect.run()
    }

}

export function effect(fn) {
    // 创建一个effect
    const _effect = new ReactiveEffect(fn)
    _effect.run();
}
