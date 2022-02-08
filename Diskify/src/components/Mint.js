import React, { Component } from 'react';
import Web3 from 'web3';
import './Mint.css';
import Diskify from '../abis/Diskify.json';
import _cover_placeholder from '../cover_placeholder.png';


const {create} = require('ipfs-http-client');

const ipfs = create({host: 'ipfs.infura.io', port:5001, protocol:'https'});


class Mint extends Component {


  async componentWillMount() {

    await this.loadWeb3();

    await this.loadBlockchainData();

  }


  async loadBlockchainData() {

    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();

    this.eth_account = accounts[0];

    document.getElementById('input-youraddress').value = this.eth_account;

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


  constructor(props) {

    super(props);
   
    this.state = {

      artist_address: null,
      
      artist_name: null,

      release_date: null,
      
      album_name: null, 

      genres: null,
          
      track_names: [],

      album_cover: null, 

      track_hashes: [], 
      
      album_hash: null

    };

    this.eth_account = '';

    this.contract = null;

    this._memehash = '';

    this.album_cover_pushed = false;

    this.files_pushed = 0;
    this.files_counter = 0;

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


  captureAlbumCover = (event) => {

    event.preventDefault(); 

    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    const _this = this;
    this.album_cover_pushed = false;

    var _img = document.getElementById('img-cover');

    _img.onload = () => { URL.revokeObjectURL(_img.src); };

    _img.src = URL.createObjectURL(file);

    reader.onloadend = () => {

      const _cover = Buffer(reader.result);

      ipfs.add(_cover).then(function(out){

        console.log("Album cover hash: ", out['path']);

        _this.state.album_cover = 'https://ipfs.infura.io/ifps/' + out['path'];

        _this.album_cover_pushed = true;

      });

    }

    console.log("Album cover captured.");

  }


  captureFiles = (event) => {

    event.preventDefault();

    const _this = this;

    this.files_pushed = event.target.files.length;
    this.files_counter = 0;

    document.getElementById('textarea-displaytracks').value = '\r\n';

    for(var i = 0; i < event.target.files.length; i++){
      
      const file = event.target.files[i];
      
      _this.state.track_names.push(file.name);
      
      const reader = new window.FileReader();
      
      reader.readAsArrayBuffer(file);

      reader.onloadend = () => {

        console.log("Track (", file.name,") captured.");
 
        const bdata = Buffer(reader.result);

        ipfs.add(bdata).then( function(out) {

          console.log("Track (",file.name,") hash: ", out['path']);

          document.getElementById('textarea-displaytracks').value += (_this.files_counter+1).toString() +') ' + file.name + '\r\n';

          _this.state.track_hashes.push( 'https://ipfs.infura.io/ipfs/' + out['path'] );

          _this.files_counter += 1;

        });        

      }
  
    }

    console.log("Tracks captured.");

  }


  onSubmit = (event) => {

    event.preventDefault();

    console.log("Submitting the form...");

    while( this.album_cover_pushed === false ){ return; }

    while( this.files_counter < this.files_pushed || this.files_counter === 0){ return; } 

    var _ = document.getElementById("input-artistname").value;

    if (_.length < 1){
       this.state.artist_name = "anon";
    } else { this.state.artist_name = _;}


    this.state.album_name = document.getElementById("input-albumname").value;

    this.state.genres = document.getElementById("input-albumgenres").value;

    const currentDate = new Date();

    this.state.release_date = 
      currentDate.getFullYear().toString()+"-"+
      (currentDate.getMonth()+1).toString()+"-"+
      currentDate.getDate();

    this.state.artist_address = this.eth_account;


    _ = document.getElementById('input-initialoffer').value;
    if (_.length < 1){
      _ = 1;
    }
    const initial_price = ( +( _ ) ) * 100000;

    _ = document.getElementById('input-diskifyroyalties').value;
    if (_.length < 1){
      _ = 1;
    } else if ( +(_) > 5.0 || +(_) < 1.0){ _ = 5.0; }
    const diskify_royalties = parseInt( +(_) * 10 );

    _ = document.getElementById('input-artistroyalties').value;
    if (_.length < 1){
      _ = 1;
    } else if ( +(_) > 5.0 || +(_) < 1.0){ _ = 5.0; }
    const artist_royalties = parseInt( +(_) * 10 );

    _ = document.getElementById('input-ncopies').value;
    if (_.length < 1){
      _ = 1;
    } 
    const n_copies = parseInt( _ );


    const _this = this;
    var _hash = "";


    ipfs.add( JSON.stringify(this.state) ).then( function(out) { 

      console.log("Minted Album Hash: ", out['path']);

      _this.state.album_hash = out['path'];

      console.log( 'https://ipfs.infura.io/ipfs/' + out['path'] );

    console.log(_this.state.album_hash, diskify_royalties, artist_royalties, initial_price, n_copies, _this.state.artist_name)
   
      _this.contract.methods
      .setAlbum(_this.state.album_hash, diskify_royalties, artist_royalties, initial_price, n_copies, _this.state.artist_name)
      .send({from: _this.eth_account})
      .then((res) => {

        console.log(res);

      })
      .catch( _ => {

        console.log("No res");

      });



    });

    console.log("Mint done.");

    window.location.assign('/search');

  }


  render() {
    return (
      <div>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex grid grid-cols-1 text-center">
              <div className="mr-auto ml-auto -mt-8 w-1/2">
                
                <div className=' self-center ml-auto mr-auto w-1/2 h-1/2 min-h-96 min-w-96 max-w-96 max-h-96 border-4 border-black'> 
                <img src={_cover_placeholder} id='img-cover' className="h-full w-full Album_cover_display" alt="album cover image" />
                </div>
              
                <p className='h-auto mt-4 text-4xl font-bold font-mono'> Mint Your Album </p>
                
                <form onSubmit={this.onSubmit}> 
                  
                  <input type='text' id='input-youraddress' className='font-mono w-2/3 bg-gray-100 border-gray-300 h-auto rounded-lg text-3xl p-4 mb-2 hover:bg-gray-100 border-4 border-transparent hover:border-black' value='' disabled/>
                  <br/>

                  <input type='text' id='input-albumname' className='font-mono w-2/3 bg-gray-100 border-gray-300 h-auto rounded-lg text-3xl p-4 mb-2 hover:bg-gray-100 border-4 border-transparent hover:border-black' placeholder=" Album's Name " />
                  <br/>

                  <input type='text' id='input-artistname' className='font-mono w-2/3 bg-gray-100 border-gray-300 h-auto rounded-lg text-3xl p-4 mb-2 hover:bg-gray-100 border-4 border-transparent hover:border-black' placeholder=" Artist Name(s) " />
                  <br/>

                  <input type='text' id='input-albumgenres' className='font-mono w-2/3 bg-gray-100 border-gray-300 h-auto rounded-lg text-3xl p-4 mb-2  hover:bg-gray-100 border-4 border-transparent hover:border-black' placeholder=" Album Genres " />
                  <br/>

                  <input type='text' id='input-initialoffer' className='font-mono w-2/3 bg-gray-100 border-gray-300 h-auto rounded-lg text-3xl p-4 mb-2  hover:bg-gray-100 border-4 border-transparent hover:border-black' placeholder=" Initial Price (in ETH) " />
                  <br/>

                  <input type='text' id='input-diskifyroyalties' className='font-mono w-2/3 bg-gray-100 border-gray-300 h-auto rounded-lg text-3xl p-4 mb-2  hover:bg-gray-100 border-4 border-transparent hover:border-black' placeholder=" Diskify Royalties (1-5%) " />
                  <br/>

                  <input type='text' id='input-artistroyalties' className='font-mono w-2/3 bg-gray-100 border-gray-300 h-auto rounded-lg text-3xl p-4 mb-2 hover:bg-gray-100 border-4 border-transparent hover:border-black' placeholder=" Artist Royalties (1-5%) " />
                  <br/>

                  <input type='text' id='input-ncopies' className='font-mono w-2/3 bg-gray-100 border-gray-300 h-auto rounded-lg text-3xl p-4 hover:bg-gray-100 border-4 border-transparent hover:border-black' placeholder=" Album Number of Copies " />
                  <br/>

                  <br/>
                  <label for='input-albumcover' className="w-5/6 h-auto text-4xl font-bold font-mono"> Select Album Cover Image: </label><br/>
                  <input type='file' id='input-albumcover' className='w-2/3 h-auto text-3xl' onChange={this.captureAlbumCover} />
                  <br/>

                  <br/>
                  <label for='input-tracks' className="w-5/6 h-auto text-4xl font-bold font-mono"> Select Album's Tracks: </label><br/>
                  <input type='file' id='input-tracks' className="w-2/3 h-auto text-3xl" onChange={this.captureFiles} webkitdirectory mozdirectory msdirectory odirectory directory multiple="multiple" />
                  <br/>

                  <textarea id='textarea-displaytracks' className='bg-gray-200 border-4 border-gray-300 rounded-sm mt-2 w-2/3 h-40 font-mono text-xl bg-sroll' disabled> No tracks yet :( </textarea>

                  <br/>
                  <input type='submit' className='w-1/3 mt-2 mb-2 text-4xl h-auto font-bold font-mono text-gray-100 hover:text-black bg-black border-4 border-black hover:bg-white' value="Mint" />
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

export default Mint;
