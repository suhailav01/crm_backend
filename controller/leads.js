const leadsRepo = require('../repositories/leads');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const sendNotification = require('../utils/notify');

// @desc get all leads
// @route GET /api/v1/leads
// @access private
const getAllLeadsController = asyncHandler(async (req, res, next) => {
  let leads = [];

  if (req.user.role === "admin") {
    leads = await leadsRepo.getAllLeads();
  } else {
    leads = await leadsRepo.getAllLeadsByUserId(req.user.id);
  }

  res.status(200).json({ success: true, data: leads });
});

// @desc get single lead by id
// @route GET /api/v1/leads/:id
// @access private
const getSingleLeadsController = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let leads = [];

  if (req.user.role === "admin") {
    leads = await leadsRepo.getLeadsById(id);
  } else {
    leads = await leadsRepo.getLeadByIdForUser(id, req.user.id);
  }

  if (leads.length) {
    res.status(200).json({ success: true, data: leads[0] });
  } else {
    next(new ErrorResponse(`Lead not available or access denied ${id}`, 404));
  }
});

// @desc create a lead
// @route POST /api/v1/leads
// @access private
const createleadsController = asyncHandler(async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    job_title,
    city = null,
    company_id = null,
    status,
    is_converted = false,
    owners
  } = req.body;

  const finalOwners =
    req.user.role === "admin"
      ? (owners || [])
      : [req.user.id];

  const createdLead = await leadsRepo.createLeads(
    first_name,
    last_name,
    email,
    phone_number,
    job_title,
    city,
    company_id,
    status,
    is_converted,
    finalOwners
  );

  await sendNotification({
    title: "New Lead Created",
    message: `${first_name} ${last_name} was created successfully`,
    type: "lead",
    module: "leads",
    recordId: createdLead.id,
    actionType: "create",
    createdBy: finalOwners?.[0] || null,
  });

  res.status(201).json({
    success: true,
    data: createdLead
  });
});

// @desc update a lead by id
// @route PUT /api/v1/leads/:id
// @access private
const updateleadsController = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const {
    first_name,
    last_name,
    email,
    phone_number,
    job_title,
    city = null,
    company_id = null,
    status,
    is_converted = false,
    owners
  } = req.body;

  const finalOwners =
    req.user.role === "admin"
      ? (owners || [])
      : [req.user.id];

  let accessibleLead = [];

  if (req.user.role === "admin") {
    accessibleLead = await leadsRepo.getLeadsById(id);
  } else {
    accessibleLead = await leadsRepo.getLeadByIdForUser(id, req.user.id);
  }

  if (!accessibleLead.length) {
    return next(new ErrorResponse(`Lead not available or access denied ${id}`, 404));
  }

  const updatedLead = await leadsRepo.updateLeads(
    id,
    first_name,
    last_name,
    email,
    phone_number,
    job_title,
    city,
    company_id,
    status,
    is_converted,
    finalOwners
  );

  await sendNotification({
    title: "Lead Updated",
    message: `${first_name} ${last_name} was updated successfully`,
    type: "lead",
    module: "leads",
    recordId: Number(id),
    actionType: "update",
    createdBy: finalOwners?.[0] || null,
  });

  res.status(200).json({
    success: true,
    data: updatedLead
  });
});

// @desc delete a lead by id
// @route DELETE /api/v1/leads/:id
// @access private
const deleteleadsController = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  let accessibleLead = [];

  if (req.user.role === "admin") {
    accessibleLead = await leadsRepo.getLeadsById(id);
  } else {
    accessibleLead = await leadsRepo.getLeadByIdForUser(id, req.user.id);
  }

  if (!accessibleLead.length) {
    return next(new ErrorResponse(`Lead not available or access denied ${id}`, 404));
  }

  await leadsRepo.deleteLeads(id);

  await sendNotification({
    title: "Lead Deleted",
    message: accessibleLead?.[0]
      ? `${accessibleLead[0].first_name} ${accessibleLead[0].last_name} was deleted successfully`
      : `Lead ID ${id} was deleted`,
    type: "lead",
    module: "leads",
    recordId: Number(id),
    actionType: "delete",
    createdBy: accessibleLead?.[0]?.owners?.[0]?.id || null,
  });

  res.status(200).json({
    success: true,
    message: "leads deleted successfully"
  });
});
// @desc import multiple leads
// @route POST /api/v1/leads/import
// @access private
const importLeadsController = asyncHandler(async (req, res, next) => {
  const { leads } = req.body;

  if (!Array.isArray(leads) || leads.length === 0) {
    return next(new ErrorResponse("Leads array is required", 400));
  }

  const insertedLeads = [];

  for (const lead of leads) {
    const {
      first_name,
      last_name = "",
      email,
      phone_number,
      job_title = "",
      city = null,
      company_id = null,
      status = "New",
      is_converted = false,
      owners = [],
    } = lead;

    if (!first_name || !email || !phone_number) {
      continue;
    }

    const finalOwners =
      req.user.role === "admin"
        ? (owners || []).map((id) => Number(id)).filter(Boolean)
        : [req.user.id];

    if (!finalOwners.length) {
      continue;
    }

    const createdLead = await leadsRepo.createLeads(
      first_name,
      last_name,
      email,
      phone_number,
      job_title,
      city,
      company_id,
      status,
      is_converted,
      finalOwners
    );

    insertedLeads.push(createdLead);

    await sendNotification({
      title: "New Lead Created",
      message: `${first_name} ${last_name} was created successfully`,
      type: "lead",
      module: "leads",
      recordId: createdLead.id,
      actionType: "create",
      createdBy: finalOwners?.[0] || null,
    });
  }

  res.status(201).json({
    success: true,
    message: "Leads imported successfully",
    count: insertedLeads.length,
    data: insertedLeads,
  });
});
module.exports = {
  getAllLeadsController,
  getSingleLeadsController,
  createleadsController,
  updateleadsController,
  deleteleadsController,
  importLeadsController
};