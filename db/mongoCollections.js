import { dbConnection } from "./mongoConnection.js";

const getCollection = (collection) => {
    let _col = undefined;

    return async () => {
        if (!_col) {
        const db = await dbConnection();
        _col = await db.collection(collection);
        }

        return _col;
    };
}

export const products = getCollection('products')
export const users = getCollection('users')
export const orders = getCollection('orders')