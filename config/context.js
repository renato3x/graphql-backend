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
  if (process.env.ENVIRONMENT === 'dev') {
    await require('./mock/loggedUser')(req);
  }

  const auth = req.headers.authorization;
  const token = (auth?.split(' ') || '')[1] || '';

  let user = null;

  if (token) {
    user = jwt.verify(token, process.env.AUTH_SECRET);
  }

  const isAdmin = user?.profiles?.includes('admin') || false;

  const error = new Error('Access denied');

  return {
    user,
    isAdmin,
    validateUser() {
      if (!user) {
        throw error;
      }
    },
    validateAdmin() {
      if (!isAdmin) {
        throw error;
      }
    },
    validateUserFilters(filters) {
      if (isAdmin) {
        return;
      }

      const { id, email } = filters;
  
      if (id && user.id != id) {
        throw error;
      }

      if (email && user.email != email) {
        throw error;
      }
    }
  }
}