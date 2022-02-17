import {toHandlerKey,camelize} from '../shared/index'
export function emit(instance, event, ...grgs) {

    console.log("emit,component", event)

    const { props } = instance

    // add =》 Add
    // add-foo => addFoo



    const handlerName = toHandlerKey(camelize(event));

    const handler = props[handlerName]
    handler && handler(...grgs)


}