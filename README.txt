



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
    


Este projeto utiliza: 
	- IPFS (InterPlanetary File System)
	- Ethereum VM (Blockchain - Smart Contract escrito Solidity - lógica do servidor)
	- React.js (utilização da Abi do Diskify.sol + Interface da aplicação)
	- Metamask - extensão (Essa é a digital wallet usada no navegador para utilizar a aplicação). 

> Instalar a extensão da MetaMask no seu navegador.
> Instalar a versão mais recente da ganache ou a versão 5.1.67 (como especificado no package.json): https://www.trufflesuite.com/ganache 
> 
> Baixe o Projeto Diskify em seu computador.
> Abra o prompt do Node.js.
> Abra o diretório (...\Diskify>) e execute: npm install
> Execute: npm install --save ipfs-http-client
> Abra o seu ambiente ganache clique em quickstart.
> Certifique-se que seu RPC server é: 127.0.0.1/7545 (esse é o endereço da blockchain).
> O network id está definido por padrão em 5777, mas - quando for importar uma conta verá que o netID muda (geralmente para 1337).
> Agora, você precisa abrir a sua extensão no metamask. 
> Quando abrir, clique em configurações > redes > adicionar redes.
> Dê um nome a sua rede, coloque a url da RPC (127.0.0.1/7545), e o id da chain como 5777 (não se preocupe - se for outro, ele avisará; provavelmente, será 1337).
> Agora, clique no canto superior direito no círculo e clique em importar conta. A carteira pedirá a CHAVE PRIVADA da carteira, para isso, vá ao ganache, selecione uma conta e clique no ícone de chave, copie a string da chave privada e cole no campo de import de conta na metamask (canto superior direito -> ícone circular -> importar conta -> colar e confirmar).
> Pronto, você já tem a digital wallet e a blockchain. Falta o servidor e o contrato inteligente.
> Vá ao prompt do Node.js e execute: truffle compile.
> Depois, execute: truffle migrate.
> E, agora, execute: npm run start.
> Quando o site rodar no endereço padrão (127.0.0.1/3000), você terá que confirmar o acesso do site à sua carteira: conectar a carteira ao site. Abra a metamask e veja o status como "conectado".

A partir de agora, por ser uma nova blockchain sem dados persistentes, verá que o site não se comportará como deveria.
Para isso, você precisa "mintar" alguns álbuns para que a aplicação comece a database no ipfs e na blockchain, e tenha todas as suas funcionalidades.


P.S.: O projeto demora para começar a ser executado depois do (npm run start); e o (npm install) demora um tempinho considerável, ele não ficará responsivel em alguns momentos, continue apertando <<enter>> para checar se o download acabou.

P.S.2: Optei por não enviar os node_modules devido ao seu tamanho: o projeto tem mais de 90 GB com os módulos.

P.S.3: Você pode clonar esse projeto direto do repositório: https://github.com/GusHammer/tccProjeto.git, mas lembre-se de executar os comandos no diretório Diskify.

P.S.4: Em anexo, está o zip do Albums_content caso queira mintar alguns álbuns. Ele contém 5 álbuns, com a capa do album e algumas músicas.


p.s
