pragma solidity ^0.8.0; //// Solidity compiler version.

/*
    Author: Gustavo Hammerschmidt.
    Project: Diskify.
    Year: 2021.
    University: PUCPR - Pontifícia Universidade Católica do Paraná.

    Description:
    
        - add description...
        

*/

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol"; // NFT Standard.


////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// References' Links:

// https://medium.com/pinata/ipfs-privacy-711f4b72b2ea

// https://solidity-by-example.org/sending-ether/
// https://medium.com/cryptologic/memory-and-storage-in-solidity-4052c788ca86
// https://medium.com/coinmonks/stack-too-deep-error-in-solidity-608d1bd6a1ea

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// How royalties work:

// diskify royalties [1% to 5%]  
// artist royalties [1% to 5%]
// divided as parts per thousand (because there's no float type).
// Example: if 5%, var== 0050; if 3.9%, var== 0039;
// Msg.value is divided in one thousand parts and sent proportionally to each address.

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// TO DO:

// colocar mint na função setalbum e pegar mint na getalbum. (upado na ipfs)

// Carve functions to better modify attributes in person.
// One-time set name for artist approved or person on set-function call.

// Adapt events to general form with extension string to describe function behavior.

// function to auto set for artist bid times (do it on react.js).

// check if content is blocked and unable trading.

// Fazer função hash das tracks (keccak256).

// Redefine constant owner value before deploying.

// add description on first comments block.

// test modifiers with msg.sender and tx.origin.

// make view functions for a variety of struct vars: it'll be the api state on blockchain.
 
////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// definir top 100 e top moment

// eu preciso de uma nft para o album struct que eu tiver em memory no contrato


// eu preciso de uma função de venda para os versions do nft.
// definir tempo de bid num array em album


// set new-release mapping or struct for bidtime not expired on nft.

// define function to execute within a time to change ownership 
// for that, put the albums bidded to be checked on the board.

// define bidding list on album for current bids (5 bids maximum)

// make approval tax flexible | defined by owner.

// artistas de uma banda - possiblitar nomes.

contract Diskify  {


    // Static Variables:

    //// Unique ID (generator-mapper) for album.
	uint256 public album_id_counter;
	
	//// Unique ID (generator-mapper) for album content: information.
	uint256 public album_info_id_counter;
	
	//// Unique ID (generator-mapper) for person (a.k.a. new user logged).
	uint256 public person_id_counter;
    
    //// Contract owner's address: grants owner access to moderator operations.
    address private constant owner = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2; 
    
    
    // Events:
    
    //// Logs on function call setAlbum: register that an album has been created.
    event NewAlbum(address indexed _artist, uint256 _block_timestamp, uint256 _album_id_counter, string _artist_name);
    
    //// Logs on function call setAlbumInfo: register that an album information has been set.
    event NewAlbumInfo(address indexed _artist, uint256 _block_timestamp, uint256 _album_info_id_counter);
    
    //// Logs on function call approveMeAsArtist: register that a person requested a diskify musician approval.
    event NewArtist(address indexed _artist, uint256 _block_timestamp, bool _attempt_status);
    
    //// Logs on function call setPerson: resgister solicitation to become a diskify user.
    event NewPerson(address indexed _person, uint256 _block_timestamp,  uint256 _person_id_counter);
    
    //// Logs on function call setBlockForAlbumId: register that content is blocked for usage or trading.
    event SetBlock(address indexed _owner, uint256 _block_timestamp, string _setOrUnset, uint256 _album_id);
    
    //// Logs on function call settingMyNFTToSale: register on call to set album to sale.
    event SettingNFTOnSale(address indexed _owner, uint256 _block_timestamp, uint256 _album_id, uint256 _my_price, uint256 _bid_expire_time);
    
    //// Logs on function call setPersonName or setPersonReferences: register an modification to person attributes.
    event SetPersonAttribute(address indexed _caller, uint256 _block_timestamp, string _attribute);
    
    
    // Constructor:	
	
	constructor () public  {
	    
	    // Initializing owner to address deployer [MUST BE FIXED ADDRESS ON REAL DEPLOY].
	    //owner = msg.sender;
	    
	    // Initializing unique id generator-mapper to 0. 
	    album_id_counter = 0;
	    
	    // Initializing unique id generator-mapper to 0.
	    person_id_counter = 0;
	    
	}
	
	
	// Structs:
	
	//// Defines the album information (content) storage and access.
	struct AlbumInfo {
	    
	    // Artist:
	    
	    address artist_address; //// (Sic.)
	    
	    string artist_name; //// (Sic.)
	    
	    
	    // Album: 
	    
	    uint256 release_date; //// Block.timestamp at creation.
	    
	    string name; //// Album name. (Sic.)
	    
	    uint8 genre_counter; //// (Sic.)
        		
		string[] genre; //// (Sic.)

		uint8 track_hash_counter; //// Counts the number of the tracks in album.
		
		string[] track_hash; //// Links to tracks' content.
		
		string[] track_name; //// Tracks' name. (Sic.)

		string album_cover_hash; //// (Sic.)
	    
	}
	
	//// Defines Album's trading-related properties. 
	struct Album {
	    
	    // Album Info:
	    
		uint256 album_info_pointer; //// (Sic.)
		
		
		// Blocked:
		
		bool block; //// Content is blocked. (Sic.)
		
		
		// Royalties:
		
		uint8 diskify_royalties; //// (Sic.)
		
		uint8 artist_royalties; //// (Sic.)
		
		
        // Owners:
        
        uint16 max_owners; //// NFT album (1 out of max_owners) property.

        address[] album_owners; //// (Sic.)
        
        
        // Prices (open to bid > 0):
        
        uint256[] prices; //// Indexed NFT price.
        
        uint256[] bid_time; //// Indexed NFT open-to-bidding time.

	} 
	
	//// Defines Person attributes to addresses on Diskify net.
	struct Person {
        
		bool approved_as_artist; //// Address is a Diskify approved artist. (Sic.)

		string name; //// Address nickname. (Sic.)
		
		string photo; //// (Sic.)
		
		string references_to_persona; //// References to social media and description.
		
		uint256 my_albums_counter; //// (Sic.)
		
		uint256[] owned_albums; //// (Sic.)
		
		uint256 created_on; //// Account creation date. (Sic.)
		
		bool setted; //// If the person is already defined then don't redefine.
		
	}
	
	
	// Mappings:
	
	//// HashMap of AlbumInfos.
	mapping (uint256 => AlbumInfo) public list_of_albums_info;
	
	//// HashMap of Albums.
	mapping (uint256 => Album) public list_of_albums;
	
	//// HashMap of Users.
	mapping (address => Person) public diskify_users;
	
	//// HashMap of Users' address: contract-owner access only.
	mapping (uint256 => address) private list_of_users;
	
	
	// Modifiers:
	
	//// Caller must have access to album.
    modifier hasAlbum(address _user, uint256 _album_id) {
        
        Album memory pointer = list_of_albums[_album_id];
        
        bool hasIt = false;
        
        for(uint16 i = 0; i < pointer.max_owners; i++) {
            
            if (_user == pointer.album_owners[i]) {
                
                hasIt = true;
                
                break;
                
            }
            
        }
        
        if (msg.sender == owner) {
            
            hasIt = true;
            
        }
        
        require(hasIt, "Address does not have album");
        _;
        
    }
    
    //// Caller must be contract owner.
    modifier isOwner() {
        
        require(msg.sender == owner, "Address is not the contract owner");
        _;
        
    }
    
    //// Caller must be approved as artist.
    modifier isApprovedAsArtist(address _artist) {
        
        require(diskify_users[_artist].approved_as_artist, "Address is not an approved artist");
        _;
        
    }
    
    //// Caller must be person-struct unset by time function is called.
    modifier notSet(address _user) {
        
        require(diskify_users[_user].setted==false, "User already defined");
        _;
        
    }
    
    //// Caller must be person-struct set by time function is called.
    modifier userSet(address _user) {
        
        require(diskify_users[_user].setted, "User not defined");
        _;
        
    }
    
    
    // Functions:
	
	//// Proceeding for artist approvel.
	function approveMeAsArtist(address payable _to) external payable returns(bool) { 
	    
	    require(tx.origin.balance >= 100000000000000000, "O.01 ETH required to become artist.");
	    
	    require(_to == owner && msg.value >= 100000000000000000, "Address to be sent not match");
	    
	    bool confirm = _to.send(msg.value);
        
        if (confirm) {
            
            diskify_users[tx.origin].approved_as_artist = true;
               
        }
        
        emit NewArtist(msg.sender, block.timestamp, confirm);
        
	    return confirm;
	    
	}
	
	//// Proceeding for getting album.
	function getAlbum(uint256 _album_id) view public hasAlbum(msg.sender, _album_id) returns(Album memory) {
        
        return list_of_albums[_album_id];
        
    }
    
    //// Proceeding for getting album id-counter upper limit.
    function getAlbumIdCounter() view public isOwner returns(uint256) {
        
        return album_id_counter;
        
    }
    
    //// Proceeding for getting current block.timestamp.
    function getBlockTimestamp() view public returns(uint256) {
        
        return block.timestamp;
        
    }
    
    //// Proceeding for getting person id-counter upper limit.
    function getPersonIdCounter() view public isOwner returns(uint256) {
        
        return person_id_counter;
        
    } 
    
    //// Proceeding for setting album trading-related properties.
	function setAlbum ( 
	
	    uint256 _album_info_pointer, uint8 _diskify_royalties, uint8 _artist_royalties,  
	    uint16 _max_owners, address[] memory _default_to_artist, uint256[] memory _prices, 
	    uint256[] memory _bid_time
	
	) public isApprovedAsArtist(msg.sender)
	{
	    
        list_of_albums[album_id_counter] = 
        
        Album({
               album_info_pointer: _album_info_pointer,
	           block: false,
	           diskify_royalties: _diskify_royalties,
	           artist_royalties: _artist_royalties,
	           max_owners: _max_owners,
	           album_owners: _default_to_artist,
	           prices: _prices,
	           bid_time: _bid_time
	    });
	    
	    emit NewAlbum(msg.sender, block.timestamp, album_id_counter, list_of_albums_info[_album_info_pointer].name);
	  
	    album_id_counter += 1;   
	    
	}
    
    //// Proceeding for setting album content-related properties.
    function setAlbumInfo(
        
        string memory _album_name, uint8 _genre_counter, string[] memory _genres, 
	    uint8 _track_hash_counter, string[] memory _track_hash, string[] memory _track_name, string memory _album_cover_hash
        
    ) public isApprovedAsArtist(msg.sender) returns(uint256)
    {
     
        AlbumInfo memory _album_info = AlbumInfo({
	        
	           artist_address: msg.sender, 
	           artist_name: diskify_users[msg.sender].name,
	           release_date: block.timestamp, 
	           name: _album_name,
	           genre_counter: _genre_counter,
	           genre: _genres,
	           track_hash_counter: _track_hash_counter,
	           track_hash: _track_hash,
	           track_name: _track_name,
	           album_cover_hash: _album_cover_hash
	        
	    });
        
        uint256 hold = album_info_id_counter;
        
        list_of_albums_info[hold] = _album_info;
        
        emit NewAlbumInfo(msg.sender, block.timestamp, hold);
        
        album_info_id_counter += 1;
        
        return hold;
        
    }
    
    //// Proceeding for setting content blocking flag.
    function setBlockForAlbumId(uint256 _album_id, bool _set) public isOwner {
        
        string memory _s_set = (_set)? "SET" : "UNSET";
        
        emit SetBlock(msg.sender, block.timestamp, _s_set, _album_id);
        
        list_of_albums[_album_id].block = _set;
        
    }
    
    //// Proceeding for setting user NFT to sale.
    function settingMyNFTToSale(uint256 _album_id, uint256 _my_price, uint256 _bid_expire_time) public hasAlbum(msg.sender, _album_id) {
        
        Album memory pointer = list_of_albums[_album_id];
        
        for (uint16 i = 0; i < pointer.max_owners; i++) {
            
            if(pointer.album_owners[i] == msg.sender) {
                
                pointer.prices[i] = _my_price;
                
                pointer.bid_time[i] = _bid_expire_time + block.timestamp;
                
                emit SettingNFTOnSale(msg.sender, block.timestamp, _album_id, _my_price, _bid_expire_time);
                
                break;
                
            }
            
        }
        
    }
    
    //// Proceeding for setting person attributes for the first time.
    function setPerson(string memory _name, string memory _references_to_persona) public notSet(msg.sender) {
	    
	    uint256[] memory _owned_albums;
	    
	    diskify_users[msg.sender] = 
        
        Person({approved_as_artist: false,
                name: _name,
                photo: "",
                references_to_persona: _references_to_persona,
                my_albums_counter: 0,
                owned_albums: _owned_albums,
                created_on: block.timestamp,
                setted: true
        });
        
        list_of_users[person_id_counter] = msg.sender;
        
	    emit NewPerson(msg.sender, block.timestamp, person_id_counter);
	    
	    person_id_counter += 1;   
	    
	}
    
    //// Proceeding for setting person name when already defined.
    function setPersonName(string memory _name) public userSet(msg.sender) {
        
        emit SetPersonAttribute(msg.sender, block.timestamp, "NAME");
        
        diskify_users[msg.sender].name = _name;
        
    }
    
    //// Proceeding for setting person references-to-persona when already defined.
    function setPersonReferences(string memory _references) public userSet(msg.sender) {
        
        emit SetPersonAttribute(msg.sender, block.timestamp, "REFERENCES");
        
        diskify_users[msg.sender].references_to_persona = _references;
        
    }
    






    ////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    
    // TESTING ZONE [ TO BE DELETED OR MODIFIED ].
    
    modifier is_default_to_blocked(bool _default) {
        
        require( !_default, "BLOCKED BY DEFAULT ::: TESTING" );
        _;
    }
    
    
    function function_testing_get_balance() view public is_default_to_blocked(true) returns(uint256){
    
        return owner.balance;
        //99.999999999966805102 ether
        
        // Ethereum Virtual Machine doesn't have float-typed values.
        // That's why 1 ether has 18 zeros after it.
        // The smaller ether unit is 1 (wei);
        // which would be equivalent to a dollar cent.
        
    } 
    
    
    function safeTransferFrom(
        
        address _from, 
        address _to,
        uint256 _from_nft_price,
        uint256[] memory _ids, 
        uint256[] memory _amounts, 
        bytes memory _data
    
    ) external payable is_default_to_blocked(true) {
            
        require(_to.balance >= _from_nft_price, "Balance lower than nft price");
        
        
        //safeTransferFrom(from, to, ids, amounts, data);
     
        /*
        
        require(tx.origin.balance >= 100000000000000000, "O.01 ETH required to become artist.");
	    
	    require(_to == owner && msg.value >= 100000000000000000, "Address to be sent not match");
	    
	    bool confirm = _to.send(msg.value);
        
        if (confirm) {
            
            diskify_users[tx.origin].approved_as_artist = true;
               
        }
        
        emit NewArtist(msg.sender, block.timestamp, confirm);
        
	    return confirm;
	    
        */
     
        
    }
    
	  

    ////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    
    

} 
