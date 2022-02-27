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
        remove: hostRemove,
        //添加text
        setElementText: hostSetElementText
    } = options


    function render(vnode, container, parentComponent = null) {
        // patch
        patch(null, vnode, container, parentComponent, null)
    }

    // n1 = 老的虚拟节点
    // n2 = 新的虚拟节点
    function patch(n1, n2, container, parentComponent, anchor) {
        // 处理组件类型
        // 判断一下 是 element类型还是object
        // object就是组件
        const {shapeFlag, type} = n2
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent, anchor)
                break;
            case Text:
                processText(n1, n2, container)
                break;

            default:
                // 如果为String就是element类型
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, parentComponent, anchor)
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(n1, n2, container, parentComponent, anchor)
                }
                break;
        }

    }

    function processFragment(n1, n2, container, parentComponent, anchor) {

        mountChildren(n2.children, container, parentComponent, anchor)
    }

    function processText(n1, n2, container) {
        const {children} = n2
        const textNode = (n2.el = document.createTextNode(children))
        container.append(textNode)

    }


    // element类型
    function processElement(n1, n2, container, parentComponent, anchor) {
        //  如果老的虚拟节点不存在
        if (!n1) {
            //那就初始化
            mountElement(n2, container, parentComponent, anchor)
        } else {
            // 不然就是更新
            patchElement(n1, n2, container, parentComponent, anchor)
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
    function patchElement(n1, n2, container, parentComponent, anchor) {
        const oldProps = n1.props || EMPTY_OBJ;
        const newProps = n2.props || EMPTY_OBJ;

        const el = (n1.el = n2.el)

        patchProps(oldProps, newProps, el)
        // 对比Children
        patchChildren(n1, n2, el, parentComponent, anchor)
    }


    function patchChildren(n1, n2, container, parentComponent, anchor) {
        const oidShapeFlag = n1.shapeFlag
        const {newShapeFlag} = n2

        // 先判断新的是不是text
        if (newShapeFlag & ShapeFlags.TEXT_CHILDREN) {
            // 判断老的是不是数组
            if (oidShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                //如果是把老的children清空
                unmountChildren(n1.children)
            }
            // 俩个children都是text
            if (n1.children !== n2.children) {
                //设置text
                hostSetElementText(container, n2.children)
            }
            // 判断新的是array
        } else {
            // 已经判断过新的不是text那肯定就是数组，在判断老的是不是text就行了
            if (oidShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                //先清空
                hostSetElementText(container, '')
                mountChildren(n2.children, container, parentComponent, anchor)
            } else {
                //数组 diff算法 数组
                patchKeyedChildren(n1.children, n2.children, container, parentComponent, anchor)
            }
        }
    }

    function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
        /*
        * i 判断左端的节点位置
        * e1 用来判断老的children位置
        * e2 用来判断新的children位置
        * */
        let i = 0
        // 因为是个索引所以减1
        let e1 = c1.length - 1
        let e2 = c2.length - 1

        /*
        * 判断新旧children是否相同
        * */
        function isSomeVNodeType(n1, n2) {
            // type
            // key
            return n1.type === n2.type && n1.key === n2.key
        }

        /*
        * 判断左端对比,i是不能大于e1和e2的
        * */
        while (i <= e1 && i <= e2) {
            // 拿到新旧children判断
            const n1 = c1[i]
            const n2 = c2[i]
            if (isSomeVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor)
            } else {
                // 当出现不一样的时候左端就定位到了
                break
            }
            i++;
        }
        /*
        * 判断右侧对比,
         * */
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1]
            const n2 = c2[e2]

            if (isSomeVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor)
            } else {
                break;
            }
            // 因为每次循环要往坐移动
            e1--;
            e2--
        }

        /*
        * 新的节点比老的多 就创建
        *
        * */
        if (i > e1) {
            if (i <= e2) {
                /*
                *   锚点，创建的位置，
                *   nextPos 不相同的下标后面一位元素
                * */
                const nextPos = e2 + 1;
                /*如果超过了就传空，不然就把c2[nextPos].el元素作为锚点在前面添加元素
                * 其实就是看看是往左侧还是右侧，小于就是往左侧
                * */
                const anchor = nextPos < c2.length ? c2[nextPos].el : null
                while (i <= e2) {
                    patch(null, c2[i], container, parentComponent, anchor)
                    i++;
                }

            }
        } else if (i > e2) {
            /*
            * 老的比新的多就删除
            * */
            while (i <= e1) {
                hostRemove(c1[i].el)
                i++;
            }
        } else {
            // 乱序的部分，中间对比
            /*
            * s1: 老节点的开始
            * s2: 新节点的开始
            * */
            let s1 = i
            let s2 = i
            // 新节点的总数量
            const toBePatched = e2 - s2 + 1
            // 当前patch处理的数量
            let patched = 0
            const keyToNewIndexMap = new Map()

            /*
            * 遍历新节点
            * */
            for (let i = s2; i <= e2; i++) {
                const nextChild = c2[i]
                // 给新的建立映射,通过用户给的key
                keyToNewIndexMap.set(nextChild.key, i)
            }
            // 老节点
            for (let i = s1; i <= e1; i++) {
                const prevChild = c1[i];
                let newIndex;
                //先判断是否有key
                if (prevChild.key !== null) {
                    //有key就通过映射看看在新的里面有没有
                    newIndex = keyToNewIndexMap.get(prevChild)
                } else {
                    //没有的key的话就循环判断，
                    for (let j = s2; j <= e2; j++) {
                        //判断老节点和新节点是否相等
                        if (isSomeVNodeType(prevChild, c2[j])) {
                            newIndex = j
                            break
                        }
                    }
                }
                /*
                * 这判断 老节点如果要处理的比新节点的多，后面的肯定是直接删除了的
                * */
                if (patched >= toBePatched) {
                    hostRemove(prevChild.el)
                    continue
                }
                /*
                * 只要看看新的是不是undefined就知道存在不存在了
                * 不存在就删除
                * */
                if (newIndex === undefined) {
                    hostRemove(prevChild.el)
                } else {
                    /*存在就继续调用patch*/
                    patch(prevChild, c2[newIndex], container, parentComponent, null)
                    patched++
                }
            }
        }
    }

    function unmountChildren(children) {
        for (let i = 0; i <= children.length; i++) {
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

    //创建element类型
    function mountElement(vnode, container, parentComponent, anchor) {

        const el: Element = (vnode.el = hostCreateElement(vnode.type))

        const {children, shapeFlag} = vnode
        //  如果children是String的话 就直接处理
        // string,array
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            el.textContent = children
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            // 如果是数组，哪里面每个都是vnode，虚拟节点就遍历去递归执行patch
            mountChildren(vnode.children, el, parentComponent, anchor)
        }

        // props
        const {props} = vnode
        for (const key in props) {
            const val = props[key];
            hostPatchProp(el, key, null, val)
        }
        hostInsert(el, container, anchor)
        // container.append(el)
    }

    function mountChildren(children, el, parentComponent, anchor) {
        children.forEach((v) => {
            patch(null, v, el, parentComponent, anchor)
        })
    }


    //组件类型
    function processComponent(n1, n2, container, parentComponent, anchor) {
        // 去挂载
        mountComponent(n2, container, parentComponent, anchor)
    }

    function mountComponent(initialVnode, container, parentComponent, anchor) {
        //  创建组件实例对象    
        const instance = createComponentInstance(initialVnode, parentComponent)
        //处理组件
        setupComponent(instance)
        //调用rebder
        setupRenderEffect(instance, initialVnode, container, anchor)
    }

    function setupRenderEffect(instance, initialVnode, container, anchor) {

        effect(() => {

            // 初始化
            if (!instance.isMounted) {
                const {proxy} = instance
                const subTree = (instance.subTree = instance.render.call(proxy))
                // 然后在去调用 拆箱
                patch(null, subTree, container, instance, anchor)

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
                patch(prevSubTree, subTree, container, instance, anchor)

            }


        })
    }

    return {
        createApp: createAppAPI(render)
    }
}