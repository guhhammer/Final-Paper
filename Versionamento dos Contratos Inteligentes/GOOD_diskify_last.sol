pragma solidity ^0.8.0; //// Solidity compiler version.


/*

    Author: Gustavo Hammerschmidt.
    Project: Diskify.
    Year: 2021.
    University: PUCPR - Pontifícia Universidade Católica do Paraná.

    Description:
    
        Diskify is a music NFT marketplace project. Digital albums are
        transformed into non-fungible tokens and traded with this smart 
        contract. Scarcity and rarity are the qualities that derive from
        this business model, like the old vinil disks, moreover artists
        can now receive royalties per copy of their albums negociated.
        
*/


import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol"; // NFT Standard.


////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// References' Links:

// https://docs.openzeppelin.com/contracts/3.x/erc1155
// https://medium.com/cryptologic/memory-and-storage-in-solidity-4052c788ca86
// https://medium.com/coinmonks/stack-too-deep-error-in-solidity-608d1bd6a1ea
// https://medium.com/pinata/ipfs-privacy-711f4b72b2ea
// https://solidity-by-example.org/sending-ether/

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

// Options further:

// Make track hash functions on .js (keccak256).

// Redefine constant owner value before deploying.

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////




contract Diskify is ERC1155 {


    // Static Variables:

    //// Unique ID (generator-mapper) for album.
	uint256 public album_id_counter;
	
	//// Unique ID (generator-mapper) for person (a.k.a. new user logged).
	uint256 public person_id_counter;
    
    //// Unique ID (generator-mapper) for the new 100 mints.
    uint256 public minted_nfts_100_counter;
    
    //// Unique ID (generator-mapper) for the latest 100 sold.
    uint256 public sold_nfts_100_counter;
    
    //// Contract owner's address: grants owner access to moderator operations.
    address public constant owner = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2; 
    
    //// Contract's fee policy.
    uint256 public artist_fee = 100000000000000000;
    
    
    // Events:
    
    //// Logs on function call setAlbum: register that an album has been created.
    event NewAlbum(address indexed _artist, uint256 _block_timestamp, uint256 _album_id_counter, string _artist_name);
    
    //// Logs on function call approveMeAsArtist: register that a person requested a diskify musician approval.
    event NewArtist(address indexed _artist, uint256 _block_timestamp, bool _attempt_status);
    
    //// Logs on function call setPerson: resgister solicitation to become a diskify user.
    event NewPerson(address indexed _person, uint256 _block_timestamp,  uint256 _person_id_counter);
    
    //// Logs on function call setPerson: register a change to person info on IPFS.
    event ChangePersonIPFS(address indexed _person, uint256 _block_timestamp, string _ipfs_hash);
    
    //// Logs on function call tradeNFT: register a nft trade.
    event NFTTraded(address indexed _buyer, address indexed _seller, uint256 _block_timestamp, uint256 _album_id, uint256 _my_price);
    
    //// Logs on function call setBlockForAlbumId: register that content is blocked for usage or trading.
    event SetBlock(address indexed _owner, uint256 _block_timestamp, string _setOrUnset, uint256 _album_id);
    
    //// Logs on function call settingMyNFTToSale: register on call to set album to sale.
    event SettingNFTOnSale(address indexed _owner, uint256 _block_timestamp, uint256 _album_id, uint256 _my_price);
    
    
    // Constructor:	

	constructor () public ERC1155("") {
	    
	    album_id_counter = 0; // Initializing unique id generator-mapper to 0. 
	    
	    person_id_counter = 0; // Initializing unique id generator-mapper to 0.
	    
	    minted_nfts_100_counter = 0; // Initializing unique id generator-mapper to 0.
	    
	    sold_nfts_100_counter = 0; // Initializing unique id generator-mapper to 0.
	    
	}
	
	
	// Structs:
	
	//// Defines Album's trading-related properties. 
	struct Album {
	    
	    // Album Info:
		
		string album_info_pointer_ipfs_hash; //// (Sic.)
		
		// Artist address:
		
		address artist; //// (Sic.)
		
		// Blocked:
		
		bool block; //// Content is blocked. (Sic.)
		
		// Royalties:
		
		uint8 diskify_royalties; //// (Sic.)
		
		uint8 artist_royalties; //// (Sic.)
		
	} 
	
	
	// Mappings:
	
	//// HashMap of Albums.
	mapping (uint256 => Album) private list_of_albums;
	
	//// HashMap of Users.
	mapping (address => string) public diskify_users;
	
	//// HashMap of Users with permission to post content.
	mapping (address => bool) public user_is_artist;
	
	//// HashMap of Users' address: contract-owner access only.
	mapping (uint256 => address) private list_of_users;
	
	//// HashMap of nfts and their prices by owner. If price is 0, then is not on sale.
	mapping (uint256 => mapping (address => uint256) ) public nft_price;
	////      NFT ID               OWNER      PRICE 

    //// HashMap to check the latest nfts sold.
    mapping (uint256 => uint256) public last_100_sold;
    
    //// HashMap to check the new nfts minted.
    mapping (uint256 => uint256) public top_100_new_release;
    
    
	// Modifiers:
	
	//// Caller must have access to album.
    modifier hasAlbum(address _user, uint256 _album_id, bool isTrading) {
        
        bool hasIt = false;
        
        if ( balanceOf(_user, _album_id) > 0 || (tx.origin == owner && !isTrading ) ) {
            
            hasIt = true;
            
        }
        
        require(hasIt, "Address does not have album");
        _;
        
    }
    
    //// Caller must be contract owner.
    modifier isOwner() {
        
        require(tx.origin == owner, "Address is not the contract owner");
        _;
        
    }
    
    //// Caller must be approved as artist.
    modifier isApprovedAsArtist(address _artist) {
        
        require(user_is_artist[_artist], "Address is not an approved artist");
        _;
        
    }
    
    //// Album requested must not be blocked.
    modifier isBlocked(uint256 _album_id) {
        
        require( !list_of_albums[_album_id].block, "Content is blocked" );
        _;
        
    }
    
    
    // Functions:
	
	//// Proceeding for artist approvel.
	function approveMeAsArtist(address payable _to) external payable returns(bool) { 
	    
	    require(tx.origin.balance >= artist_fee, "Your account doesn't have the artist fee amount in balance.");
	    
	    require(_to == owner && msg.value >= artist_fee, "Address to be sent not match");
	    
	    bool confirm = _to.send(msg.value);
        
        if (confirm) {
            
            user_is_artist[tx.origin] = true;
            
        }
        
        emit NewArtist(tx.origin, block.timestamp, confirm);
        
	    return confirm;
	    
	}
	
	//// Proceeding for getting Album struct info.
	function getAlbum(uint256 _album_id) public view virtual returns(Album memory) {
	    
	    return list_of_albums[_album_id];
	    
	}
	
    //// Proceeding for getting album id-counter upper limit.
    function getAlbumIdCounter() public view virtual isOwner returns(uint256) {
        
        return album_id_counter;
        
    }

    //// Proceeding for getting album.
	function getAlbumIPFSHash(uint256 _album_id) public view virtual hasAlbum(tx.origin, _album_id, false) isBlocked(_album_id) returns(string memory) {
        
        return list_of_albums[_album_id].album_info_pointer_ipfs_hash;
        
    }
    
    //// Proceeding for getting the current artist-fee policy.
	function getArtistFee() public view virtual returns(uint256) {
	    
	    return artist_fee;
	    
	}
	
    //// Proceeding for getting current block.timestamp.
    function getBlockTimestamp() public view virtual returns(uint256) {
        
        return block.timestamp;
        
    }
    
    //// Proceeding for getting the latest sold nft.
    function getLatest100sold(uint256 _album_id) public view virtual returns(string memory) {
        
        return list_of_albums[ last_100_sold[_album_id] ].album_info_pointer_ipfs_hash;
        
    }
    
    //// Proceeding for getting person attributes.
    function getPerson(address _caller) public view virtual returns(string memory) {
        
        return diskify_users[_caller];
        
    }
    
    //// Proceeding for getting person id-counter upper limit.
    function getPersonIdCounter() public view virtual isOwner returns(uint256) {
        
        return person_id_counter;
        
    } 
    
    //// PProceeding for getting the new-release minted nft.
    function getTop100Release(uint256 _album_id) public view virtual returns(string memory) {
        
        return list_of_albums[ top_100_new_release[_album_id] ].album_info_pointer_ipfs_hash;
        
    }
    
    //// Proceeding for getting the address of contract users in the net.
    function getUserAddress(uint256 _index) public view virtual isOwner returns(address) {
        
        return list_of_users[_index];
        
    }
    
    //// Proceeding for setting album trading-related properties.
	function setAlbum( 
	
	    string memory _album_info_pointer, uint8 _diskify_royalties, uint8 _artist_royalties,  
	    uint256 _price, uint256 n_copies, string memory _artist_name
	
	) public isApprovedAsArtist(tx.origin) 
	{
	    
        list_of_albums[album_id_counter] = 
        
        Album({
               album_info_pointer_ipfs_hash: _album_info_pointer,
               artist: tx.origin,
	           block: false,
	           diskify_royalties: _diskify_royalties,
	           artist_royalties: _artist_royalties
        });
        
      
        _mint(tx.origin, album_id_counter, n_copies, "");
        
	    emit NewAlbum(tx.origin, block.timestamp, album_id_counter, _artist_name);
	  
	  
        nft_price[album_id_counter][tx.origin] = _price;
	    
	    emit SettingNFTOnSale(tx.origin, block.timestamp, album_id_counter, _price);
	    
	  
	    if(minted_nfts_100_counter > 99){
	        
	        minted_nfts_100_counter = 0;

	    }
	    
	    top_100_new_release[minted_nfts_100_counter] = album_id_counter;
	    
	    minted_nfts_100_counter += 1;
	  
	    album_id_counter += 1;
	    
	}
    
    //// Proceeding for setting a new fee policy.
    function setArtistFee(uint256 _new_fee) public isOwner {
            
        artist_fee = _new_fee;
        
    }
    
    //// Proceeding for setting content blocking flag.
    function setBlockForAlbumId(uint256 _album_id, bool _set) public isOwner {
        
        string memory _s_set = (_set)? "SET" : "UNSET";
        
        emit SetBlock(tx.origin, block.timestamp, _s_set, _album_id);
        
        list_of_albums[_album_id].block = _set;
        
    }
    
    //// Proceeding for setting person attributes.
    function setPerson(string memory _ipfs_info_hash, bool _is_artist) public {
	    
	    if (bytes(diskify_users[tx.origin]).length == 0) {
	       
	       list_of_users[person_id_counter] = tx.origin;
	        
	       person_id_counter += 1;   
	        
	       emit NewPerson(tx.origin, block.timestamp, person_id_counter);
	   
	    }
	    
	    diskify_users[tx.origin] = _ipfs_info_hash;
	    user_is_artist[tx.origin] = _is_artist;
	    
	    emit ChangePersonIPFS(tx.origin, block.timestamp, _ipfs_info_hash);
	    
	}
    
    //// Proceeding for setting user NFT to sale.
    function settingMyNFTToSale(uint256 _album_id, uint256 _my_price) public hasAlbum(tx.origin, _album_id, true) {
        
        nft_price[_album_id][tx.origin] = _my_price;
        
        emit SettingNFTOnSale(tx.origin, block.timestamp, _album_id, _my_price);
        
    }

    //// Proceeding for trading a NFT.
    function tradeNFT(

        address payable _to, address payable _artist, 
        address payable _owner, uint256 _album_id
        
    ) external payable hasAlbum(_to, _album_id, true) isBlocked(_album_id) returns(bool) 
    {
        
        require(msg.value >= nft_price[_album_id][_to], "Msg.value inferior to nft price.");
        require(_artist == list_of_albums[_album_id].artist, "Incorrect artist address.");
        require(_owner == owner, "Incorrect owner address.");
        
        uint256 _diskify_share = (msg.value / 1000) * list_of_albums[_album_id].diskify_royalties ;
        
        uint256 _artist_share = (msg.value / 1000) * list_of_albums[_album_id].artist_royalties ;
        
        uint256 _nft_owner_share = ((msg.value) - _diskify_share) - _artist_share;
    
        _owner.send(_diskify_share);
        _artist.send(_artist_share);
        _to.send(_nft_owner_share);
    
        safeTransferFrom(_to, tx.origin, _album_id, 1, "0x0");
        
        nft_price[_album_id][_to] = 0;
        
        emit NFTTraded(tx.origin, _to, block.timestamp, _album_id, msg.value);
        
    }


} 

