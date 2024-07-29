# Fiscalizeai

## 🚀 Começando

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.

### 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)

### Rodando o Back End (servidor)

```bash
# Clone este repositorio
$ git clone https://github.com/fiscalizeai/api-fiscalizeai/tree/main

# Acesse a pasta do projeto no terminal/cmd

# Instale as dependências
$ npm install

# Crie um arquivo .env na raiz do projeto e copie e cole o conteudo do arquivo .env.example

# Rode Docker para container do banco
$ docker compose up

# Rode as migration com o prisma
$ npx prisma migrate dev

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# O servidor iniciará na porta 3333 - acesse a documentação em <http://localhost:3333/documentation>
```

## ⚙️ Executando os testes

Para executar os testes você precisará ter seguidos os passos acima e execute

```bash
$ npm run test
&
$ npm run test:e2e
```

## 🛠️ Construído com

* [Fastify](https://fastify.dev/) - O framework web usado
* [Prisma](https://www.prisma.io/) - ORM usado para o banco de dados
* [Vitest](https://vitest.dev/guide/filtering) - Usado para fazer os testes e2e
* [Fastify-Swagger](https://github.com/fastify/fastify-swagger) - Para documentação da API
* [Zod](https://zod.dev/) - Para validação de tipagem

# Todos
- [ ] Documentar rotas finance
- [ ] Deixar rotas finance para metodologia SOLID