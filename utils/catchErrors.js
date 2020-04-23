function catchErrors(error, displayError) {
	let errorMsg
	if(error.response){
		// Request made and server responded with not 200-something
		errorMsg = error.response.data
		console.error("Error response", errorMsg)

		// Cloudinary image uploads
		if(error.response.data.error){
			errorMsg = error.response.data.error.message  
		}
	} else if(error.request){
		// Request was made but no response receieved
		errorMsg = error.request
		console.error("Error request", errorMsg)
	} else{
		// Something else happpened
		errorMsg = error.message
		console.error("Error message", errorMsg)
	}

	displayError(errorMsg)
}

export default catchErrors