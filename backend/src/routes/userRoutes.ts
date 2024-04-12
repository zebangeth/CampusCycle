import express from 'express';
import passport from 'passport'
import User from '../models/User';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

// // User login
// // router.get('/login', passport.authenticate('oidc', {
// //   successReturnToOrRedirect: "/"
// // }));
// router.get('/login', 
// passport.authenticate("oidc", { failureRedirect: "/login" }), 
// (req, res) => res.redirect("/")
// )

// router.get('/login-callback',
//   passport.authenticate('oidc', { failureRedirect: '/login' }),
//   async (req, res) => {
//     try {
//       const userInfo = req.user as any;

//       // Find or create the user in the database
//       let user = await User.findOne({ email: userInfo.email });
//       if (!user) {
//         user = new User({
//           name: userInfo.name,
//           email: userInfo.email,
//           gitlabId: userInfo.sub,
//           // Set other user properties as needed
//         });
//         await user.save();
//       }

//       // // Set the user information in the session
//       // req.session.loginInfo = {
//       //   _id: user._id,
//       //   name: user.name,
//       //   email: user.email,
//       //   role: 'user',
//       // };

//       // Redirect the user to the desired page after successful login
//       res.redirect('/');
//     } catch (error) {
//       console.error('Error during login callback:', error);
//       res.redirect('/login');
//     }
//   }
// );



router.get(
  "/login", 
  passport.authenticate("oidc", { failureRedirect: "/api/login" }), 
  (req, res) => res.redirect("/")
)

router.get(
  "/login-callback",
  passport.authenticate("oidc", {
    successRedirect: "/",
    failureRedirect: "/api/login",
  })
)    


// User logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.redirect('/');
  });
});

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/:userId', isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.session.userId) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;