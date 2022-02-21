// dom的渲染接口

import { createRenderer } from "../runtime-core"

function createElement(type) {
    return document.createElement(type)

}

function patchProp(el, key, val) {
    //处理事件
    // on + Event name
    // onMousedown
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        const event = (key as string).slice(2).toLowerCase()
        el.addEventListener(event, val)
    } else {
        //添加props属性
        el.setAttribute(key, val)
    }

}

function insert(el, parent) {
    parent.append(el)


}



const renderer:any = createRenderer({
    createElement,
    patchProp,
    insert
})

export function createApp(...args){
    return renderer.createApp(...args)
}

export * from '../runtime-core' 