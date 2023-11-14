const indexCtrl = {};

indexCtrl.renderIndex = (req, res) => {
   res.render('index', {
      title: 'Vota ya!',
      style: 'index.css'
   });
};

indexCtrl.renderAccess = (req, res) => {
   const style = 'access.css';
   res.render('users/access', { style });
};

indexCtrl.renderEvent = (req, res) => {
   res.render('event');
};

module.exports = indexCtrl;