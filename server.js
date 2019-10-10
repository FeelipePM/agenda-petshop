const { GraphQLServer } = require("graphql-yoga");
const conexao = require("./infraestrutura/conexao");
const Tabelas = require("./infraestrutura/database/tabelas");

const Operacoes = require("./infraestrutura/operations");

conexao.connect(erro => {
  if (erro) {
    console.log(erro);
  }

  console.log("conectou no banco");

  Tabelas.init(conexao);
});

const Clientes = new Operacoes("cliente");

const resolvers = {
  Query: {
    status: () => "Servidor Rodando!",
    clientes: () => Clientes.lista(),
    cliente: (root, { id }) => Clientes.buscaPorId(id)
  },

  Mutation: {
    adicionarCliente: (root, params) => Clientes.adiciona(params),
    atualizarCliente: (root, params) => Clientes.atualiza(params)
  }
};

const server = new GraphQLServer({
  resolvers,
  typeDefs: "./schema.graphql"
});

server.start(() => {
  console.log("Servidor Ouvindo!");
});
