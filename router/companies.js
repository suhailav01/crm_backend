const express = require('express')
const router = express.Router();
const { getAllCompanyController, getSingleCompanyController, createCompanyController, updateCompanyController, deleteCompanyController,importCompaniesController } = require('../controller/companies')
const protect = require('../middlewares/protect');
router.use(protect);
router.get("/",getAllCompanyController);
router.get("/:id", getSingleCompanyController);
router.post("/",createCompanyController);
router.put("/:id",updateCompanyController);
router.delete("/:id",deleteCompanyController);
router.post("/import",importCompaniesController);
module.exports = router;
