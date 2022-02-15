
//创建vnode 
/* 
  type:"render函数第一个参数"
  props:render函数第二个参数，标签下的内容
*/
export function createVnode(type, props?, children?) {

    const vnode = {
        type,
        props,
        children
    }

    return vnode
}