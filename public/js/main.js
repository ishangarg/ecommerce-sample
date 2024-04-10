$(document).ready(function(){
    // console.log("ready");

    $('.product-card').click(function() {
        var productId = $(this).data('id');
        window.location.href = '/product/' + productId;
    });

    $('.add-to-cart-btn').click(function(event) {
        event.stopPropagation();
        
        var productId = $(this).data('id');
        
        $.ajax({
            url: '/add-to-cart',
            type: 'POST',
            data: { productId: productId },
            success: function(response) {
                const newCartLength = response.length;
                rerenderCartLength(newCartLength)
                $(event.target).text('Added').prop('disabled', true);

            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    });

    $('.cart-remove-btn').click(function(event){
        var productId = $(this).data('id');
        $(this).closest('.cart-item').remove();

        if ($('#cart-items').children().length === 0) {
            $('#cart-items').append('<p class="cart-empty-msg">Cart Empty!</p>');
        }

        $.ajax({
            url: '/remove-from-cart', // Replace with your actual endpoint
            method: 'POST',
            data: { productId: productId },
            success: function(response) {
                console.log('Item removed from cart');
            },
            error: function(xhr, status, error) {
                console.error('Error removing item from cart:', error);
            }
        });
    });

    $('.quantity-select').change(function() {
        const quantity = parseInt($(this).val());
        const price = parseFloat($(this).closest('.cart-item').find('.current-price').text().replace('Price: $', ''));
        const totalPrice = price * quantity;
        $(this).closest('.cart-item').find('.total-price #total-price-text').text(totalPrice.toFixed(2));
    });


});