class Header extends HTMLElement{

    constructor(){
        super();  
    }

    connectedCallback(){

        this.innerHTML = `

			<div class="grid grid-flow-col grid-rows-1 grid-cols-3 gap-1 lg:flex lg:items-center p-10 sm:p-8 object-center">
						
				<a class="w-1/5 m-auto rounded-lg" href="/"> <img src="/images/diskify_short.PNG"/> </a>

				<input id="i_searchbar" class="h-20 w-3/5 ml-4 mr-4 border-4 border-black rounded-2xl p-8 text-2xl hover:bg-gray-100" type="text" placeholder="Search">

				<button class="h-20 w-1/5 rounded-lg bg-black text-white text-2xl border-4 border-black hover:bg-gray-100 hover:text-black "> Connect Wallet </button>

			</div>

		`; 

	}

}

customElements.define('header-component', Header);
