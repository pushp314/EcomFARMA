import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.payload.product.id
      );

      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex].quantity += action.payload.quantity;
        return { ...state, items: updatedItems };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload),
      };
    }
    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
};

const initCart = () => {
  try {
    const localCart = localStorage.getItem('ecomfarma_cart');
    return localCart ? JSON.parse(localCart) : { items: [] };
  } catch (error) {
    return { items: [] };
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, null, initCart);

  useEffect(() => {
    localStorage.setItem('ecomfarma_cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (product, quantity = 1) => {
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, price: product.price } });
    toast.success('Added to cart');
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    toast.success('Removed from cart');
  };

  const updateQuantity = (productId, quantity, maxStock) => {
    if (quantity < 1) return;
    if (quantity > maxStock) {
      toast.error(`Only ${maxStock} items available`);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const cartCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
