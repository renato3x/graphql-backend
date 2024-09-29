const jwt = require('jsonwebtoken');

/**
  * O parâmetro `context` (ctx) no GraphQL é utilizado para compartilhar informações comuns a todas as resolvers
  * de uma mesma execução de query ou mutation. Ele é passado como um objeto para cada resolver e normalmente
  * contém dados como:
  * 
  * - Informações de autenticação (usuário logado, permissões).
  * - Acesso a banco de dados.
  * - Serviços externos (APIs).
  * - Configurações globais.
  * 
  * Essencialmente, o `context` (ctx) serve como um meio de passar recursos e informações que possam ser reutilizados
  * por diferentes partes da execução da query, facilitando a lógica de negócios e a organização do código.
  * 
  * exemplo:
  * myResolver(data, args, ctx) {
  *   console.log('content of context', ctx);
  * }
*/

module.exports = async ({ req }) => {
  await require('./mock/loggedUser')(req);

  const auth = req.headers.authorization;
  const token = (auth?.split(' ') || '')[1] || '';

  let user;

  if (token) {
    user = jwt.verify(token, process.env.AUTH_SECRET);
  }

  const isAdmin = user.profiles.includes('admin');

  return {
    user,
    isAdmin   
  }
}