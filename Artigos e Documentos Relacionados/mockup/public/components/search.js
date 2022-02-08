
document.onreadystatechange = () => {

	if (document.readyState === 'complete') {
  
		setInterval(document.getElementById('i_searchbar').onchange = function(){
			
			if (typeof this.value === 'undefined' || this.value === null) {
				
			} else { 

				this.addEventListener("keyup", function(event) {
    					
    				if (event.key === "Enter") {
					
						window.location.href = '/search?s='+this.value.toString();
        		
       				}

   				});

			}

		}, 1000);

	}

};
