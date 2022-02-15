import typescript from "@rollup/plugin-typescript";
import  pkb from './package.json'
export default{
      input:"./src/index.ts",
      output:[
          //1.cjs => commonjs
          // 2 esm
          {
              format:"cjs",
              file: pkb.main
          },
          {
            format:"esm",
            file: pkb.module
        }
      ],
      plugins:[typescript()]
}