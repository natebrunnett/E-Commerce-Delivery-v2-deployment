const Users = require("../../models/models.users"); // change the path for your users model path

const { passwordAfterHook, passwordBeforeHook } = require("./password.hook");

const options = {
  properties: {
    encryptedPassword: {
      isVisible: false,
    },
    password: {
      type: "password",
    },
  },
  actions: {
    new: {
      after: passwordAfterHook,
      before: passwordBeforeHook,
    },
    edit: {
      after: passwordAfterHook,
      before: passwordBeforeHook,
    },
  },
};

module.exports = {
  options,
  resource: Users,
};
