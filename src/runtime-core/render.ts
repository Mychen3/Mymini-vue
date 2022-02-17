import { isObject } from "../shared/index";
import {ShapeFlags} from '../shared/ShapeFlags'
import { createComonentInstance, setupComponent } from "./component"
export function render(vnode, container) {
    // patch
    patch(vnode, container)

}

function patch(vnode, container) {
    // 处理组件类型
    // 判断一下 是 element类型还是object
    // object就是组件

     const {shapeFlag} = vnode

    // 如果为String就是element类型
    if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container)
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container)
    }
}
// elementl类型
function processElement(vnode, container) {
    mountElement(vnode, container)

}

//创建elementl类型
function mountElement(vnode, container: Element) {
    const el: Element =(vnode.el = document.createElement(vnode.type)) 

    const { children, props, shapeFlag } = vnode

    //  如果children是String的话 就直接处理
    // string,array
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {

        el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 如果是数组，哪里面每个都是vnode，虚拟节点就遍历去递归执行patch
        mountChildren(children,el)
    }

    //props  
    for (const key in props) {
        const val = props[key]
       
         //处理事件
        // on + Event name
        // onMousedown
        const isOn = (key:string) => /^on[A-Z]/.test(key);
         if(isOn(key)){
             const event = (key as string).slice(2).toLowerCase()
            el.addEventListener(event,val)
         }

        //添加props属性
        el.setAttribute(key, val)
    }
    container.append(el)
}

function mountChildren(children,el){
    children.forEach((v) => {
        patch(v, el)
    })
}



//组件类型
function processComponent(vnode: any, container: any) {
    //  挂载组件
    mountComponent(vnode, container);

}

function mountComponent(initialVnode: any, container) {
    //  创建组件实例对象
    const instance = createComonentInstance(initialVnode)

     //处理组件
    setupComponent(instance)

    //调用rebder
    setupRenderEffect(instance, container,initialVnode)
}

function setupRenderEffect(instance, container,initialVnode) {
    const { proxy } = instance 
    const subTree = instance.render.call(proxy)
    // 然后在去调用 拆开
    patch(subTree, container)
    initialVnode.el = subTree.el
   
}



