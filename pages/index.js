import React from 'react'
import axios from 'axios'
import ProductList from '../components/Index/ProductList'
import baseUrl from '../utils/baseUrl'

function Home({ products }) {

	console.log(products)
	
	// React.useEffect(() => {
	// 	getProducts()
	// }, [])

	// async function getProducts(){ //automatically returns promise
	// 	const url = 'http://localhost:3000/api/products'
	// 	const response = await axios.get(url)
	// 	console.log(response.data)
	// }

 	return <ProductList products={products}/>;
}

Home.getInitialProps = async () => { // fetching from server instead of from client (above w/ use effect and get products)
	const url = `${baseUrl}/api/products`
	const response = await axios.get(url)
	return { products: response.data }
	// object will be merged w/ existing props
}

export default Home;
