const companyRepo = require('../repositories/companies');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const sendNotification = require('../utils/notify');


// ✅ GET ALL
const getAllCompanyController = asyncHandler(async (req, res, next) => {
  let company = [];

  if (req.user.role === "admin") {
    company = await companyRepo.getAllCompanies();
  } else {
    company = await companyRepo.getAllCompaniesByUserId(req.user.id);
  }

  res.status(200).json({ success: true, data: company });
});


// ✅ GET SINGLE
const getSingleCompanyController = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let company = [];

  if (req.user.role === "admin") {
    company = await companyRepo.getCompanyById(id);
  } else {
    company = await companyRepo.getCompanyByIdForUser(id, req.user.id);
  }

  if (company.length) {
    res.status(200).json({ success: true, data: company[0] });
  } else {
    next(new ErrorResponse(`company not available or access denied ${id}`, 404));
  }
});


// ✅ CREATE COMPANY
const createCompanyController = asyncHandler(async (req, res, next) => {
  const {
    company_name,
    email,
    phone_number,
    industry,
    city,
    country_region,
    no_of_employees,
    annual_revenue,
    owners,
    domain_name
  } = req.body;

  const finalOwners =
    req.user.role === "admin"
      ? (owners || [])
      : [req.user.id];

  const createdCompany = await companyRepo.createCompanies(
    company_name,
    email,
    phone_number,
    industry,
    city,
    country_region,
    no_of_employees,
    annual_revenue,
    domain_name,
    finalOwners
  );

  await sendNotification({
    title: "New Company Created",
    message: `${company_name} was created successfully`,
    type: "company",
    module: "companies",
    recordId: createdCompany.id,
    actionType: "create",
    createdBy: finalOwners?.[0] || null,
  });

  res.status(201).json({
    success: true,
    data: createdCompany
  });
});


// ✅ IMPORT MULTIPLE COMPANIES
const importCompaniesController = asyncHandler(async (req, res, next) => {
  const { companies } = req.body;

  if (!Array.isArray(companies) || companies.length === 0) {
    return next(new ErrorResponse("Companies array is required", 400));
  }

  const insertedCompanies = [];

  for (const company of companies) {
    const {
      company_name,
      email = "",
      phone_number,
      industry,
      city = "",
      country_region = "",
      no_of_employees = "",
      annual_revenue = "",
      owners = [],
      domain_name = ""
    } = company;

    if (!company_name || !phone_number || !industry) {
      continue;
    }

    const finalOwners =
      req.user.role === "admin"
        ? (owners || []).map((id) => Number(id)).filter(Boolean)
        : [req.user.id];

    if (!finalOwners.length) {
      continue;
    }

    const createdCompany = await companyRepo.createCompanies(
      company_name,
      email,
      phone_number,
      industry,
      city,
      country_region,
      no_of_employees,
      annual_revenue,
      domain_name,
      finalOwners
    );

    insertedCompanies.push(createdCompany);

    await sendNotification({
      title: "New Company Created",
      message: `${company_name} was created successfully`,
      type: "company",
      module: "companies",
      recordId: createdCompany.id,
      actionType: "create",
      createdBy: finalOwners?.[0] || null,
    });
  }

  res.status(201).json({
    success: true,
    message: "Companies imported successfully",
    count: insertedCompanies.length,
    data: insertedCompanies
  });
});


// ✅ UPDATE COMPANY
const updateCompanyController = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const {
    company_name,
    email,
    phone_number,
    industry,
    city,
    country_region,
    no_of_employees,
    annual_revenue,
    owners,
    domain_name
  } = req.body;

  const finalOwners =
    req.user.role === "admin"
      ? (owners || [])
      : [req.user.id];

  let accessibleCompany = [];

  if (req.user.role === "admin") {
    accessibleCompany = await companyRepo.getCompanyById(id);
  } else {
    accessibleCompany = await companyRepo.getCompanyByIdForUser(id, req.user.id);
  }

  if (!accessibleCompany.length) {
    return next(new ErrorResponse(`company not available or access denied ${id}`, 404));
  }

  const updatedCompany = await companyRepo.updateCompanies(
    id,
    company_name,
    email,
    phone_number,
    industry,
    city,
    country_region,
    no_of_employees,
    annual_revenue,
    finalOwners,
    domain_name
  );

  await sendNotification({
    title: "Company Updated",
    message: `${company_name} was updated successfully`,
    type: "company",
    module: "companies",
    recordId: Number(id),
    actionType: "update",
    createdBy: finalOwners?.[0] || null,
  });

  res.status(200).json({
    success: true,
    data: updatedCompany,
  });
});


// ✅ DELETE
const deleteCompanyController = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  let accessibleCompany = [];

  if (req.user.role === "admin") {
    accessibleCompany = await companyRepo.getCompanyById(id);
  } else {
    accessibleCompany = await companyRepo.getCompanyByIdForUser(id, req.user.id);
  }

  if (!accessibleCompany.length) {
    return next(new ErrorResponse(`company not available or access denied ${id}`, 404));
  }

  await companyRepo.deleteCompanies(id);

  await sendNotification({
    title: "Company Deleted",
    message: accessibleCompany?.[0]?.company_name
      ? `${accessibleCompany[0].company_name} was deleted successfully`
      : `Company ID ${id} was deleted`,
    type: "company",
    module: "companies",
    recordId: Number(id),
    actionType: "delete",
    createdBy: accessibleCompany?.[0]?.owners?.[0]?.id || null,
  });

  res.status(200).json({
    success: true,
    message: "company deleted successfully"
  });
});


module.exports = {
  deleteCompanyController,
  updateCompanyController,
  createCompanyController,
  importCompaniesController,
  getSingleCompanyController,
  getAllCompanyController
};