import User from '../../models/User'
import connectDb from '../../utils/connectDb'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

connectDb();
 
export default async (req, res) => {
	const { email, password } = req.body
	try {

		// Check to see if user exists with email
		const user = await User.findOne({ email }).select('+password') // Select overrides option on model

		// If not, return error
		if(!user){
			return res.status(404).send("No user exists with that email")
		}

		// Check to see if user's password matches
		const passwordsMatch = await bcrypt.compare(password, user.password)

		// If so, generate token and send token to client
		if(passwordsMatch){
			const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
			res.status(200).json(token)
		} else{
			res.status(401).send("Password doesn't match")
		}

	} catch(error) {
		console.error(error)
		res.status(500).send("Error logging in")
	}
}