import User from '../../models/User'
import Cart from '../../models/Cart'
import connectDb from '../../utils/connectDb'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

connectDb();

export default async (req, res) => {
	const { name, email, password } = req.body
	try {
		
		// Validate name, email, password values
		if (!isLength(name, { min: 3, max: 10})){
			return res.status(422).send("Name must be 3-10 characters")
		} else if (!isLength(password, { min: 3, max: 10})){
			return res.status(422).send("Password must be 3-10 characters")
		} else if (!isEmail(email)){
			return res.status(422).send("E-Mail must be valid")
		}

		// Check to see if user already exists
		const user = await User.findOne({ email })
		if(user){
			return res.status(422).send(`User already exists with email ${email}`)
		}

		// If not, hash password
		const hash = await bcrypt.hash(password, 10) // 10 salt rounds

		// Create user
		const newUser = await new User({
			name,
			email,
			password: hash
		}).save()
		console.log({newUser})

		// Create cart for new user
		await new Cart({ user: newUser._id }).save()

		// Create token for new user
		const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

		// Send back token
		res.status(201).json(token)

	} catch(error) {
		console.error(error)
		res.status(500).send("Error signing up user. Try again later.")
	}
}