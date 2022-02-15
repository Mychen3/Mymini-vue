import { computed} from '../computed'
import { reactive } from '../reactive'

describe("computed",()=>{

    it("hallo path",()=>{
       //1.ref
       //2. .value
       //3. 缓存
       const user = reactive({
           age:1 
       });
    const age = computed(()=>{
        return user.age 
    })

    expect(age.value).toBe(1)
    })
      
    it("should computed lazily",()=>{
    
        const value = reactive({
            foo: 1
        });
        const getter = jest.fn(()=>{
             return value.foo
        })
        const cValue = computed(getter)
        // 懒执行,当没有调用cValue的话 getter哪个函数是不会执行的
        // lazy
        expect(getter).not.toHaveBeenCalled()
        expect(cValue.value).toBe(1)
        // 只调用一次
        expect(getter).toHaveBeenCalledTimes(1);
    
       // 不应再次计算
       cValue.value;//get
    
       expect(getter).toHaveBeenCalledTimes(1)

       
        value.foo = 2
        // 在需要之前不应该被计算
        expect(getter).toHaveBeenCalledTimes(1)

        // 现在应该计算了一遍
        expect(cValue.value).toBe(2);
        expect(getter).toHaveBeenCalledTimes(2)

        // 不应该再计算
        cValue.value;
        expect(getter).toHaveBeenCalledTimes(2)
    })


})