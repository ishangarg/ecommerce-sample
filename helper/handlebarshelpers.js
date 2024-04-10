export function calculateTotal(price, quantity) {
    price = Number(price)
    quantity = Number(quantity)
    return (price * quantity).toFixed(2); 
}