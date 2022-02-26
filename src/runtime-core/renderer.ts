import {createAppAPI} from './createApp'
import {EMPTY_OBJ, isObject} from '../shared'
import {ShapeFlags} from '../shared/ShapeFlags'
import {createComponentInstance, setupComponent} from './component'
import {Fragment, Text} from './vnode'
import {effect} from '../reactivity/effect'


export function createRenderer(options) {


    const {
        createElement: hostCreateElement,
        // 设置props属性
        patchProp: hostPatchProp,
        //插入元素
        insert: hostInsert,
        // 删除
        remove : hostRemove,
        //添加text
        setElementText:hostSetElementText
    } = options


    function render(vnode, container, parentComponent = null) {
        // patch
        patch(null, vnode, container, parentComponent)
    }

    // n1 = 老的虚拟节点
    // n2 = 新的虚拟节点
    function patch(n1, n2, container, parentComponent) {
        // 处理组件类型
        // 判断一下 是 element类型还是object
        // object就是组件
        const {shapeFlag, type} = n2
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent)
                break;
            case Text:
                processText(n1, n2, container)
                break;

            default:
                // 如果为String就是element类型
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, parentComponent)
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(n1, n2, container, parentComponent)
                }
                break;
        }

    }

    function processFragment(n1, n2, container, parentComponent) {

        mountChildren(n2.children, container, parentComponent)
    }

    function processText(n1, n2, container) {
        const {children} = n2
        const textNode = (n2.el = document.createTextNode(children))
        container.append(textNode)

    }


    // elementl类型
    function processElement(n1, n2, container, parentComponent) {
        //  如果老的虚拟节点不存在
        if (!n1) {
            //那就初始化
            mountElement(n2, container, parentComponent)
        } else {
            // 不然就是更新
            patchElement(n1, n2, container,parentComponent)
        }
    }

    // 处理更新对比
    /*
    * 4种处理children方式
    * 老的是 array 新的是 text
    * 老的是 text 新的是 text
    * 老的是 text 新的是 array
    * 老的是array 新的是 array (这种情况就是diff算法处理)
    * */
    function patchElement(n1, n2, container,parentComponent) {
        const oldProps = n1.props || EMPTY_OBJ;
        const newProps = n2.props || EMPTY_OBJ;

        const el = (n1.el = n2.el)

        patchProps(oldProps, newProps, el)
        // 对比Children
        patchChildren(n1, n2,el,parentComponent)
    }


    function patchChildren(n1, n2,container,parentComponent) {
        const oidShapeFlag = n1.shapeFlag
        const {newShapeFlag} = n2

          // 先判断新的是不是text
         if(newShapeFlag & ShapeFlags.TEXT_CHILDREN){
             // 判断老的是不是数组
             if(oidShapeFlag & ShapeFlags.ARRAY_CHILDREN){
                 //如果是把老的children清空
                 unmountChildren(n1.children)
             }
             // 俩个children都是text
             if (n1.children !== n2.children){
                 //设置text
                 hostSetElementText(container,n2.children)
             }
             // 判断新的是array
         }else{
             // 已经判断过新的不是text那肯定就是数组，在判断老的是不是text就行了
              if(oidShapeFlag & ShapeFlags.TEXT_CHILDREN){
                   //先清空
                  hostSetElementText(container,'')
                  mountChildren(n2.children,container,parentComponent)
              }
         }
    }
    function unmountChildren(children) {
         for (let i = 0 ; i<= children.length; i++){
               const el = children[i].el
             // remove
             hostRemove(el)

         }

    }

    function patchProps(oldProps, newProps, el) {
        if (oldProps !== newProps) {
            for (const key in newProps) {
                //旧的
                const prevProp = oldProps[key]
                //新的
                const nextProp = newProps[key]

                if (prevProp !== nextProp) {
                    hostPatchProp(el, key, prevProp, nextProp)
                }
            }

            if (oldProps !== EMPTY_OBJ) {
                for (const key in oldProps) {
                    // 如果旧props key不在
                    if (!(key in newProps)) {
                        hostPatchProp(el, key, oldProps[key], null)
                    }
                }
            }
        }


    }

    //创建elementl类型
    function mountElement(vnode, container, parentComponent) {

        const el: Element = (vnode.el = hostCreateElement(vnode.type))

        const {children, shapeFlag} = vnode
        //  如果children是String的话 就直接处理
        // string,array
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            el.textContent = children
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            // 如果是数组，哪里面每个都是vnode，虚拟节点就遍历去递归执行patch
            mountChildren(vnode.children, el, parentComponent)
        }

        // props
        const {props} = vnode
        for (const key in props) {
            const val = props[key];
            hostPatchProp(el, key, null, val)
        }
        hostInsert(el, container)
        // container.append(el)
    }

    function mountChildren(children, el, parentComponent) {
        children.forEach((v) => {
            patch(null, v, el, parentComponent)
        })
    }


    //组件类型
    function processComponent(n1, n2, container, parentComponent) {
        // 去挂载
        mountComponent(n2, container, parentComponent)
    }

    function mountComponent(initialVnode, container, parentComponent) {
        //  创建组件实例对象    
        const instance = createComponentInstance(initialVnode, parentComponent)
        //处理组件
        setupComponent(instance)
        //调用rebder
        setupRenderEffect(instance, initialVnode, container)
    }

    function setupRenderEffect(instance, initialVnode, container) {

        effect(() => {

            // 初始化
            if (!instance.isMounted) {
                const {proxy} = instance
                const subTree = (instance.subTree = instance.render.call(proxy))
                // 然后在去调用 拆箱
                patch(null, subTree, container, instance)

                initialVnode.el = subTree.el

                // 改变初始化状态，下次就是updata
                instance.isMounted = true
            } else {
                const {proxy} = instance
                // 新的SubTree
                const subTree = instance.render.call(proxy)
                // 老的SubTree
                const prevSubTree = instance.subTree
                // 下次再更新的
                instance.subTree = subTree
                // 然后在去调用 拆箱
                patch(prevSubTree, subTree, container, instance)

            }


        })
    }

    return {
        createApp: createAppAPI(render)
    }
}