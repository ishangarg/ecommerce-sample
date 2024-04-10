import {Router} from 'express';
import { productData } from '../data/index.js';
import {productHelpers} from '../helper/index.js'

const router = Router();

router.route('/').get(async (req, res) => {
    const products = await productData.getAllProducts()
    const cart = req.session.cart
    // console.log(products)
    const productCartMap = productHelpers.mapProductToCart(products, cart)
    // console.log(productCartMap)
    res.render("home", {products: productCartMap})
});

router.route('/search').get(async (req, res) => {
    const searchQuery = req.query.query;
    const searchResult = await productData.searchProduct(searchQuery)
    res.render("search", {query:searchQuery, result: searchResult})
});

router.route('/product/:id').get(async (req, res) => {
    console.log(req.params.id)
    const searchQuery = req.params.id
    const searchResult = await productData.getProductBasedOnId(searchQuery)
    // console.log(searchResult)
    res.render("product",searchResult)
});

router.route('/add-to-cart').post(async (req, res) => {
    const productId = req.body.productId;
    req.session.cart.push(productId);
    const responseJson = {
        message: 'Product added to cart',
        cart: req.session.cart,
        length: req.session.cart.length,
    };
    res.status(200).json(responseJson);
})

router.post('/clear-cart', (req, res) => {
    req.session.cart = [];
  
    res.send('Cart cleared');
  });

export default router;