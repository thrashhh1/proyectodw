const { Router } = require('express');
const router = Router();

const { renderSignUpForm,
    renderSigninForm,
    signup,
    signin,
    logout,
    renderAdminindex
} = require('../controllers/admin.controller');

const { isAuthenticated } = require('../helpers/auth');

router.get('/users/admin/signup', renderSignUpForm);
router.post('/users/admin/signup', signup);
router.get('/users/admin/signin', renderSigninForm);
router.post('/users/admin/signin', signin);
router.get('/users/admin/adminindex', isAuthenticated, renderAdminindex);
router.get('/admin/logout', logout);

module.exports = router;
