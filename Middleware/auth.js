// * User is logged in
exports.login = async (req, res, next) => {
    if (req.user) return next();
    return res
      .status(401)
      .json({ body: null, error: "Permission Error. Login to continue." });
  };