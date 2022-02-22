import {createRenderer,createElement,patchProp,insert}  from '../../lib/guide-mini-vue.esm.js'
import{App} from './App.js' 


const rootContainer = document.querySelector('#app')

const renderer  = createRenderer({
    createElement,
    patchProp,
    insert
})

renderer.createApp(App).mount(rootContainer)


// createApp(App).mount(rootContainer);