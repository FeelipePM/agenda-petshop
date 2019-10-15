const { GraphQLServer } = require("graphql-yoga");
const conexao = require("./infraestrutura/conexao");
const Tabelas = require("./infraestrutura/database/tabelas");

const Operacoes = require("./infraestrutura/operations");

conexao.connect(erro => {
  if (erro) {
    console.log(erro);
  }

  console.log("Banco conectado");

  Tabelas.init(conexao);
});

const Clientes = new Operacoes("cliente");
const Pets = new Operacoes("pet");

const resolvers = {
  Query: {
    status: () => "Servidor Rodando!",
    clientes: () => Clientes.lista(),
    cliente: (root, { id }) => Clientes.buscaPorId(id),
    pets: () => Pets.lista(),
    pet: (root, { id }) => Pets.buscaPorId(id)
  },

  Mutation: {
    adicionarCliente: (root, params) => Clientes.adiciona(params),
    atualizarCliente: (root, params) => Clientes.atualiza(params),
    deletarCliente: (root, { id }) => Clientes.deleta(id),
    adicionarPet: (root, params) => Pets.adiciona(params)
  }
};

const server = new GraphQLServer({
  resolvers,
  typeDefs: "./schema.graphql"
});

server.start(() => {
  console.log("Servidor Ouvindo!");
});
