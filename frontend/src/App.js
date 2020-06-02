import React, { Fragment } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import Auth from './pages/AuthPage'
import Events from './pages/EventsPage'
import Booking from './pages/BookingPage'
import MainNavigation from './components/navigation/MainNavigation'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Fragment>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Redirect from='/' to='/auth' exact />
            <Route path='/auth' component={Auth} />
            <Route path='/events' component={Events} />
            <Route path='/bookings' component={Booking} />
          </Switch>
        </main>
      </Fragment>
    </BrowserRouter>
  );
}

export default App;
