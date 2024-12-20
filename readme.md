# Golden Raspberry Awards API

API para gerenciar filmes, produtores e estúdios do prêmio da categoria, 'Pior Filme' do Golden Raspberry Awards. Abaixo estão as instruções sobre como executar o projeto, utilizar as rotas e as ferramentas de linting.

## Tecnologias Utilizadas

- **Node.js**: Plataforma para construir aplicações de rede.
- **TypeScript**: Linguagem que adiciona tipagem ao JavaScript.
- **Express**: Framework para construir aplicações web em Node.js.
- **sqlite3**: Banco de dados relacional em memória.
- **csv-parse**: Importação de dados de arquivo CSV.
- **Swagger**: Para documentação da API.
- **ESLint**: Ferramenta para análise de código e linting.
- **jest**: Ferramenta responsável pela execução dos testes.

## Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina. A versão utilizada no desenvolvimento do projeto é a seguinte:

- [Node.js](https://nodejs.org/) (recomenda-se a versão v20.16.0)
- [npm](https://www.npmjs.com/) (geralmente é instalado junto com o Node.js)

## Passos para Configuração

1. **Clone o repositório**

   Se você ainda não fez isso, clone o repositório do projeto:

   ```bash
   git clone https://github.com/aldori/golden-paspberry-awards-api
   ```

2. **Navegue até o diretório do projeto**

   Após clonar, entre no diretório do projeto:

   ```bash
   cd golden-raspberry-awards-api
   ```

3. **Instale as dependências**

   Execute o seguinte comando para instalar todas as dependências do projeto:

   ```bash
   npm install
   ```

4. **Arquivo de importação**

   O projeto irá acessar o arquivo **_src/resources/movielist.csv_** e realizará a importação dos dados para o sqlite3, garanta que exista um arquivo com este nome e formato na pasta **_resources_** para o projeto funcionar de forma correta.

5. **Execute do projeto**

   Execute o seguinte comando para executar o projeto:

   ```bash
   npm run dev
   ```

6. **Acesse documentação**

   Após o projeto iniciado para acessar a documentação do Swagger deve ser acessado a seguinte URL:

   ```link
   http://localhost:3000/docs
   ```

7. **Execução dos teste**

   Para execução dos testes deve ser executado o comando:

   ```bash
   npm run test
   ```

## Scripts

Os seguintes scripts estão disponíveis no projeto:

```json
"scripts": {
    "dev": "tsx watch src/server.ts",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "jest"
}
```
