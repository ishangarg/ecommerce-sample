import { products } from "../db/mongoCollections.js"

const addProduct = async (id, title, price, description, category, image, rating) => {

    const productCollection = await products();

    const existingProduct = await getProductBasedOnId(id)

    if (existingProduct != null || existingProduct != undefined){
        id = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
    }

    const product = {
        apiId: id,
        title: title,
        price: price,
        description: description,
        category: category,
        image: image,
        rating: rating
    }
    

    const info = await productCollection.insertOne(product)
    // console.log('Insert Successful: ' + info.insertId.toString())

}

const getAllProducts = async () => {
    const productCollection = await products();
    const productList = await productCollection.find({}).toArray();
    //if (!productList) throw "Could not get all products";
    productList.forEach((element) => {
        element._id = element._id.toString();
    });
    return productList;
}

const getProductBasedOnId = async (id) => {
    try {
        const productCollection = await products();
        id = Number(id)
        let obj = {apiId: id}
        console.log(obj)
        const searchResult = await productCollection.findOne({apiId: id});
        // console.log(searchResult)
        return searchResult;
    } catch (error) {
        console.error('Error retrieving product:', error);
        return null
    }

}

const getProductsFromIdArray = async (ids) => {
    try{
        const productCollection = await products()
        const idsArry = ids.map(str => parseInt(str));
        const searchResult = await productCollection.find({apiId:{"$in":idsArry}}).toArray()
        console.log(searchResult)
        return searchResult
    }catch(error){
        console.log(error)
        throw error
    }
}

const searchProduct = async (query) => {
    const productCollection = await products();
    await productCollection.createIndex({ title: "text", description: "text" });
    const searchResult = await productCollection.find({ $text: { $search: query } }).toArray();
    return searchResult;
}

export default {addProduct, getAllProducts, searchProduct, getProductBasedOnId, getProductsFromIdArray}