// dom的渲染接口

import { createRenderer } from "../runtime-core"

export function createElement(type) {
    return document.createElement(type)

}

export function patchProp(el, key, prevVal, nextVal) {
    //处理事件
    // on + Event name
    // onMousedown
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        const event = (key as string).slice(2).toLowerCase()
        el.addEventListener(event, nextVal)
    } else {

        if (nextVal === undefined || nextVal === null) {
            
            el.removeAttribute(key, nextVal)
        }else{
            //添加props属性
            el.setAttribute(key, nextVal)
        }
    }

}

export function insert(el, parent,anchor) {
    // parent.append(el)
    parent.insertBefore(el,anchor || null);
}

export function remove(child){
    // 判断是否是一个父节点
    const parent = child.parentNode
     if (parent){
         parent.removeChild(parent)
     }
}

export function setElementText(el,text){
    el.textContent = text
}

const renderer: any = createRenderer({
    createElement,
    patchProp,
    insert,
    remove,
    setElementText
})

export function createApp(...args) {
    return renderer.createApp(...args)
}

export * from '../runtime-core' 