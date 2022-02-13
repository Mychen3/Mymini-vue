import { effect,stop } from "../effect"
import { reactive } from "../reactive"


describe("effect", () => {
     it("stop",()=>{
         let dummy;
         let name;
         let testName;
         const obj = reactive({prop:1,chen:'测试',test:'666'});
         const runner = effect(()=>{
             dummy = obj.prop
             testName =  obj.test
         })
         const runnerName = effect(()=>{
               name = obj.chen
         })

         const runnerName2 = effect(()=>{
            name = obj.chen
            console.log('66666')
      })
         
         obj.test = '888'
         obj.prop = 2;
         obj.chen = '陈先生';
         expect(dummy).toBe(2)
        //  stop(runner);
         expect(name).toBe('陈先生'); 
         expect(testName).toBe('888');
            obj.prop++

        //  expect(dummy).toBe(2)
         runner();
         runnerName();
         expect(dummy).toBe(3);
     })



    it("happy path", () => {
        const user = reactive({
            age: 10,
        
        })

        let nextAge;

        effect(() => {
            nextAge = user.age + 1
        });

        expect(nextAge).toBe(11);
        // update
        user.age++;
        user.age = user.age + 3
        // expect(nextAge).toBe(12);
    });

    it('return runner effect',()=>{
        let foo = 10
       const runner = effect(()=>{
          foo ++
          return "foo"
        },)
        expect(foo).toBe(11)
        const r =runner()
        expect(foo).toBe(12)
        expect(r).toBe("foo")
    })
});
