import { hasChanged ,isObject} from "../shared/index";
import { trackEffect, triggerEffec, isTracking } from "./effect"
import { reactive } from "./reactive";

// 因为ref都是单值
// proxy =》 object
// 所以通过类 =》 value get set

class RefImpl {
    private _value; 
    public dep
    private _rwaValue;

    // 判断是不是ref的标识符
    public _v_isRef = true

    constructor(value) {
        
      // 声明一个值用来对比set的新值是不是一样的
      this._rwaValue = value  
      // 看看value是不是对象，是对象的话就用reactive包裹
      this._value = convert(value)

        this.dep = new Set()
    }

    get value() {
        trackRefValue(this)
        return this._value
    }

    set value(newValue) {
        //判断第一次的val和第二次修改的val是否一样
        //如果改变的话就触发
        if (hasChanged(newValue, this._rwaValue)) {
            // 触发依赖,一定先去修改了value的值，再去触发依赖
            //  先修改
            this._rwaValue = newValue
            this._value = convert(newValue)
            //  在触发依赖
            triggerEffec(this.dep)
        }
    }
}

function trackRefValue(ref){

    if (isTracking()) {
        // 依赖收集
        trackEffect(ref.dep)
    }
}

function convert (value){
    return isObject(value) ? reactive(value) : value
}


export function ref(value) {
    return new RefImpl(value)

}

export function isRef(ref){
     return !!ref._v_isRef
}

export function unRef(ref){
    // 先看看是不是ref对象
  return isRef(ref) ? ref.value : ref
}
