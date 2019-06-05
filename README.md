# InjetSmartTVWeb

[![NodeJS](https://cdn2.iconfinder.com/data/icons/nodejs-1/128/nodejs-128.png)](https://nodejs.org/en/)

Módulo para o Injet, executado sob servidor de aplicação em separado.

### Tecnologia
Bibliotecas e frameworks utilizados:
* [NodeJS] - JavaScript runtime v8.
* [EJS] - Engine View.
* [Express] - Framework node.
* [Materialize] - Framewrok front-end based on Material Design.
* [Axios] - Promise based HTTP client for the browser and node.js
* [Node-Windows] - Node application in Windows Service.
* [Yarn] - Fast, reliable, and secure dependency management.

### Variáveis de ambiente
Dentro do arquivo `.env.example` tem as variáveis de ambiente como:
* `APP_URL` - Variável que cuida do caminho onde serão consultado os dados do IDW/VF. _ex: `http://192.168.0.1:4200`_
* `PORT` - Variável que cuida da porta da aplicação principal, geralmente sua porta é a `3000`. _ex: 150.0.0.1:`3000`_
* `BIN_PATH` - Variável que contém o caminho absoluto do _www_ para que possa ser startada a aplicação. _ex: `C:\\Users\\Innovation\\Documents\\Innovation\\injetsmarttvweb\\bin\\www`_

`OBS: O caminho do BIN_PATH terá que adicionar as barras inversas para que o NodeJS não entenda como um comando de REGEX.`

Deve-se alterar o nome do arquivo para `.env` para habilitar execução da aplicação.

### Instalação

Requer [NodeJS] v8+ e [Yarn] para instalação dos pacotes. Ao computador destinado a servidor requer acesso à Internet. Antes dos passos abaixo, previamente baixar e instalar o [NodeJS] no computador destinado a servidor de aplicação NodeJS.

Instalando as dependências do projeto (após [NodeJS] instalado e [Yarn]): 

```sh
$ cd injetsmarttvweb
$ yarn install
```

### Gerando o serviço via [node-windows]
Após ter instalado as _dependências_.

Instalando o serviço.
```sh
$ node install_service.js
```

Desinstalando o serviço.
```sh
$ node uninstall_service.js
```

[nodejs]: <https://nodejs.org/en/>
[EJS]: <http://ejs.co/>
[Express]: <https://expressjs.com/pt-br/>
[Materialize]: <https://materializecss.com/>
[Forever]:<https://www.npmjs.com/package/forever>
[Axios]:<https://github.com/axios/axios>
[node-windows]:<https://www.npmjs.com/package/node-windows>
[yarn]:<https://yarnpkg.com/pt-BR/docs/install#windows-stable>