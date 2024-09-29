const knex = require('../db');
const { getLoggedUser } = require('../../resolvers/common/user');

const sql = `
SELECT u.*
FROM users u
JOIN users_profiles up ON up.userId = u.id
JOIN profiles p ON up.profileId = p.id
WHERE u.active = 1 AND p.name = :profileName
LIMIT 1;
`;

const getUser = async (profileName) => {
  const response = await knex.raw(sql, { profileName });
  return response ? response[0][0] : null;
};

module.exports = async (request) => {
  const user = await getUser('admin');

  console.log('logged user', user);

  if (user) {
    const { token } = await getLoggedUser(user);
    request.headers = {
      authorization: `Bearer ${token}`,
    };
  }
}
