const adminCtrl = {};
const Admin = require("../models/Admin");
const passport = require('passport');

adminCtrl.renderSignUpForm = (req, res) => {
    res.render("users/admin/signup", {
        title: 'Inicia sesión',
        style: 'signup.css' 
    });
};

adminCtrl.signup = async (req, res) => {
    const errors = [];
    const { email, password } = req.body;

    if (password.length < 4) {
        errors.push({ text: "La contraseña debe tener al menos 4 caracteres" });
    }

    if (errors.length > 0) {
        res.render("users/admin/signup", {
            errors,
            email,
            password,
        });
    } else {
        try {
            const emailAdmin = await Admin.findOne({ email: email });

            if (emailAdmin) {
                req.flash("error_msg", "El correo ya está en uso");
                res.redirect("/users/admin/signup");
            } else {
                const newAdmin = new Admin({ email, password });
                newAdmin.password = await newAdmin.encryptPassword(password);
                await newAdmin.save();
                req.flash("success_msg", "Registrado correctamente");
                res.redirect("/users/admin/signin");
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Error en el servidor");
        }
    }
};

adminCtrl.renderAdminindex = (req, res) => {
    res.render("users/admin/adminindex",{
        style: 'adminindex.css'
    });
};

adminCtrl.renderSigninForm = (req, res) => {
    res.render("users/admin/signin",{
        style: 'signin.css'
    });
};

adminCtrl.signin = passport.authenticate('local', {
    failureRedirect: '/users/admin/signin',
    successRedirect: '/users/admin/adminindex',
    failureFlash: true
});

adminCtrl.logout = (req, res) => {
    req.logout();
    req.flash('succes_msg', 'Has cerrado sesión');
    res.redirect('/users/admin/signin');
};

module.exports = adminCtrl;
