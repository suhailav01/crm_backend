const express = require('express');
const router = express.Router();
const protect = require('../middlewares/protect')
const {  getAllDealController,  getSingleDealController,  createDealController,  updateDealController,  deleteDealController,  getQualifiedLeadsController,importDealsController} = require('../controller/deals');
router.use(protect);
// 🔹 Get all deals
router.get('/', getAllDealController);

// 🔹 Get single deal
router.get('/:id', getSingleDealController);

// 🔹 Create deal
router.post('/', createDealController);

// 🔹 Update deal
router.put('/:id', updateDealController);

// 🔹 Delete deal
router.delete('/:id', deleteDealController);

// 🔹 Get qualified leads (dropdown use)
router.get('/qualified-leads', getQualifiedLeadsController);

router.post("/import",importDealsController)
module.exports = router;
