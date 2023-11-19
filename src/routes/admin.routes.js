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

router.get('/usuarios/crear', renderSignUpForm);
router.post('/usuarios/crear', signup);
router.get('/usuarios/ingresar', renderSigninForm);
router.post('/usuarios/ingresar', signin);
router.get('/users/admin/adminindex', isAuthenticated, renderAdminindex);
router.get('/usuarios/salir', logout);

module.exports = router;
