import { users } from "../db/mongoCollections.js";
import { userHelpers } from "../helper/index.js";

const createUser = async (email, password) => {

    email = userHelpers.validateEmail(email)
    password = userHelpers.validatePassword(password)

    const registeredUser = await getUserByEmail(email)

    if (registeredUser !== null){
        throw "User Already Exists"
    }

    password = await userHelpers.encryptPassword(password)

    let newUser = {
        email: email,
        password: password,
        address: [],
        cart: [],
        orders: [],

    };

    const userCollection = await users();
    const newInsertInformation = await userCollection.insertOne(newUser);
    if (!newInsertInformation.insertedId) throw 'Insert failed!';

    return newInsertInformation

}

const getUserByEmail = async (email) => {
    try{
        console.log(email)
        const userCollection = await users()
        const searchResult = await userCollection.findOne({email});
        console.log(searchResult)
        return searchResult

    }catch(error){
        throw "User does not exist"
    }
}

const authenticateUser = async (email, password) => {
    try{
        const user = await getUserByEmail(email)
        if (user == null){
            throw "User does not exist"
        }
        const passwordMatches = await userHelpers.comparePassword(password, user.password)

        if(passwordMatches){
            return user
        }else{
            throw "Passwords Do Not Match"
        }


    }catch(error){
        throw error
    }
}

const addToUsersCart = async (email, cart) => {
    try{
        console.log(email)
        const userCollection = await users()
        const user = await userCollection.findOne({email});


        if (!user) {
            throw 'User not found'
        }

        console.log(user)

        const currentCart = user.cart || [];

        console.log(currentCart)

        // const user = await getUserByEmail(email)
        if (Array.isArray(cart)) {
            // user.cart = user.cart.concat(cart);
            const updatedCart = [...currentCart, ...cart];
            await userCollection.updateOne({ email }, { $set: { cart: updatedCart } });
        } else {
            currentCart.push(cart)
            await userCollection.updateOne({ email }, { $set: { cart: currentCart } });
        }

        return true;

    }catch(error){
        console.log('Cart Error: ' + error)
        throw error
    }
}

const removeFromCart = async (email, cart) => {
    try{
        const userCollection = await users()
        const user = await userCollection.findOne({email});

        if (!user) {
            throw 'User not found'
        }

        const currentCart = user.cart
        const i = currentCart.indexOf(cart)
        currentCart.splice(i, 1);

        await userCollection.updateOne(
            { email },
            { $set: { cart: currentCart } }
        );

    }catch(error){
        console.log('Remove Cart Error: ' + error)
        throw error
    }
}

const emptyUsersCart = async (email) => {
    try{
        const userCollection = await users()
        const user = await userCollection.findOne({email});

        if (!user) {
            throw 'User not found'
        }
        await userCollection.updateOne(
            { email },
            { $set: { cart: [] } }
        );
    }catch(error){
        throw error
    }
}

const getUsersCart = async (email) => {
    try{
        console.log('User: ' + email)
        const userCollection = await users()
        const user = await userCollection.findOne({email});

        if (!user) {
            throw 'User not found'
        }

        const currentCart = user.cart
        return currentCart
    }catch(error){
        console.log('Cart Fetch Error: ' + error)
        throw error
    }
}

export default {createUser, getUserByEmail, authenticateUser, addToUsersCart, removeFromCart, getUsersCart, emptyUsersCart}