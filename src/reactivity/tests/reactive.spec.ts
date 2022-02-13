import { reactive, isProxy,readonly } from '../reactive'

describe('reactive', () => {
    it('happy path', () => {
        const original = { foo: 1 }
        const testText = { a: 12 }
        const testReadonly = readonly({name:'chen'})
        const observed = reactive(original)
        expect(observed).not.toBe(original)

        expect(isProxy(observed)).toBe(true)
        expect(isProxy(testText)).toBe(false)
        expect(isProxy(testReadonly)).toBe(true)

    })
})