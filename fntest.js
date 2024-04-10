/* Just a random js file to test functions before linking to template */
import {productData} from './data/index.js'

const result = await productData.searchProduct('laptop')
console.log(result)