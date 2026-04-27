const express = require('express')
const router = express.Router();
const { getAllLeadsController, getSingleLeadsController, createleadsController, updateleadsController, deleteleadsController, importLeadsController } = require('../controller/leads')
const protect = require('../middlewares/protect');
router.use(protect)
router.get("/", getAllLeadsController);
router.get("/:id", getSingleLeadsController);
router.post("/", createleadsController);
router.put("/:id", updateleadsController);
router.delete("/:id", deleteleadsController);
router.post("/import", importLeadsController);
module.exports = router;