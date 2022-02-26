import { camelize, toHandlerKey } from "../shared";

export function emit(instance, event, ...args) {
    const { props } = instance

    // add =》 Add
    // add-foo => addFoo



    const handlerName = toHandlerKey(camelize(event));

    const handler = props[handlerName]
    handler && handler(...args)


}

