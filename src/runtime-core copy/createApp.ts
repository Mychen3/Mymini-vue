import { createVnode } from "../runtime-core/vnode"
import { render } from "../runtime-core/render"

export function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先转换成vnode 虚拟节点
            // 所有的逻辑操作 都会基于 vnode 做处理
            // 先创建一个虚拟节点 挂载app最大的div
            const vnode = createVnode(rootComponent)
            // 执行render，第二个参数是挂载节点
            render(vnode, rootContainer);
        }
    }
}




