import cookie from 'js-cookie'
import Router from 'next/router'

export function handleLogin(token) {
	cookie.set('token', token)
	Router.push('/account') // Redirect to account page after login
}

export function redirectUser(ctx, location) {
	if(ctx.req){ // checking to see if on the server
		ctx.res.writeHead(302, { Location: location })
		ctx.res.end()
	} else { // on client
		Router.push(location)
	}
}

export function handleLogout() {
	cookie.remove('token')
	window.localStorage.setItem('logout', Date.now())
	Router.push('/login')
}