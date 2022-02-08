import React, { Component } from 'react';
import './Search.css';

import Web3 from 'web3';
import Diskify from '../abis/Diskify.json';

import no_results from '../no_results.png';


const {create} = require('ipfs-http-client');

const ipfs = create({host: 'ipfs.infura.io', port:5001, protocol:'https'});


class Search extends Component {

	async componentWillMount() {

    await this.loadWeb3();

    await this.loadBlockchainData();

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


    } else { window.alert("Contract not deployed."); return; }
    
    console.log(this.contract);

  }



  constructor (props) {

  	super(props);

  	this.state = {};

  	this.eth_account = '';
  	this.contract = '';

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


	logging_noresult = (_query) => {

		if (_query.length > 0){

			//document.getElementById('div-noresults').innerHTML = '';

		} else {

			//document.getElementById('div-noresults').innerHTML = ""; //add div later;

		}

	}


	finder = (number, query) => {

		const _this = this;

    _this.contract.methods.getAlbum(number).call({from: _this.eth_account}).then((res) => {

    		var aid = res['album_info_pointer_ipfs_hash'];

    		console.log('https://ipfs.infura.io/ipfs/'+aid);

    		fetch('https://ipfs.infura.io/ipfs/'+aid)
    		.then((res)=>res.text())
    		.then((res)=>{

    			const content = JSON.parse(res.toLowerCase());

    			var data_ = content['artist_name']+ " "+content['release_date']+ " "+
    			          content['album_name']+ " "+content['artist_name']+" "+content['genres']+" ";

    			const tracks = content['track_names'];
    			
    			for (var _i = 0; _i < tracks.length; _i++){

    				data_ += tracks[_i]+" ";

    			}

    			console.log(data_, data_.search(query.toLowerCase()))

    			if (data_.search(query.toLowerCase())) {

    					_this.resultConstructor(number);

    			}

    		}).catch( _ => console.log("error"));


    }).catch(() => {

    	console.log('unfetchable');
    	
    } );

	}


	resultConstructor = (number) => {

		const _this = this;

		var arr = [];

		_this.contract.methods.getAlbum(number).call({from: _this.eth_account}).then((res) => {

    		var aid = res['album_info_pointer_ipfs_hash'];

    		fetch('https://ipfs.infura.io/ipfs/'+aid)
    		.then((res)=>res.text())
    		.then((res)=>{

    			const content = JSON.parse(res);

    			arr.push(content['album_cover']);
    			arr.push(content['album_name']);
    			arr.push(content['genres']);
    			arr.push(content['artist_name']);
    			
    			_this.appender(arr, aid);

    		}).catch( _ => console.log("error2"));


    }).catch(() => {

    } );

		

	}


	appender = (arr, aid) => {


		const correct_path = 'https://ipfs.infura.io/ipfs/'+arr[0].split("/")[4];

		if (arr[1].length == 0) { arr[1] = 'This album has no name!'; }
		if (arr[2].length == 0) { arr[2] = 'This album has no genres!'; }
		if (arr[3].length == 0) { arr[3] = 'This album has no artist name!'; }

		console.log(arr, correct_path);

		var _img = document.createElement("IMG"); 
		_img.className = 'h-auto w-auto imImg';
		_img.src = correct_path;

		var _div1 = document.createElement("DIV");
		_div1.className = 'w-1/2 h-1/2 min-w-80 min-h-80 h-auto imDiv';

		_div1.appendChild(_img);


		var _p1 = document.createElement("P");
		_p1.innerHTML = arr[1]; _p1.className = "imP";
		var _p2 = document.createElement("P");
		_p2.innerHTML = arr[2]; _p2.className = "imP";
		var _p3 = document.createElement("P");
		_p3.innerHTML = arr[3]; _p3.className = "imP";


		var _div2 = document.createElement("DIV");
		_div2.className = 'grid grid-rows-3 grid-cols-1 text-3xl font-mono imDiv';

		_div2.appendChild(_p1);
		_div2.appendChild(_p2);
		_div2.appendChild(_p3);


		var _maindiv = document.createElement("DIV");
		_maindiv.className = "grid grid-rows-1 grid-cols-2 w-full bg-gray-100 border-gray-300  h-auto rounded-lg text-3xl p-4 mb-2 hover:bg-gray-100 border-4 border-transparent hover:border-black";

		_maindiv.onclick = this.handleView;

		_maindiv.appendChild(_div1);
		_maindiv.appendChild(_div2);

		_maindiv.id = aid;

		document.getElementById("div-appendresults").appendChild(_maindiv);


	}

	searching = (event) => {

		event.preventDefault();

		const _query = document.getElementById('input-search').value;

		document.getElementById('div-appendresults').innerHTML = "";

		this.logging_noresult(_query);

		const _this = this;


		var limit = 0;
		_this.contract.methods.album_id_counter().call({from: _this.eth_account})
		.then( (r) => {

		 	limit = parseInt(r); 

			for( var i = 0; i < limit+1; i++ ){

				_this.finder(i, _query);

			}

		})
		.catch( _ => console.log("error") );


	}

	handleView = (event) => {

		event.preventDefault();


		var hash = '';

		if (event.target.className.search("imP") > -1){

			hash = event.target.parentElement.parentElement.id;			

		} else if (event.target.className.search("imImg") > -1){

			hash = event.target.parentElement.parentElement.id;

		} else if (event.target.className.search("imDiv") > -1){

			hash = event.target.parentElement.id;

		} else {

			hash = event.target.id;

		}

		window.location.assign('/view/'+hash);

	}

	render(){

		return (

			<div>
        <div className="container-fluid mt-5">
          <div className="row ">
            <main role="main" className="col-lg-12 d-flex grid grid-cols-1 text-center ">
              <div id='div-search' className="mr-auto ml-auto -mt-8 w-5/6 ">
              
                <input type='text' id='input-search' onChange={this.searching} className='font-mono w-5/6 bg-gray-100 border-gray-300 h-auto rounded-lg text-3xl p-4 mb-2 hover:bg-gray-100 border-4 border-transparent hover:border-black' placeholder=" Search... " />
                <br/>

                <div id='div-appendresults' className=''>

                </div> 
              </div>
            </main>
          </div>
        </div>
      </div>

		);

	}

}


export default Search;


