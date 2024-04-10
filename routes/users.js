import { Router } from "express";
import { userData } from "../data/index.js";
import { productData } from "../data/index.js";

const router = Router()

router.route('/login').get(async (req, res) => {

    const messages = req.getMessages()
    console.log(messages)
    const obj = {}

    if (messages.length > 0){
        obj.hasMsg = true
        obj.msg = messages[0].message
        obj.msgType = messages[0].type
    }

    res.render('users/login', obj)

}).post(async (req, res) => {

    const email = req.body.email
    const password = req.body.password

    try{
        const user = await userData.authenticateUser(email, password)
        if (user === null){
            req.addMessage('error', 'User Does Not Exist')
            res.redirect('/users/login')
            return
        }

        req.session.user = user
        if (req.session.cart.length > 0){
            //cart exists save to users db
            const saved = await userData.addToUsersCart(user.email, req.session.cart)
            console.log('Cart: ' + saved)
        }
        res.redirect('/')
        return
    }catch(error){
        req.addMessage('error', error)
        res.redirect('/users/login')
        return
    }


});

router.route('/signup').get(async (req, res) => {

    res.render('users/signup', {})

}).post(async (req, res) => {

    const email = req.body.email
    const password1 = req.body.password1
    const password2 = req.body.password2

    if (password1 !== password2){
        const error = 'Password Do Not Match'
        res.render('users/signup', {emai:email, hasMsg: true, msg:error, msgType: 'error'})
        return
    }

    try{
        const user = await userData.createUser(email, password1)
        req.addMessage('success', 'User Successfully Signed Up')
        res.redirect('/users/login')
    }catch(error){
        res.render('users/signup', {emai:email, hasMsg: true, msg:error, msgType: 'error'})
        return
    }

});

router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.log('Error destroying session:', error);
        } else {
            res.redirect('/'); 
        }
    });
});

router.route('/cart').get(async (req, res) => {
    if (!req.session.user) {
        try {
            let cart = req.session.cart;
            let products = await productData.getProductsFromIdArray(cart);
            console.log(products)
            res.render('cart', { products });
        } catch (error) {c
        }
    } else {
        try{
            let cart = await userData.getUsersCart(req.session.user.email)
            let products = await productData.getProductsFromIdArray(cart);

            res.render('cart', { products });


        }catch(error){
            console.error('Error fetching products:', error);
            res.status(500).send('Error fetching products');
        }
    }
});

export default router