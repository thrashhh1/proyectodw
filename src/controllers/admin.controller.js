const adminCtrl = {};
const Admin = require('../models/Admin');

adminCtrl.renderSignUpForm = (req, res) => {
    res.render('users/signup');
};

adminCtrl.signup = async (req, res) => {
    const errors = [];
    const { email, password } = req.body;

    if (password.length < 4) {
        errors.push({ text: 'La contraseña debe tener al menos 4 caracteres' });
    }

    if (errors.length > 0) {
        res.render('users/signup', {
            errors,
            email,
            password
        });
    } else {
        try {
            const emailUser = await Admin.findOne({ email: email });

            if (emailUser) {
                req.flash('error_msg', 'El correo ya está en uso');
                res.redirect('/users/signup');
            } else {
                const newAdmin = new Admin({ email, password });
                await newAdmin.save();
                req.flash('success_msg', 'Registrado correctamente');
                res.redirect('/users/signin');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error en el servidor');
        }
    }
};

adminCtrl.renderSigninForm = (req, res) => {
    res.render('users/signin');
};

adminCtrl.signin = (req, res) => {
    res.send('signin');
};

adminCtrl.logout = (req, res) => {
    res.send('logout');
}

module.exports = adminCtrl;
