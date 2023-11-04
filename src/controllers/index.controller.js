const indexCtrl = {};

indexCtrl.renderIndex = (req, res) =>{
    res.render('index');
 };

 indexCtrl.renderAcceder = (req, res) =>{
    res.render('users/acceder');
 };

 indexCtrl.renderAccederAdmin = (req, res) =>{
   res.render('users/acceder');
};

 module.exports = indexCtrl;