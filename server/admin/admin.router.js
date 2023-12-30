const { buildAuthenticatedRouter } = require("@adminjs/express");
const argon2 = require("argon2");
const Users = require("../models/models.users"); // change the path for your users model path

const buildAdminRouter = (admin) => {
  const router = buildAuthenticatedRouter(
    admin,
    {
      cookieName: "admin-bro",
      cookiePassword: "some_password",
      authenticate: async (email, password) => {
        const user = await Users.findOne({ email });
        if (
          user &&
          (await argon2.verify(user.password, password)) &&
          user.admin
        ) {
          return user.toJSON();
        }
        return null;
      },
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
    }
  );
  return router;
};

module.exports = buildAdminRouter;
