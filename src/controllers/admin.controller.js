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
    const { name, email, password } = req.body;

    if (password.length < 4) {
        errors.push({ text: "La contraseña debe tener al menos 4 caracteres" });
    }

    if (errors.length > 0) {
        res.render("users/admin/signup", {
            errors,
            name,
            email,
            password,
        });
    } else {
        try {
            const emailAdmin = await Admin.findOne({ email: email });

            if (emailAdmin) {
                req.flash("error_msg", "El correo ya está en uso");
                res.redirect("/usuarios/crear");
            } else {
                const newAdmin = new Admin({ name, email, password });
                newAdmin.password = await newAdmin.encryptPassword(password);
                await newAdmin.save();
                req.flash("success_msg", "Registrado correctamente");
                res.redirect("/usuarios/ingresar");
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
    failureRedirect: '/usuarios/ingresar',
    successRedirect: '/users/admin/adminindex',
    failureFlash: true
});

adminCtrl.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error al cerrar sesión");
        } else {
            req.flash('success_msg', 'Has cerrado sesión');
            res.redirect('/usuarios/ingresar');
        }
    });
};

module.exports = adminCtrl;
