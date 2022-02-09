import { extend } from "../shared";

/*
*  绑定到全局的activeEffect
*  方便依赖收集
* */
let activeEffect;

/* 
*  决定是否收集依赖
* */
let shouldTrack;


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
        // 会收集依赖
        // 使用shouldTrack来做区分是否收集这次依赖
        
          if(!this.active){
            return this._fn();
          }   
          // 应该收集依赖
          shouldTrack = true
          activeEffect = this
          
         const result =  this._fn()

           // 重置
           shouldTrack = false
         
           return result

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
    effect.deps.length = 0
}

// 判断是否收集该依赖
function isTracking(){
      return shouldTrack && activeEffect !== undefined;
}

/*
* 全部的依赖收集到这里
* */
const targetMap = new Map()

// 收集依赖
export function track(target, key) {

   if(!isTracking()) return    

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
   //已经在dep中了
    if(dep.has(activeEffect)) return
    dep.add(activeEffect)
    
    activeEffect.deps.push(dep)
}


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