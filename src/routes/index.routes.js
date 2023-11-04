const { Router } = require('express')
const router = Router();

const {renderIndex, renderAcceder } = require ('../controllers/index.controller');

router.get('/', renderIndex);
router.get('/users/acceder', renderAcceder);


module.exports = router;