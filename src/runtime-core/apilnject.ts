import { getCurrentInstance } from "./component";

export function provide(key, value) {
    // 存
    const currenInstance: any = getCurrentInstance()
    if (currenInstance) {
        let { provides } = currenInstance

        const parentProvides = currenInstance.parent.provides;
        //init
        if (provides === parentProvides) {
            provides = currenInstance.provides = Object.create(parentProvides)
        }
        provides[key] = value


    }
}

export function inject(key, defaultValue) {
    // 取
    const currenInstance: any = getCurrentInstance()
    if (currenInstance) {
        const parentProvides = currenInstance.parent.provides


        if (key in parentProvides) {
            return parentProvides[key]
        } else if (defaultValue) {
            if (typeof defaultValue === 'function') {
                return defaultValue()
            }
            return defaultValue


        }


    }

}