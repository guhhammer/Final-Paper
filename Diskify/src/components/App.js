
import 'tailwindcss/tailwind.css';
import './App.css';
import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import NavBar from './NavBar';

import Diskify from './Diskify';
import Me from './Me';
import Mint from './Mint';
import Search from './Search';
import View from './View';


class App extends Component {


	render(){

		return (

			<div>

			<Router>

				<NavBar />

				<Switch> 

					<Route path='/' exact component={Diskify} />
					<Route path='/me' component={Me} />
					<Route path='/mint' component={Mint} />
					<Route path='/search' component={Search} />
					<Route path='/view/:id' component={View} />

				</Switch>

			</Router>

			</div>

		);

	}

}


export default App;