const adminCtrl = {};

adminCtrl.renderSignUpForm = (req, res) => {
    res.render('users/signup')
};

adminCtrl.signup = (req, res) => {
    const errors = [];
    const {email, password} = req.body;
    if(password.length < 4){
        errors.push({text: 'La contraseña debe tener al menos 4 caracteres'});
    }
    if (errors.length > 0){
        res.render('users/signup',{
            errors
        })
    } else {
        res.send('El registro fue exitoso');
    }
};

adminCtrl.renderSigninForm = (req, res) => {
    res.render('users/signin')
};

adminCtrl.signin = (req, res) => {
    res.send('signin');
};

adminCtrl.logout = (req, res) => {
    res.send('logout');    
}


module.exports = adminCtrl;