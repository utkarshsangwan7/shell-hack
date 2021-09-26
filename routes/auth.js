const express = require("express");
const passport = require("passport");
const { v4: uuidv4 } = require('uuid');

// * Middleware
const { login } = require("../Middleware/auth");


// * Model
const User = require("../models/User");

// * API Endpoints -->
const router = express.Router();

// * Sign up Participant
router.post(
  "/signup",
  (req, res, next) => {
    req.session.route = "signup";
    // console.log(req.body);
    req.session.body = req.body;
    return next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// * Auth Callback
router.get("/auth/callback", (req, res, next) => 
{
    passport.authenticate(
        "google",
        {
            scope: ["profile", "email"],
        },
        function (err, user, info) {
            console.log(err, user, info);
            if (!user)
            return res.redirect(
                `${process.env.CLIENT_URL}/error?err=${info?.message}`
                );
                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }
                    if(user.route==="invite"){
                        return res.redirect(`${process.env.CLIENT_URL}/compiler/${user.inviteid}`);
                    }
                    let id=uuidv4();
                    return res.redirect(`${process.env.CLIENT_URL}/compiler/${id}`);
      });
    }
  )(req, res, next);
});

// * Login Participant
router.get(
  "/login",
  (req, res, next) => {
    req.session.route = "login";
    return next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get('/invite/:id',
    (req, res, next) => {
        req.session.route = "invite";
        req.session.inviteid=req.params.id
        return next();
      },
      passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get("/profile",(req,res)=>{
    console.log(req.user);
    res.json({data:req.user})
})

// * Log Out user
router.get("/logout", async (req, res) => {
  try {
    req.logout();
    res.redirect(`${process.env.CLIENT_URL}/login`);
  } catch (error) {
    console.error("Error occured here \n", error);
    return res.status(500).json({ body: null, error: "Server Error." });
  }
});

// * End of API Endpoints -->
module.exports = router;