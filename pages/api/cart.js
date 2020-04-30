import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import Cart from '../../models/Cart'
import connectDb from '../../utils/connectDb'

connectDb();

const { ObjectId } = mongoose.Types

export default async (req, res) => {
	switch(req.method){
		case "GET":
			await handleGetRequest(req, res)
			break
		case "PUT":
			await handlePutRequest(req, res)
			break
		case "DELETE":
			await handleDeleteRequest(req, res)
			break
		default:
			res.status(405).send(`Method ${req.method} not allowed`)
			break
	}
}

async function handleGetRequest(req, res) {
	
	if (!("authorization" in req.headers)) {
		return res.status(401).send("No authorization found")
	}

	try {
		const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
		const cart = await Cart.findOne({ user: userId }).populate({ // Populate finds products associated with cart
			path: "products.product",
			model: "Product"
		})
		res.status(200).json(cart.products)
		
	} catch (error) {
		console.error(error)
		res.status(403).send("Please login again")
	}
}

async function handlePutRequest(req, res) {
	
	if (!("authorization" in req.headers)) {
		return res.status(401).send("No authorization found")
	}

	const { quantity, productId } = req.body

	try {
		const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
		
		// Get user cart based on id
		const cart = await Cart.findOne({ user: userId })

		// Check if product already exists in cart
		const productExists = cart.products.some(doc => ObjectId(productId).equals(doc.product))

		// If so, inrecement quantity by number provided
		if(productExists){
			await Cart.findOneAndUpdate( 
				{ _id: cart._id, "products.product": productId },
				{ $inc: { "products.$.quantity": quantity } }
			)
			// If not, add new product with given quantity 
		} else {
			const newProduct = { quantity, product: productId }
			await Cart.findOneAndUpdate (
				{ _id: cart._id },
				{ $addToSet: { products: newProduct } }
			)
		}

		// Return success message to client
		res.status(200).send("Cart updated.")
		
	} catch (error) {
		console.error(error)
		res.status(403).send("Please login again")
	}
}

async function handleDeleteRequest(req, res) {
	
	if (!("authorization" in req.headers)) {
		return res.status(401).send("No authorization found")
	}

	try {
		const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
		const { productId } = req.query

		const cart = await Cart.findOneAndUpdate( 
			{ user: userId },
			{ $pull: { products: { product: productId } } }, // $pull removes item from cart
			{ new: true } // new gets back the cart with the item pulled
		).populate({  // populate gets the products associated with it
			path: "products.product",
			model: "Product"
		})

		res.status(200).json(cart.products)
		
	} catch (error) {
		console.error(error)
		res.status(403).send("Please login again")
	}
}
