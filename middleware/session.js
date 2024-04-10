import session from 'express-session';

const sessionMiddleware = session({
    secret: 'KjoLsPdbHB27VKKuDxSU',
    resave: false,
    saveUninitialized: true
  });
  
  const attachCartToRequest = (req, res, next) => {
    if (!req.session.cart) {
      req.session.cart = []; 
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

const setNavbarContext = (req, res, next) => {
    res.locals.loggedIn = req.session.user ? true : false;
    res.locals.email = req.session.user ? req.session.user.email : '';
    next();
};

export default sessionMiddleware;
export { attachCartToRequest, cartLengthMiddleware, setNavbarContext };