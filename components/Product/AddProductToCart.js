import React from 'react'
import { Input } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import baseUrl from '../../utils/baseUrl'
import axios from 'axios'
import cookie from 'js-cookie'
import catchErrors from '../../utils/catchErrors'

function AddProductToCart({ user, productId }) {

    const [quantity, setQuantity] = React.useState(1)
    const [loading, setLoading] = React.useState(false)
    const [success, setSuccess] = React.useState(false)

    const router = useRouter()

    React.useEffect(() => { // Return add to cart's success message back to normal after 2 seconds
        let timeout
        if(success){
            timeout = setTimeout(() => setSuccess(false), 2000)
        }
        return () => { // the return function of useEffect functions as componentDidUnmount, prevents errors if user leaves page before 2 seconds
            clearTimeout(timeout)
        }
    }, [success])

    async function handleAddProductToCart() {
        try {
            setLoading(true)
            const url = `${baseUrl}/api/cart`
            const payload = { quantity, productId }
            const token = cookie.get('token')
            const headers = { headers: { Authorization: token } }
            await axios.put(url, payload, headers)
            setSuccess(true)
        
        } catch(error){
            catchErrors(error, window.alert)

        } finally {
            setLoading(false)
        }
        
    }

    return <Input
    	type="number"
    	min="1"
    	placeholder="Quantity"
        value={quantity}
        onChange={event => setQuantity(Number(event.target.value))}
    	action={
            user && success ? {
                color: 'blue',
                content: 'Item Added',
                icon: "plus cart",
                disabled: true
            } :
            user ? {
        		color: "orange",
        		content: "Add to Cart",
        		icon: "plus cart",
                loading,
                disabled: loading,
                onClick: handleAddProductToCart
        	} : {
                color: "blue",
                content: "Signup to purchase",
                icon: "signup",
                onClick: () => router.push('/signup')
            }
        }
    />;
}

export default AddProductToCart;
