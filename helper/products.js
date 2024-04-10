const mapProductToCart = (products, cart) => {
    if (cart != null && cart != undefined && Array.isArray(cart) ){
        const cartArry = cart.map(str => parseInt(str));
        products.forEach(product => {
            if (cartArry.includes(product.apiId)) {
                product.incart = true;
            } else {
                product.incart = false;
            }
        });
        return products;
    }
}

export default {mapProductToCart}