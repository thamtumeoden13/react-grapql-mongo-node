import React, { Fragment, Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import Auth from './pages/AuthPage'
import Events from './pages/EventsPage'
import Booking from './pages/BookingPage'
import MainNavigation from './components/Navigation/MainNavigation'

import AuthContext from './context/auth-context'

import './App.css';

class App extends Component {

	constructor(props) {
		super(props)
		this.state = {
			userId: null,
			token: null
		}
	}

	login = (userId, token, tokenExpiration) => {
		this.setState({ userId, token })
	}

	logout = () => {
		this.setState({ userId: null, token: null })
	}

	render() {
		const { userId, token } = this.state
		return (
			<BrowserRouter>
				<Fragment>
					<AuthContext.Provider value={{
						userId: userId,
						token: token,
						login: this.login,
						logout: this.logout
					}}>
						<MainNavigation />
						<main className="main-content">
							<Switch>
								{this.state.token && <Redirect from='/' to='/events' exact />}
								{this.state.token && <Redirect from='/auth' to='/events' exact />}
								{!this.state.token && (
									<Route path='/auth' component={Auth} />
								)}
								<Route path='/events' component={Events} />
								{this.state.token && (
									<Route path='/bookings' component={Booking} />
								)}
								{!this.state.token && <Redirect to='/auth' exact />}
							</Switch>
						</main>
					</AuthContext.Provider>
				</Fragment>
			</BrowserRouter>
		)
	}
}

export default App;
