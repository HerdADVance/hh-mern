import App from "next/app";
import Layout from '../components/_App/Layout'
import { parseCookies, destroyCookie } from 'nookies'
import { redirectUser } from '../utils/auth'
import baseUrl from '../utils/baseUrl'
import axios from 'axios'
import Router from 'next/router'

class MyApp extends App {

	static async getInitialProps({ Component, ctx }) {

		const { token } = parseCookies(ctx)

		let pageProps = {}

		if(Component.getInitialProps){
			pageProps = await Component.getInitialProps(ctx)
		}

		if(!token) { // Redirect to login page if trying to access protected page w/ no token
			const isProtectedRoute = ctx.pathname === '/account' || ctx.pathname === '/create'
			if(isProtectedRoute){ 
				redirectUser(ctx, '/login') 
			}
		} else { // Get user's account data w/ token and pass to props
			try{
				const payload = { headers: { Authorization: token } }
				const url = `${baseUrl}/api/account`
				const response = await axios.get(url, payload)
				const user = response.data

				// If auth, but not admin or root, redirect from create page to homepage
				const isRoot = user.role === 'root'
				const isAdmin = user.role === 'admin'
				const isNotPermitted = !(isRoot || isAdmin) && ctx.pathname === '/create'
				if(isNotPermitted) {
					redirectUser(ctx, '/')
				}

				pageProps.user = user

			} catch (error) { // Couldn't get user
				console.error("Error getting current user", error)
				
				// Throw out invalid
				destroyCookie(ctx, "token")

				// Redirect to login page
				redirectUser(ctx, "/login")
			}
		}

		return { pageProps }
	}

	componentDidMount() {
		window.addEventListener('storage', this.syncLogout) // listens to changes on localStorage and calls function below
	}

	syncLogout = event => { // Will make sure all tabs logout if one does
		if(event.key === 'logout') {
			Router.push('/login')
		}
	}

	render() {
		const { Component, pageProps } = this.props;
		return(
			<Layout {...pageProps} >
				<Component {...pageProps} />
			</Layout>
		);
	}
}

export default MyApp;
