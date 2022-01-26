import { readonly } from '../reactive'

describe("readonly", () => {
    it('happy readonly', () => {


    });

    it('awrn then call set', () => {
       // console.warn()
       // mock
          console.warn = jest.fn()
 

       const user =  readonly({
           age:10
       })

        user.age = 11;
        
        expect(console.warn).toBeCalled()
    })

})