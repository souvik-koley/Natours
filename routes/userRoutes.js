const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

// const multer = require('multer');
// const upload = multer({ dest: 'public/img/users' });

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

// router.patch('/updatePassword', authController.protect, authController.updatePassword);

// router.get('/me', authController.protect, userController.getMe, userController.getUser);
// router.patch('/updateMe', authController.protect, userController.updateMe);
// router.delete('/deleteMe', authController.protect, userController.deleteMe);

// router.route('/').get(userController.getAllUsers).post(userController.createUser);
// router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

router.patch('/updatePassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);


module.exports = router;
