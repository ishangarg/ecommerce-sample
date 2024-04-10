import session from 'express-session';
import { userData } from '../data/index.js';

const sessionMiddleware = session({
    secret: 'KjoLsPdbHB27VKKuDxSU',
    resave: false,
    saveUninitialized: true
  });
  
  const attachCartToRequest = async (req, res, next) => {
    if (req.isLoggedIn){
        //update cart state from the db
        req.session.cart = await userData.getUsersCart(req.session.user.email)

    }else{
        if (!req.session.cart) {
            req.session.cart = []; 
        }
    }

    res.locals.cart = req.session.cart;
    console.log(req.session.cart)
  
    next();
  };

const cartLengthMiddleware = (req, res, next) => {
    const cartLength = req.session.cart ? req.session.cart.length : 0;
    res.locals.cartLength = cartLength;

    next();
};

const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        req.isLoggedIn = true
    }else{
        req.isLoggedIn = false
    }
    next()
}

const setNavbarContext = (req, res, next) => {
    res.locals.loggedIn = req.session.user ? true : false;
    res.locals.email = req.session.user ? req.session.user.email : '';
    next();
};

export default sessionMiddleware;
export { attachCartToRequest, cartLengthMiddleware, setNavbarContext, isLoggedIn };