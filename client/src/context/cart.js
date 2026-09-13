// React context API

import { useState, useContext, createContext, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    // preventing cart items from disappear after refreshing the page 
    useEffect(() => {
        let existingCartItem = localStorage.getItem('cart');
        if (existingCartItem) setCart(JSON.parse(existingCartItem));

    }, []);
    return (
        <CartContext.Provider value={[cart, setCart]}>
            {children}
        </CartContext.Provider>
    );
};

// custom Hook
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
