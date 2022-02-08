import React, { Component } from 'react';
import Web3 from 'web3';
import './View.css'
import Diskify from '../abis/Diskify.json';
import _cover_placeholder from '../cover_placeholder.png';


const {create} = require('ipfs-http-client');

const ipfs = create({host: 'ipfs.infura.io', port:5001, protocol:'https'});


class View extends Component {


	async componentWillMount() {

    await this.loadWeb3();

    await this.loadBlockchainData();

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

	async loadBlockchainData() {

    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();

    this.eth_account = accounts[0];

    console.log(accounts);

    const networdId = await web3.eth.net.getId();
    const networkData = Diskify.networks[networdId];

    console.log(networkData, networdId)

    if (networkData) {

      const abi = Diskify.abi;
      this.contract = new web3.eth.Contract(abi, networkData.address);

      this.loadValuesInPage();

    } else { window.alert("Contract not deployed."); return; }
    
    console.log(this.contract);

  }

  async loadValuesInPage() {
  	
  	console.log('https://ipfs.infura.io/ipfs/'+window.location.href.split('/')[4])

  	const _this = this;
  	fetch('https://ipfs.infura.io/ipfs/'+window.location.href.split('/')[4])
  	.then( (res) => res.text())
  	.then( (res) => {

  		const __album = JSON.parse(res);

  		console.log(__album);

  		document.getElementById('p-from').innerHTML = 'Artist address: '+__album.artist_address;
  		
  		document.getElementById('p-artistname').innerHTML = 'Artist name: '+__album.artist_name;
  		document.getElementById('p-releasedate').innerHTML = 'Release date: '+__album.release_date;

  		document.getElementById('p-albumname').innerHTML = 'Album name: '+__album.album_name;
  		document.getElementById('p-genres').innerHTML = 'Genres: '+__album.genres;

  		document.getElementById('textarea-displaytracks').value = '\r\n';

  		for(var i = 0; i < __album.track_names.length; i++){

  			document.getElementById('textarea-displaytracks').value += i.toString() + ') ' + __album.track_names[i] + '\r\n';

  		} 

  		var _img = document.getElementById('img-cover');

	    _img.onload = () => { URL.revokeObjectURL(_img.src); };

	    _img.src = "https://ipfs.infura.io/ipfs/"+__album.album_cover.split('/')[4];

  		console.log('track_hashes: ', __album.track_hashes);


  		_this.contract.methods.owner().call()
  		.then( (res) => {

  			_this.owner_address = res;

  		})
  		.catch( () => {

  			console.log('owner() related problem');

  		});	

  		_this._address_of_artist = __album.artist_address;


  		var allipfs = [];


  		_this.contract.methods.album_id_counter().call()
  		.then( (res) => {

  			const upper_limit = parseInt(res);

  			var counter = 0;
  			for(var _i = 0; _i < upper_limit; _i++){

  				_this.contract.methods.getAlbum(_i).call()
  				.then( (res) => {

  					allipfs.push(res['album_info_pointer_ipfs_hash']);

  					if (window.location.href.split('/')[4] === res['album_info_pointer_ipfs_hash']){
  						
  						_this.album_aid = allipfs.indexOf(res['album_info_pointer_ipfs_hash']);

  						document.getElementById('p-blocked').innerHTML = 'Content is blocked: '+res['block'];
  						document.getElementById('p-diskifyroyalties').innerHTML = 'Diskify royalties: ' + 
  																																		(parseInt(res['diskify_royalties']) / 10).toString() +"%";
  						
  						document.getElementById('p-artistroyalties').innerHTML = 'Artist royalties: '+
																																			(parseInt(res['artist_royalties']) / 10).toString() +"%";
							
							 
  						_this.contract.methods.balanceOf(__album.artist_address, counter).call()
  						.then( (res) => {

  							document.getElementById('p-ncopies').innerHTML = 'Number of copies: ' + res;

  						})
  						.catch( () => {

  							console.log('balanceOf() related problem');

  						});

  						_this.aid_acquired = true;

  					}
  					
  					counter += 1;

  				}).catch( () => {

  					console.log('getAlbum() related problem');

  				});

  			}

  		})
  		.catch( () => {

  			console.log("Problem acquiring methods.")

  		})

  	})
  	.catch( () => {

  		console.log('invalid url');

  	});


  }


	constructor (props) {

		super(props);

		this.hash = window.location.href.split('/')[4];

		this.eth_account = '';

		this.contract	= '';

		this.album_aid = -1;

		this.aid_acquired = false;

		this._address_of_artist = '';

		this.owner_address = '';

	}


	purchaseNFT = (event) => {

		event.preventDefault();

		while( this.aid_acquired === false ){ ; }
		
		const _this = this;

		console.log(_this.album_aid);

		_this.contract.methods.balanceOf(_this.eth_account, _this.album_aid).call()
		.then( (res) => {  

				console.log('This account has ',res,' of nft-id (',_this.album_aid,') in its balance'); 

		})
		.catch( () => {

			console.log('balanceOf() related problem.');

		})

		console.log(_this._address_of_artist);

		console.log("aid", _this.album_aid);

		_this.contract.methods.nft_price(_this.album_aid, _this._address_of_artist).call()
		.then( (res) => {

			const msgvalue = parseInt(res) + 100000;

			_this.contract.methods.tradeNFT(_this.eth_account, _this._address_of_artist, "0xCD109A076466EFf8e224a3a10619f54b7e4ce2f1", _this.album_aid)
			.send({from: _this.eth_account, value: msgvalue})
			.then( (res) => {

				console.log('hey', res);

			})
			.catch( () => {

				console.log('tradeNFT() related problem');

			});

		})
		.catch( () => {

			console.log('nft_price() related problem');

		});


	}


	render() {

		return (

			<div>
			<div className="container-fluid mt-5">
      <div className="row">
      
        <main role="main" className="col-lg-12 grid grid-cols-1 grid-rows-2 grid-flow-row text-center">
          
          <div className="mr-auto ml-auto -mt-8 w-3/4 grid grid-cols-2 grid-rows-1">
            
            <div className='self-center ml-auto mr-auto min-h-96 min-w-96 max-w-full max-h-full border-4 border-black'> 
            
            	<img src={_cover_placeholder} id='img-cover' className="h-full w-full Album_cover_display" alt="album cover image" />
            
            </div>

            <div className='font-bold font-mono text-xl h-auto mt-20'> 

	            <p id='p-from'> </p>	
	            <p id='p-artistname'> </p>
	            <p id='p-releasedate'> </p>
	            <p id='p-albumname'> </p>
	            <p id='p-genres'> </p>

              <textarea id='textarea-displaytracks' className='bg-gray-200 border-4 border-gray-300 rounded-sm mt-2 w-5/6 h-60 font-mono text-xl bg-sroll' disabled> No tracks yet :( </textarea>

            </div>

          </div>

          <div className="mr-auto ml-auto -mt-8 w-3/4 grid grid-cols-1">
						
						<div>

	          	<div className='font-bold font-mono text-xl h-auto mt-20'>

		            <p id='p-blocked'> </p>	
		            <p id='p-diskifyroyalties'> </p>
		            <p id='p-artistroyalties'> </p>
								<p id='p-ncopies'> </p>
		            
	            </div>

          	  <button onClick={this.purchaseNFT} className='text-center w-1/3 mt-2 mb-2 text-4xl h-1/6 font-bold font-mono text-gray-100 hover:text-black bg-black border-4 border-black hover:bg-white'>
          	  Purchase
          	  </button>
            
            </div>

          </div>

        </main>         

      </div>
    	</div>
			</div>

		);

	}


}



export default View;

