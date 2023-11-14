const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Admin = require('../models/Admin');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {

    // Match Email's user
    const admin = await Admin.findOne({ email })
    if (!admin) {
        return done(null, false, { message: 'Usuario no encontrado' })
    } else {
        // Validacion de contraseña de usuario
        const match = await admin.matchPassword(password);
        if (match) {
            return done(null, admin);
        } else {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
    }

})); 

passport.serializeUser((admin,done) => {
    done(null, admin.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const admin = await Admin.findById(id);
        done(null, admin);
    } catch (error) {
        done(error);
    }
});