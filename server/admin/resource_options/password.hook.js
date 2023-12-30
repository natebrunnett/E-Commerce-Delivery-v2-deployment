const argon2 = require("argon2");

const passwordAfterHook = async (response) => {
  if (response.record && response.record.errors) {
    response.record.errors.password = response.record.errors.encryptedPassword;
  }
  return response;
};

const passwordBeforeHook = async (request) => {
  if (request.method === "post") {
    const { password, ...otherParams } = request.payload;
    if (password) {
      const encryptedPassword = await argon2.hash(password);
      return {
        ...request,
        payload: {
          ...otherParams,
          encryptedPassword,
        },
      };
    }
  }
  return request;
};

module.exports = {
  passwordAfterHook,
  passwordBeforeHook,
};
