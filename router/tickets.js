
const express = require('express');
const router = express.Router();
const controller = require('../controller/tickets');
const protect = require('../middlewares/protect');
// const adminOnly = require('../middlewares/adminOnly')

router.use(protect);


router.get('/', controller.getTickets);
router.get('/:id', controller.getTicket);

router.post('/', controller.createTicket);
router.put('/:id',  controller.updateTicket);
router.delete('/:id',  controller.deleteTicket);
router.post("/import",controller.importTickets)
module.exports = router;