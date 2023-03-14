import express from 'express'
import ProductManager from './productManager.js'

let pM = new ProductManager('./data/products.json');
const PORT = 8080
const app = express()

app.get('/products', async (req, res) => {
    const lim = parseInt(req.query.limit)
    let products = null
    if (isNaN(lim)) {
      products = await pM.getProducts()
      res.json(products)
    } else {
      products = await pM.getProductsLimited(lim)
      res.json(products)
    }
  })

app.get('/products/:pid', async (req, res)=>{
    try {
        const { pid } = req.params
        const pById = await pM.getProductById(+pid)
        if(pById) {
            res.json(pById)
        } else {
            res.json({message: 'ERROR: Elemento no encontrado.'})
        }  
    } catch (error) {
        console.log(error)
    }
 })

const server = app.listen(PORT,()=> console.log(`Server on http://localhost:${PORT}`))