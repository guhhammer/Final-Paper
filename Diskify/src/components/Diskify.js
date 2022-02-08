import React, { Component } from 'react';
import './Diskify.css';

import Web3 from 'web3';
import Abi_Diskify from '../abis/Diskify.json';

import logo_ from '../user.png'; 


const {create} = require('ipfs-http-client');

const ipfs = create({host: 'ipfs.infura.io', port:5001, protocol:'https'});


class Diskify extends Component {

	async componentWillMount() {

    await this.loadWeb3();

    await this.loadFrame();

  }

  async loadFrame(){

  	const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();

    this.eth_account = accounts[0];

	  const networdId = await web3.eth.net.getId();
    const networkData = Abi_Diskify.networks[networdId];

    console.log(networkData, networdId)

    if (networkData) {

      const abi = Abi_Diskify.abi;
      this.contract = new web3.eth.Contract(abi, networkData.address);


    } else { window.alert("Contract not deployed."); return; }
  
    const _this = this;


   	_this.contract.methods.getAlbum(4).call()

			.then( (res) => {

	    _this.loadValuesInPage(res['album_info_pointer_ipfs_hash'], _this, 1);

	   })
		 .then( () => {

			 	_this.contract.methods.getAlbum(3).call()

					.then( (res) => {

			    _this.loadValuesInPage(res['album_info_pointer_ipfs_hash'], _this, 2);

			  })

		 })
		 .then( () => {

		 	_this.contract.methods.getAlbum(2).call()

				.then( (res) => {

		    _this.loadValuesInPage(res['album_info_pointer_ipfs_hash'], _this, 3);

		   })

		 })
		 .catch( () => { 

    	console.log('nnn');

    });


  }

  loadValuesInPage = (ipfs_hash, __this, tag_id) => {

  	const correct_path = 'https://ipfs.infura.io/ipfs/'+ ipfs_hash;

    fetch(correct_path).then( (res) => res.text())
    .then( (res) => {

      const __album = JSON.parse(res);

      console.log("000",__album);

      var _img = document.getElementById('img-'+tag_id);

      _img.onload = () => { URL.revokeObjectURL(_img.src); };

      _img.src = 'https://ipfs.infura.io/ipfs/'+__album.album_cover.split('/')[4];

      document.getElementById('albumname-'+tag_id).innerHTML = __album.album_name;
      document.getElementById('genres-'+tag_id).innerHTML = __album.genres;
      document.getElementById('artistname-'+tag_id).innerHTML = __album.artist_name;
      document.getElementById('releasedate-'+tag_id).innerHTML = __album.release_date;

      this.high_refs.push(ipfs_hash);

    });

  }



	constructor (props) {

		super(props);

		this.state = {};

		this.contract = '';

		this.eth_account = '';

		this.high_refs = [];

	}


  async loadWeb3() {

	  if (window.ethereum) {

	    window.web3 = new Web3(window.ethereum);
	    await window.ethereum.enable();

	  } if (window.web3) {

	    window.web3 = new Web3(window.web3.currentProvider);

	  } else {

	  	console.log("User did not connect its metamask wallet.");

	  }

	}


	highlight1 = (event) => {

		event.preventDefault();

		window.location.assign('/view/'+this.high_refs[0]);

	}

	highlight2 = (event) => {

		event.preventDefault();

		window.location.assign('/view/'+this.high_refs[1]);

	}

	highlight3 = (event) => {

		event.preventDefault();

		window.location.assign('/view/'+this.high_refs[2]);

	}

	render(){

		return (

			<div>


				<p className="text-4xl font-bold italic ml-20 mb-10 mt-4 text-gray-800"> On Highlight: </p>

				<div onClick={this.highlight1} className="grid grid-flow-col grid-rows-6 grid-cols-2 gap-1 lg:flex lg:items-center mt-8 mb-20 h-96 p-10 sm:p-8 object-center">
			
					<div onClick="" className="grid grid-rows-1 grid-cols-2 w-full bg-gray-100 border-gray-300  h-auto rounded-lg text-3xl p-4 mb-2 hover:bg-gray-100 border-4 border-transparent hover:border-black">

			  		<div className='w-1/2 h-1/2 min-w-80 min-h-80 h-auto '>

			  		<img src='' id='img-1' className='h-auto w-auto' />

			  		</div>
			  		
			  		<div className='grid grid-rows-3 grid-cols-1 text-3xl font-mono'>

			  			<div className='grid grid-cols-2'>

				  			<p className='font-mono font-bold' id='albumname-1'>  </p>
				  		
				  			<p className='text-gray-600 font-italic' id='genres-1'> genres </p>

				  		</div>
				  		<div className='grid grid-cols-2'>

								<p className='font-mono font-bold' id='artistname-1'> artistname </p>

								<p className='text-gray-600 font-italic' id='releasedate-1'> release date </p>

				  		</div>

				  		<div className='grid grid-cols-2 content-center justify-items-center'>
								
								<button onclick={this.highlight1} className="justify-center h-20 w-40 rounded-lg bg-black text-white text-3xl border-4 border-black hover:bg-gray-100 hover:text-black"> View </button>

				  		</div>
        			
			  		</div>

			  	</div>
			 	
			 	</div>	
			 	<div onClick={this.highlight2} className="grid grid-flow-col grid-rows-6 grid-cols-2 gap-1 lg:flex lg:items-center mt-8 mb-20 h-96 p-10 sm:p-8 object-center">

			  	<div onClick="" className="grid grid-rows-1 grid-cols-2 w-full bg-gray-100 border-gray-300  h-auto rounded-lg text-3xl p-4 mb-2 hover:bg-gray-100 border-4 border-transparent hover:border-black">

			  		<div className='w-1/2 h-1/2 min-w-80 min-h-80 h-auto '>

			  		<img src='' id='img-2' className='h-auto w-auto' />

			  		</div>
			  		
			  		<div className='grid grid-rows-3 grid-cols-1 text-3xl font-mono'>

			  			<div className='grid grid-cols-2'>

				  			<p className='font-mono font-bold' id='albumname-2'>  albumname </p>
				  		
				  			<p className='text-gray-600 font-italic' id='genres-2'> genres </p>

				  		</div>
				  		<div className='grid grid-cols-2'>

								<p className='font-mono font-bold' id='artistname-2'> artistname </p>

								<p className='text-gray-600 font-italic' id='releasedate-2'> release date </p>

				  		</div>

				  		<div className='grid grid-cols-2 content-center justify-items-center'>
								
								<button onclick={this.highlight2} className="justify-center h-20 w-40 rounded-lg bg-black text-white text-3xl border-4 border-black hover:bg-gray-100 hover:text-black"> View </button>

				  		</div>
        			
			  		</div>
			  	</div>
			  </div>
				
				<div onClick={this.highlight3} className="grid grid-flow-col grid-rows-6 grid-cols-2 gap-1 lg:flex lg:items-center mt-8 mb-20 h-96 p-10 sm:p-8 object-center">
		  		<div onClick="" className="grid grid-rows-1 grid-cols-2 w-full bg-gray-100 border-gray-300  h-auto rounded-lg text-3xl p-4 mb-2 hover:bg-gray-100 border-4 border-transparent hover:border-black">

			  		<div className='w-1/2 h-1/2 min-w-80 min-h-80 h-auto '>

				  		<img src='' id='img-3' className='h-auto w-auto' />

			  		</div>
			  		
			  		<div className='grid grid-rows-3 grid-cols-1 text-3xl font-mono'>

			  			<div className='grid grid-cols-2'>

				  			<p className='font-mono font-bold' id='albumname-3'>  albumname </p>
				  		
				  			<p className='text-gray-600 font-italic' id='genres-3'> genres </p>

				  		</div>
				  		<div className='grid grid-cols-2'>

								<p className='font-mono font-bold' id='artistname-3'> artistname </p>

								<p className='text-gray-600 font-italic' id='releasedate-3'> release date </p>

				  		</div>

				  		<div className='grid grid-cols-2 content-center justify-items-center'>
								
								<button onclick={this.highlight3} className="justify-center h-20 w-40 rounded-lg bg-black text-white text-3xl border-4 border-black hover:bg-gray-100 hover:text-black"> View </button>

				  		</div>
	      			
				  	</div>

					</div>

				</div>

			 </div>

		);

	}

}


export default Diskify;
