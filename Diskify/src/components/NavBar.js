import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './NavBar.css';
import 'tailwindcss/tailwind.css';

import logo from '../logo.png';


class NavBar extends Component {

	render(){

		return (

			<div className='ml-2 mt-2 mr-2 text-3xl font-mono bg-black grid grid-flow-row grid-rows-1 grid-cols-6 place-items-center'>
				
				<Link to='/'>	<img src={logo} id='navbar-logo' className="App-logo w-80" alt="logo" /> </Link>

				<Link to="/" className="text-gray-300 hover:bg-gray-200 hover:text-black border-8 border-black hover:border-gray-200 rounded-xl no-underline hover:no-underline"> <a> Home </a> </Link> 
				<Link to="/me" className="text-gray-300 hover:bg-gray-200 hover:text-black border-8 border-black hover:border-gray-200 rounded-xl no-underline hover:no-underline"> <a> Me </a> </Link>

				<Link to="/mint" className="text-gray-300 hover:bg-gray-200 hover:text-black border-8 border-black hover:border-gray-200 rounded-xl no-underline hover:no-underline"> <a> Mint </a> </Link>
				<Link to="/search" className="text-gray-300 hover:bg-gray-200 hover:text-black border-8 border-black hover:border-gray-200 rounded-xl no-underline hover:no-underline"> <a> Search </a> </Link>

			</div>

		);

	}
}

export default NavBar;


