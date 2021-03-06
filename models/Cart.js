import mongoose from 'mongoose'
const { String, ObjectId, Number } = mongoose.Schema.Types

const CartSchema = new mongoose.Schema({
	user: {
		type: ObjectId,
		ref: "User"
	},
	products: [
		{
			quantity: {
				type: Number,
				default: 1
			},
			product: {
				type: ObjectId,
				ref: "Product"
			}
		}
	]
})

// the OR checks to see if it's already been created. Need this with serverless config
export default mongoose.models.Cart || mongoose.model('Cart', CartSchema)  