import fs from 'fs/promises'

export default class ProductManager {
    constructor(path){
        this.path = path;
        this.products = [];
    }
    async readFile(){
        let json = await fs.readFile(this.path, "utf-8")
        this.products = JSON.parse(json)
        return
    }
    async saveFile(){
        let json = JSON.stringify(this.products, null, 4)
        await fs.writeFile(this.path, json)
        return
    }
    async getProducts(){
        await this.readFile();
        return this.products;
    }
    async addProduct(title, description, price, thumbnail, code, stock){
        await this.readFile();
        let id = this.agregarId()
        const product = {
            id: id,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }
        if (!this.validateProduct(product)){return}//si el producto no posee todos sus campos da error y trae falso finalizando la carga
        await this.duplicateProduct(product)
    }
    async getProductById(id){
        await this.readFile();
        try {
            const productToFind = this.products.find( prod => prod.id === id )
            if(!productToFind){
                throw new Error(`No hay producto con id ${id}`)
            }else{
                return productToFind;
            }   
        } catch (error) {
            return console.log(`Error: ${error.message}`)
        }
    }

    async getProductsLimited(limit) {
        await this.readFile()
        const productsLimited = []

        for (let i = 0; i < limit; i++) { 
            if(i<this.products.length) productsLimited.push(this.products[i])
        }
        return productsLimited
    }

    async updateProduct(productToUpdate){
        try {
            await this.readFile();
            const productToUpdateIndex = this.products.findIndex(prod => prod.id === productToUpdate.id)
            if(productToUpdateIndex >= 0){
                this.products[productToUpdateIndex] = productToUpdate
                await this.saveFile();
                console.log(`Producto de id ${productToUpdate.id} actualizado`);
            } else {
                throw new Error (`No existe un producto con el id ${productToUpdate.id} para actualizar`);
            }
        } 
        catch (error) {
            return console.log(`Error: ${error.message}`);
        }
    }
    async deleteProduct(id){
        try {
            await this.readFile();
            const productToDeleteIndex = this.products.findIndex(prod => prod.id === id)
            if(productToDeleteIndex >= 0){
                this.products.splice(productToDeleteIndex,1)
                await this.saveFile();
                console.log(`Producto de id ${id} eliminado`);
            } else {
                throw new Error (`No existe un producto con el id ${id} para eliminar`);
            }
        } 
        catch (error) {
            return console.log(`Error: ${error.message}`);
        }
    }
    agregarId(){
        return (this.products.length == 0 )? 1: this.products[this.products.length - 1].id + 1;
    }
    validateProduct(product){  
        try {
            const validatedProduct = Object.values(product).filter(element => element === undefined)
            if(validatedProduct.length > 0){
                throw new Error(`El producto ingresado no se puede agregar. Falta completar informacion.`)  
            }else{return true}
        } catch (error) {
            return console.log(`Error: ${error.message}`)
        }    
    }
    async duplicateProduct(product){
        let duplicatedProduct = this.products.find( prod => prod.code === product.code)
        if (!duplicatedProduct){
            this.products.push (product);
            await this.saveFile()
            return console.log(`Producto "${product.title}" agregado correctamente.`)
        }else{
            return console.log(`Codigo ${product.code} repetido. Producto no ingresado.`)
        }
    }
}



//let pM = new ProductManager("data/products.json");
// await pM.addProduct("elemento 1 prueba desafio2", "este es un elemento de prueba desafio2", 5625, "sin imagen", "abc777", 10)
// await pM.addProduct("elemento 1 falla desafio2", "este es un elemento de prueba desafio2", 5625, "sin imagen", "abc777", 10)//duplicate
// await pM.addProduct("elemento 2 falla desafio2", "este es un elemento de prueba desafio2", "sin imagen", "abc778", 20)//notValid
// await pM.addProduct("elemento 2 prueba desafio2", "este es un elemento de prueba desafio2", 2300, "sin imagen", "abc778", 20)
// await pM.addProduct("elemento 3 falla desafio2", "este es un elemento de prueba desafio2", 3333, "sin imagen", "abc770")//notValid
// await pM.addProduct("elemento 3 prueba desafio2", "este es un elemento de prueba desafio2", 4444, "sin imagen", "abc779", 30)
// await pM.getProducts()
// await pM.getProductById(4)
// await pM.updateProduct(
//     {
//         id:4, 
//         title: "elemento actualizado", 
//         description:"este es un elemento actualizado", 
//         price: 4444, 
//         thumbnail: "sin imagen", 
//         code: "abc779", 
//         stock: 321
//     }
// )
// await pM.getProductById(4)
// await pM.deleteProduct(5)