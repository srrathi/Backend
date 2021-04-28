const passport = require('passport');
const { Strategy } = require('passport-github');
const User = require('../models/User');
const email = require('../utils/email');
const config = require('./index');

passport.use(
  new Strategy(
    {
      clientID: config.GITHUB.CLIENT_ID,
      clientSecret: config.GITHUB.SECRET,
      callbackURL: `${config.API_URL}/auth/github/callback`,
    },

    async (accessToken, _refreshToken, profile, cb) => {
      try {
        // eslint-disable-next-line no-underscore-dangle
        const userData = profile._json;
        if (!accessToken) {
          throw new Error('No access token');
        }

        const existingUser = await User.findOne({
          'oAuth.github.id': userData.id,
        }).select('_id name');

        let currentUser = existingUser;
        if (currentUser) {
          await User.updateOne(
            { 'oAuth.github.id': userData.id },
            { $set: { 'oAuth.github.accessToken': accessToken } },
          );
        } else {
          currentUser = await User.create({
            name: userData.name || userData.login,
            email: userData.email,
            profileImage: userData.avatar_url,
            oAuth: {
              github: {
                id: userData.id,
                node_id: userData.node_id,
                profileUrl: userData.html_url,
                accessToken,
                username: userData.login,
                avatar_url: userData.avatar_url,
              },
            },
          });
          await email(userData.login, userData.email);
        }

        return cb(null, currentUser);
      } catch (error) {
        return cb(error);
      }
    },
  ),
);

module.exports = passport;
