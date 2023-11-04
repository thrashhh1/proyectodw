const { Router } = require('express')
const router = Router();

const {renderIndex, renderAcceder, renderEvent } = require ('../controllers/index.controller');

router.get('/', renderIndex);
router.get('/users/acceder', renderAcceder);
router.get('/event', renderEvent);


module.exports = router;