const router = require("express").Router();
const passport = require("passport");

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully",
      user: req.user,
    });
  } else {
    res.status(401).json({ error: true, message: "Not Authorized" });
  }
});
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URI);
});
router.get("/login/failed", (req, res) => {
  res.status(401).json({ error: true, message: "Log in Failure" });
});
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email" , "profile" ] })
);
router.get( 
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
    successRedirect:process.env.CLIENT_URI
  })
);

module.exports = router;
