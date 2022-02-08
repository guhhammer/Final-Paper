class Footer extends HTMLElement{

    constructor(){
        super();  
    }

    connectedCallback(){

        this.innerHTML = `

            <div class="bg-black grid grid-flow-col grid-rows-1 grid-cols-3 gap-1 lg:flex lg:items-center p-20 sm:p-10 object-center">

                <img class="w-1/5 ml-2 rounded-lg max-w-full mr-4" src="/images/diskify_short.PNG"/>
                
                <a class="text-xl text-white hover:text-gray-400" href="https://www.instagram.com/guhhammer/"> Instagram </a>

                <a class="text-xl text-white ml-auto mr-2 hover:text-gray-400" href="/guidelines" id="footer_community"> Community guidelines </a>

                <a class="text-xl text-white mr-2 hover:text-gray-400" href="/terms" id="footer_terms"> Terms of Service </a>
                
                <a class="text-xl text-white mr-2 hover:text-gray-400" href="/privacy" id="footer_privacy"> Privacy Policies </a>

                <a class="text-xl text-white mr-2 hover:text-gray-400" href="/help" id="footer_help"> Help </a>

            </div>

        `;

    }

}

customElements.define('footer-component', Footer);
