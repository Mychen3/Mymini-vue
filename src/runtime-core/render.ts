import {createComonentInstance,setupComponent} from "./component"

export function render(vnode, container) {
    // patch
    patch(vnode, container)

}
   
function patch(vnode, container) {
    // 处理组件类型
    // 判断一下 是不是 element类型
    
    // processElement();

    processComponent(vnode, container)

}

function processComponent(vnode: any, container: any) {
   //  挂载组件
    mountComponent(vnode,container);  

}

function mountComponent(vnode: any,container) {
              //  创建组件实例对象
      const instance =  createComonentInstance(vnode)
              
          setupComponent(instance)
          
           //调用rebder
          setupRenderEffect(instance,container)
}

function setupRenderEffect(instance,container) {

     const subTree = instance.render()
     // 然后在去调用 拆开
     patch(subTree,container)
    

}

