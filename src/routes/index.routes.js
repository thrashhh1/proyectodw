const { Router } = require('express')
const router = Router();

const {renderIndex, renderAccess, renderEvent } = require ('../controllers/index.controller');

router.get('/', renderIndex);
router.get('/users/access', renderAccess);
router.get('/event', renderEvent);


module.exports = router;