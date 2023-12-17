const userCtrl = {};
const User = require("../models/User");
const passport = require('passport');

userCtrl.renderSignUpForm = (req, res) => {
    res.render("users/admin/signup", {
        title: 'Inicia sesión',
        style: 'signup.css' 
    });
};

userCtrl.signup = async (req, res) => {
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
            const Useremail = await User.findOne({ email: email });

            if (Useremail) {
                req.flash("error_msg", "El correo ya está en uso");
                res.redirect("/usuarios/crear");
            } else {
                const newUser = new User({ name, email, password });
                newUser.password = await newUser.encryptPassword(password);
                await newUser.save();
                res.json({message: 'TRUE'});
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Error en el servidor");
        }
    }
};

userCtrl.renderAdminindex = (req, res) => {
    res.render("users/admin/adminindex",{
        style: 'adminindex.css'
    });
};

userCtrl.renderSigninForm = (req, res) => {
    res.render("users/admin/signin",{
        style: 'signin.css'
    });
};

userCtrl.signin = passport.authenticate('local', {
    failureRedirect: '/usuarios/ingresar',
    successRedirect: '/users/admin/adminindex',
    failureFlash: true
});

userCtrl.logout = (req, res) => {
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


module.exports = userCtrl;
