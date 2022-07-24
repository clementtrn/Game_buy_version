const Router = require('express').Router

const router = new Router();

router.get('/contents');

router.get('/login');

router.get('/playstate');
router.get('/configuration');
router.get('/nouveauTour');

router.get('/getBudgetsPompInit');
router.get('/saveBudgetsPompInit');
router.get('/getBudgetsPompFin');
router.get('/saveBudgetsPompFin');
router.get('/updateChrono');
router.get('/startStopPartie');

router.get('/updateConfig');

router.get('/getNbEquipes');
router.get('/getUsers');
router.get('/createUsers');
router.get('/resetPartie');
router.get('/getGeneralStats');
module.exports = router