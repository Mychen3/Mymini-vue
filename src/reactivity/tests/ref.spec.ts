import { isRef, ref, unRef,proxyRef} from "../ref"
import { effect } from "../effect"
import { reactive,isProxy} from "../reactive"

describe("ref", () => {
    it("hallo ref", () => {
        const a = ref(1)
        expect(a.value).toBe(1)
    })

    it("should be reactive", () => {
        const a = ref(1)
        let dunmmy;
        let calls = 0;
        effect(() => {
            calls++
            dunmmy = a.value
        });
        expect(calls).toBe(1)
        expect(dunmmy).toBe(1)

        a.value = 2

        expect(calls).toBe(2)
        expect(dunmmy).toBe(2)
    })
    // 如果传对象的话
    it("add reactive", () => {
        const a = ref({
            count: 1
        })
        let dunmmy;
        effect(() => {
            dunmmy = a.value.count
        })
        expect(dunmmy).toBe(1)

        a.value.count++
        expect(dunmmy).toBe(2)

    })

    it("isRef", () => {
        const a = ref(1)
        const user = reactive({
            age: 1
        })
        expect(isRef(a)).toBe(true)

        expect(isRef(1)).toBe(false)
        expect(isRef(user)).toBe(false)

        expect(unRef(user.age)).toBe(1)

    })
    it("unRef", () => {
        const a = ref(1)
        const user = reactive({
            age: 1
        })
        expect(unRef(a)).toBe(1)

        expect(unRef(1)).toBe(1)

        const testA = ref({ test: 1 })

        expect(isProxy(unRef(testA))).toBe(true)
    })

    it("proxyRef",()=>{
        const user = {
            age:ref(6),
            name:'chen'
        }
        const proxyUser = proxyRef(user);

        expect(user.age.value).toBe(6)
        expect(proxyUser.age).toBe(6)


     // set 
         proxyUser.age = ref(20);

        expect(proxyUser.age).toBe(20)
         

    })
})