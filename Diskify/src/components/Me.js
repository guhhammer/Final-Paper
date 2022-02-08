import React, { Component } from 'react';
import './Me.css';
import _user from '../user.png';
import Web3 from 'web3';
import Diskify from '../abis/Diskify.json';

const {create} = require('ipfs-http-client');

const ipfs = create({host: 'ipfs.infura.io', port:5001, protocol:'https'});

      
class Me extends Component {


  async componentWillMount() {

    await this.loadWeb3();

    await this.loadBlockchainPersonData();

  }


  async loadBlockchainPersonData() {

    const web3 = window.web3;
    const _this = this;


    const accounts = await web3.eth.getAccounts();

    this.eth_account = accounts[0];

    console.log(this.eth_account);

    const networdId = await web3.eth.net.getId();
    const networkData = Diskify.networks[networdId];

    console.log(networkData, networdId)

    if (networkData) {

      const abi = Diskify.abi;
      this.contract = new web3.eth.Contract(abi, networkData.address);

      this.contract_address = networkData.address;

    } else { window.alert("Contract not deployed."); return; }

    console.log(this.contract);

    _this.contract.methods.getPerson(_this.eth_account).call({from: _this.eth_account}).then((res) => {

      _this.perfil_ipfs = res;

      console.log('Perfil ipfs hash:', res);

      _this.loadValuesInPage(res, _this);

    }).catch(() => {


      console.log('IPFS hash not initialized yet.')


    } );

  }


  async loadValuesInPage(ipfs_hash, __this) {

    if(this.perfil_ipfs.length == 0){ return; }

    fetch('https://ipfs.infura.io/ipfs/'+ipfs_hash).then( (res) => res.text())
    .then( (res) => {

      const __perfil = JSON.parse(res);


      __this.state.perfil_photo = __perfil.perfil_photo;
      __this.state.status_approved_as_artist = __perfil.status_approved_as_artist;
      __this.state.my_name = __perfil.my_name;
      __this.state.my_bio = __perfil.my_bio;
      __this.state.creation_date = __perfil.creation_date;
      __this.state.person_hash = __perfil.person_hash;

      
      console.log("-->", __perfil.perfil_photo)
      
      var _img = document.getElementById('img-cover');

      _img.onload = () => { URL.revokeObjectURL(_img.src); };

      _img.src = __perfil.perfil_photo;

      var _aux = 'fan';

      if( __this.state.status_approved_as_artist ){ _aux = 'artist'}

      document.getElementById('input-creationdate').value = " Creation Date: "+__this.state.creation_date;
      document.getElementById('input-currentstatus').value = " Current Status: "+_aux;
      document.getElementById('input-myname').value = __this.state.my_name;
      document.getElementById('textarea-mybio').value = __this.state.my_bio;

    });

  }


	constructor(props) {

    super(props);
    
    this.contract = '';

    this.contract_address = '';

    this.eth_account = '';

    this.state = {

    	perfil_photo: null,
    	status_approved_as_artist: null,
    	my_name: null,
    	my_bio: null,
    	creation_date: null,

    	person_hash: null

    };

    this.waiters = {

    	photo_trigerred: false,

    	status_trigerred: false

    };

    this.perfil_ipfs = '';

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


	capturePerfilPhoto = (event) => {

		event.preventDefault();

		this.waiters.photo_trigerred = true;

    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    const _this = this;

    var _img = document.getElementById('img-cover');

    _img.onload = () => { URL.revokeObjectURL(_img.src); };

    _img.src = URL.createObjectURL(file);

    reader.onloadend = () => {

      const _cover = Buffer(reader.result);

      ipfs.add(_cover).then(function(out){

        console.log("Perfil photo hash: ", out['path']);

        _this.state.perfil_photo = 'https://ipfs.infura.io/ipfs/' + out['path'];

        _this.waiters.photo_trigerred = false;

      });

    }

    console.log("Perfil photo captured.");

  }


  upgradeMe = (event) => {

  	event.preventDefault();

  	console.log('Approval ongoing...');

  	this.waiters.status_trigerred = true;

    const _this = this;

    _this.contract.methods.approveMeAsArtist("0xCD109A076466EFf8e224a3a10619f54b7e4ce2f1")
    .send({from: _this.eth_account, gas: 200000}).then((res) => {

  	_this.state.status_approved_as_artist = true;

    }).catch(_ => {})

		this.waiters.status_trigerred = false;

		console.log('Approval setted.');

  }


  onSubmit = (event) => {

  	event.preventDefault();

  	console.log('Submitting the form...');

  	if (this.waiters.status_trigerred || this.waiters.photo_trigerred) { return; }


  	const currentDate = new Date();
  	this.state.creation_date = 
      currentDate.getFullYear().toString()+"-"+
      (currentDate.getMonth()+1).toString()+"-"+
      currentDate.getDate();
  		
  	this.state.my_bio = document.getElementById('textarea-mybio').value;

  	this.state.my_name = document.getElementById('input-myname').value;

  	const _this = this;

  	ipfs.add( JSON.stringify(this.state) ).then( function(out) {

  		console.log('Perfil on ipfs: ', out['path']);

  		_this.state.person_hash = out['path'];

  		console.log('https://ipfs.infura.io/ipfs/'+out['path']);


      _this.contract.methods.setPerson(out['path'], _this.state.status_approved_as_artist)
      .send({from: _this.eth_account, gasPrice:2000000}).then((res) => {

        console.log('Person setted with ipfs hash of', out['path']);

      }).catch( () => {

        console.log('Setting rejected.');

      });


  	});


  	console.log('Submitted.');

    window.location.assign('/search');


  }


	render(){

		return (

			<div>
				<div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex grid grid-cols-1 text-center">
              <div className="mr-auto ml-auto -mt-8 w-1/2">
                
                <div className=' self-center ml-auto mr-auto w-1/2 h-1/2 min-h-96 min-w-96 max-w-96 max-h-96 border-4 border-black'> 
                <img src={_user} id='img-cover' className="h-full w-full Album_cover_display" alt="album cover image" />
                </div>
              
                <p className='h-auto mt-4 text-4xl font-bold font-mono'> My Info </p>
                
                <form onSubmit={this.onSubmit}> 
                  
                  <input type='text' id='input-creationdate' className='font-mono w-2/3 bg-gray-200 border-gray-300 h-auto rounded-lg text-3xl p-4 mb-2 hover:bg-gray-100 border-4 border-transparent ' value=" Creation Date: 2021-10-20" disabled/>
                  <br/>

                  <input type='text' id='input-currentstatus' className='font-mono w-2/3 bg-gray-200 border-gray-300 h-auto rounded-lg text-3xl p-4 mb-2 hover:bg-gray-100 border-4 border-transparent ' value=" Current Status: fan " disabled/>
                  <br/>

                  <input type='text' id='input-myname' className='font-mono w-2/3 bg-gray-100 border-gray-300 h-auto rounded-lg text-3xl p-4 mb-2 hover:bg-gray-100 border-4 border-transparent hover:border-black' placeholder=" My Name " />
                  <br/>
                  
                  <textarea id='textarea-mybio' className='bg-gray-100 border-4 border-gray-300 rounded-sm mt-2 mb-2 w-2/3 h-40 font-mono text-xl bg-sroll'> My bio :) </textarea>


                  <br/>
                  <label for='input-perfilphoto' className="w-5/6 h-auto text-4xl font-bold font-mono"> Change Perfil Photo: </label><br/>
                  <input type='file' id='input-perfilphoto' className='w-2/3 h-auto text-3xl' onChange={this.capturePerfilPhoto} />
                  <br/>

                  <br/>
                  <label for='input-becomeartist' className="w-5/6 h-auto text-4xl font-bold font-mono"> Become an Artist: </label><br/>
                  <button id='input-becomeartist' className='w-2/3 mt-2 mb-2 text-4xl h-auto font-bold font-mono text-gray-100 hover:text-black bg-black border-4 border-black hover:bg-white' onClick={this.upgradeMe} > Upgrade from Fan to Artist </button>

                  <br/>
                  <input type='submit' className='w-2/3 mt-2 mb-2 text-4xl h-auto font-bold font-mono text-gray-100 hover:text-black bg-black border-4 border-black hover:bg-white' value="Save Changes" />
                  <br/>
                  <br/>

                </form>

              </div>
            </main>
          </div>
        </div>

			</div>

		);

	}

}


export default Me;
