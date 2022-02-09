import { effect,stop } from "../effect"
import { reactive } from "../reactive"


describe("effect", () => {
     it("stop",()=>{
         let dummy;
         const obj = reactive({prop:1});
         const runner = effect(()=>{
             dummy = obj.prop
         });
         obj.prop = 2;
         expect(dummy).toBe(2)
         stop(runner);
         
            obj.prop++

         expect(dummy).toBe(2)
         runner();
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
