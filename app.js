import express from 'express';
const app = express();
import appRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import sessionMiddleware, { attachCartToRequest, cartLengthMiddleware, setNavbarContext, isLoggedIn } from './middleware/session.js';
import { calculateTotal } from './helper/handlebarshelpers.js';

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  next();
};

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);
app.use(sessionMiddleware);
app.use(isLoggedIn);
app.use(setNavbarContext);
app.use((req, res, next) => { //custom middleware to create a global messages between views functionality
    if (!req.session.messages) {
        req.session.messages = [];
    }
    req.addMessage = (type, message) => {
        req.session.messages.push({ type, message });
    };
    req.getMessages = () => {
        const messages = req.session.messages;
        req.session.messages = [];
        return messages;
    };
    next();
});
app.use(attachCartToRequest)
app.use(cartLengthMiddleware)


app.engine('handlebars', exphbs.engine({defaultLayout: 'main', helpers: {calculateTotal}}));
app.set('view engine', 'handlebars');

appRoutes(app);

app.listen(3000, () => {
  console.log('Server Running: http://localhost:3000');
});
