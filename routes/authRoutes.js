const express = require('express');
const passport = require('passport');
const router = express.Router();
require('../config/passport');

const generateToken = require('../utils/generateToken');

// Util: build redirect URL with token and user info
const redirectWithAuth = (req, res) => {
  const token = generateToken(req.user._id);
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };

  const queryParams = new URLSearchParams({
    token,
    user: JSON.stringify(user),
  });

  res.redirect(`http://localhost:3000/oauth-success?${queryParams.toString()}`);
};

// ✅ Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  redirectWithAuth
);

// ✅ GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { session: false }),
  redirectWithAuth
);

// ✅ Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  redirectWithAuth
);

// ✅ Logout (optional)
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect('http://localhost:3000/login');
  });
});

module.exports = router;
