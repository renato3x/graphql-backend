const jwt = require('jsonwebtoken');
const { profiles: getProfiles } = require('../type/user')

module.exports = {
  async getLoggedUser(user) {
    const profiles = await getProfiles(user);
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      profiles: profiles.map(p => p.name),
    }

    const token = jwt.sign(
      payload,
      process.env.AUTH_SECRET,
      { expiresIn: '3 days' }
    );

    return {
      ...user,
      token,
    }
  }
}
