import mongoose from 'mongoose'
const { String } = mongoose.Schema.Types

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		select: false, // this field will not be returned with a found user
	},
	role: {
		type: String,
		required: true,
		default: 'user',
		enum: ["user", "admin", "root"] // restricts this value to exactly one of these strings
	}
}, {
	timestamps: true
})

// the OR checks to see if it's already been created. Need this with serverless config
export default mongoose.models.User || mongoose.model('User', UserSchema)  