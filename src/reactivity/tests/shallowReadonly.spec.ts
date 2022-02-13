import { shallowReadonly, isReadonly } from '../reactive'

describe("shallowReadonly",()=>{
    test("test shallowReadonly",()=>{
   
      const props = shallowReadonly({ n: { foo: 1 } });
      
      expect(isReadonly(props)).toBe(true)

      expect(isReadonly(props.n)).toBe(false)
    })
})