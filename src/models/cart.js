let cart = null;

module.exports = class Cart {

    static save(product) {

        if (cart) { // cart is not empty
            const index = cart.products.findIndex(p => p.id == product.id);
            
            if (index >= 0) { // product already in cart
                const existingProduct = cart.products[index];
                existingProduct.stock++;
                cart.totalPrice += existingProduct.price;

            } else { // product not in cart
                product.stock = 1;
                cart.products.push(product);
                cart.totalPrice += product.price;

        }
    }
        else {
            cart = { products: [], totalPrice: 
                0 };
            cart.products.push(product);
            cart.totalPrice = product.price;
        }

    }
    static getCart() {
        return cart;
    }
}