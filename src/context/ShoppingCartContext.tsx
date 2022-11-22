import {useContext, createContext, ReactNode, useState} from 'react'
import { ShoppingCart } from '../components/ShoppingCart'
import {useLocalStorage} from '../hooks/useLocalStorage';


type ShoppingCartProviderProps ={
    children: ReactNode // type we give to children inside of react
}

type ShoppingCartContext = {
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    openCart: () => void 
    closeCart: () => void
    cartQuantity: number
    cartItems: CartItem[]

}

type CartItem = {
    id: number 
    quantity: number
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({children}: ShoppingCartProviderProps){


    const [isOpen, setIsOpen] = useState(false);

    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('shopping-cart', [])

    const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0)

    function getItemQuantity(id: number) {
        return cartItems.find(item => item.id === id)?.quantity || 0 // ?. will check if there is a quantity in the item.id.quantity object
    }

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)

    function increaseCartQuantity(id: number) {
        setCartItems(currItems => {
            if(currItems.find(item => item.id === id) == null) {
                return [...currItems, {id, quantity: 1}]
            } else {
                return currItems.map(item => {
                    if(item.id === id) {
                        return {...item, quantity: item.quantity + 1} // increases quantity by 1 specifically in the id
                    }else {
                        return item
                     }
                })
            }
        })
//           function increaseCartQuantity(id: number) {
//     setCartItems(currItems => {
//       if (currItems.find(item => item.id === id) == null) {
//         return [...currItems, { id, quantity: 1 }]
//       } else {
//         return currItems.map(item => {
//           if (item.id === id) {
//             return { ...item, quantity: item.quantity + 1 }
//           } else {
//             return item
//           }
//         })
//       }
//     })
//   }
    }

    function decreaseCartQuantity(id: number) {
        setCartItems(currItems => {
            if(currItems.find(item => item.id === id)?.quantity === 1) {
                return currItems.filter(item => item.id !== id)
            } else {
                return currItems.map(item => {
                    if(item.id === id) {
                        return {...item, quantity: item.quantity - 1} // increases quantity by 1 specifically in the id
                    }else {
                        return item
                     }
                })
            }
        })
    }

    function removeFromCart(id: number) {
        setCartItems(currItems => {
            return currItems.filter(item => item.id !== id)
        })
    }


    return <ShoppingCartContext.Provider value={{cartItems, cartQuantity, openCart, closeCart, getItemQuantity, removeFromCart, increaseCartQuantity, decreaseCartQuantity}}>
        {children}
        {/*  This will be a popup in the context*/}
        <ShoppingCart isOpen={isOpen} /> 
    </ShoppingCartContext.Provider>
} 