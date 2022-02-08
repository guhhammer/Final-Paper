

for i in range(20):

	disabled = ' disabled' if i % 2 == 0 else ''
	text = 'Not Available' if i % 2 == 0 else 'On Sale'
	bgcolor = 'bg-gray-200' if i % 2 == 0 else 'bg-black'
	price = 2.0

	hovering = 'cursor-pointer hover:bg-gray-200' if i % 2 != 0 else ''

	#print(f'''<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: {i+1}/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="{bgcolor} border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black" {disabled}> {text} </button></div>	</div>\n''')

	print(f"""<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 w-auto lg:flex lg:items-center pl-8 {hovering}">\n\t<div class=""><p class=""> NFT Serial Number: {i+1}/20 - </p> </div>\n\t<div class=""><p class=""> {price} ETH - </p></div>\n\t<div class=""><p class="italic font-bold" {disabled}> {text} </p></div>	\n</div>""")


"""

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 1/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-gray-200 border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black"  disabled> Not on sale </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 2/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-black border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black" > Buy </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 3/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-gray-200 border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black"  disabled> Not on sale </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 4/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-black border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black" > Buy </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 5/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-gray-200 border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black"  disabled> Not on sale </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 6/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-black border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black" > Buy </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 7/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-gray-200 border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black"  disabled> Not on sale </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 8/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-black border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black" > Buy </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 9/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-gray-200 border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black"  disabled> Not on sale </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 10/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-black border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black" > Buy </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 11/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-gray-200 border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black"  disabled> Not on sale </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 12/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-black border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black" > Buy </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 13/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-gray-200 border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black"  disabled> Not on sale </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 14/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-black border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black" > Buy </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 15/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-gray-200 border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black"  disabled> Not on sale </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 16/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-black border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black" > Buy </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 17/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-gray-200 border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black"  disabled> Not on sale </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 18/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-black border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black" > Buy </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 19/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-gray-200 border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black"  disabled> Not on sale </button></div>	</div>

<div class="grid grid-flow-col grid-row-1 grid-cols-3 gap-2 lg:flex lg:items-center ml-8"><div class=""> <p class=""> NFT Serial Number: 20/20 - </p> </div><div class=""> <p class=""> 2.0 ETH - </p> </div><div class=""><button class="bg-black border-black border-4 rounded-md text-white hover:bg-gray-200 hover:text-black" > Buy </button></div>	</div>

"""

