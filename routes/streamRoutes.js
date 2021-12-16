const express = require('express');
const controller = require('../controllers/streamController');

const router = express.Router();



router.get('/multiviewer', controller.multiviewer);


router.get('/', controller.index);


router.get('/recommended', controller.recommended);


router.get('/new', controller.new);



router.post('/', controller.create);


router.get('/:id', controller.show);


router.get('/:id/edit', controller.edit);

router.put('/:id', controller.update);


router.delete('/:id', controller.delete);

module.exports = router;