import {Router} from 'express';
import { productData } from '../data/index.js';
import { userData } from '../data/index.js';

import {productHelpers} from '../helper/index.js'

const router = Router();

router.route('/').get(async (req, res) => {
    const products = await productData.getAllProducts()
    const cart = req.session.cart
    // console.log(products)
    if (cart.length > 0){
        const productCartMap = productHelpers.mapProductToCart(products, cart)
        res.render("home", {products: productCartMap})
    }else{
        res.render("home", {products: products})
    }
    // console.log(productCartMap)
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
    const productId = Number(req.body.productId);
    if(req.isLoggedIn){
        const added = await userData.addToUsersCart(req.session.user.email, productId)
        if(added){
            req.session.cart = await userData.getUsersCart(req.session.user.email)
        }
    }else{
        req.session.cart.push(productId);
    }
    const responseJson = {
        message: 'Product added to cart',
        cart: req.session.cart,
        length: req.session.cart.length,
    };
    res.status(200).json(responseJson);
})

router.route('/remove-from-cart').post(async (req, res) => {
    const productId = Number(req.body.productId);
    if(req.isLoggedIn){
        console.log('Logged In')
        await userData.removeFromCart(req.session.user.email, productId)
    }

    const indexToRemove = req.session.cart.indexOf(productId)
    if (indexToRemove !== -1) {
        req.session.cart.splice(indexToRemove, 1);
    }
    const responseJson = {
        message: 'Product removed from cart',
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