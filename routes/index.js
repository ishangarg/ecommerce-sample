import productRoutes from './products.js';
import userRoutes from './users.js';
import {static as staticDir} from 'express';


const allAppRoutes = (app) => {
    app.use('/', productRoutes);
    app.use('/users', userRoutes)
    app.use('/public', staticDir('public'));
    app.use('*', (req, res) => {
      res.status(404).set('Content-Type', 'text/html').send(Buffer.from('<p>404: Page Does Not Exist</p>')); 
    });
  };
  
  export default allAppRoutes;