const mapProductToCart = (products, cart) => {
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

export default {mapProductToCart}