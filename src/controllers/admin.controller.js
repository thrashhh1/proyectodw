const adminCtrl = {};

adminCtrl.renderSignUpForm = (req, res) => {
    res.render('users/signup')
};

adminCtrl.signup = (req, res) => {
    res.send('singup');
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