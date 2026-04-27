const dealRepo = require("../repositories/deals");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const sendNotification = require("../utils/notify");

// --------------------------------------------------------------------

const getAllDealController = asyncHandler(async (req, res, next) => {
  let deal = [];

  if (req.user.role === "admin") {
    deal = await dealRepo.getAllDeals();
  } else {
    deal = await dealRepo.getAllDealsByUserId(req.user.id);
  }

  res.status(200).json({ success: true, data: deal });
});

//-----------------------------------------------------------

const getSingleDealController = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let deal = [];

  if (req.user.role === "admin") {
    deal = await dealRepo.getDealById(id);
  } else {
    deal = await dealRepo.getDealByIdForUser(id, req.user.id);
  }

  if (deal.length) {
    res.status(200).json({ success: true, data: deal[0] });
  } else {
    next(new ErrorResponse(`Deal not available or access denied ${id}`, 404));
  }
});

//-------------------------------------------------------------------

const createDealController = asyncHandler(async (req, res, next) => {
  const {
    deal_name,
    lead_id,
    company_id,
    deal_stage,
    amount,
    close_date,
    priority,
    owners
  } = req.body;

  const finalOwners =
    req.user.role === "admin"
      ? (owners || [])
      : [req.user.id];

  const lead = await dealRepo.getLeadById(lead_id);

  if (!lead || lead.length === 0) {
    return next(new ErrorResponse("Lead not found", 404));
  }

  if (lead[0].status !== "Qualified") {
    return next(
      new ErrorResponse("Only Qualified leads can be converted", 400)
    );
  }

  if (lead[0].is_converted) {
    return next(new ErrorResponse("Lead already converted", 400));
  }

  const createdDeal = await dealRepo.createDeals(
    deal_name,
    lead_id,
    company_id,
    deal_stage,
    amount,
    close_date,
    priority,
    finalOwners
  );

  await dealRepo.convertLead(lead_id);

  await sendNotification({
    title: "New Deal Created",
    message: `${deal_name} was created successfully`,
    type: "deal",
    module: "deals",
    recordId: createdDeal.id,
    actionType: "create",
    createdBy: finalOwners?.[0] || null,
  });

  res.status(201).json({
    success: true,
    message: "Deal created successfully",
    data: createdDeal,
  });
});

// ✅ IMPORT MULTIPLE DEALS
const importDealsController = asyncHandler(async (req, res, next) => {
  const { deals } = req.body;

  if (!Array.isArray(deals) || deals.length === 0) {
    return next(new ErrorResponse("Deals array is required", 400));
  }

  const insertedDeals = [];

  for (const deal of deals) {
    const {
      deal_name,
      lead_id,
      company_id = null,
      deal_stage = "Proposal Sent",
      amount = 0,
      close_date = null,
      priority = "Medium",
      owners = []
    } = deal;

    if (!deal_name || !lead_id || !deal_stage) {
      continue;
    }

    const finalOwners =
      req.user.role === "admin"
        ? (owners || []).map((id) => Number(id)).filter(Boolean)
        : [req.user.id];

    if (!finalOwners.length) {
      continue;
    }

    const lead = await dealRepo.getLeadById(lead_id);

    if (!lead || lead.length === 0) {
      continue;
    }

    if (lead[0].status !== "Qualified") {
      continue;
    }

    if (lead[0].is_converted) {
      continue;
    }

    const createdDeal = await dealRepo.createDeals(
      deal_name,
      lead_id,
      company_id,
      deal_stage,
      amount,
      close_date,
      priority,
      finalOwners
    );

    await dealRepo.convertLead(lead_id);

    insertedDeals.push(createdDeal);

    await sendNotification({
      title: "New Deal Created",
      message: `${deal_name} was created successfully`,
      type: "deal",
      module: "deals",
      recordId: createdDeal.id,
      actionType: "create",
      createdBy: finalOwners?.[0] || null,
    });
  }

  res.status(201).json({
    success: true,
    message: "Deals imported successfully",
    count: insertedDeals.length,
    data: insertedDeals,
  });
});

//-------------------------------------------------------------------------------------------------------

const updateDealController = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const {
    deal_name,
    lead_id,
    company_id,
    deal_stage,
    amount,
    close_date,
    priority,
    owners
  } = req.body;

  const finalOwners =
    req.user.role === "admin"
      ? (owners || [])
      : [req.user.id];

  let accessibleDeal = [];

  if (req.user.role === "admin") {
    accessibleDeal = await dealRepo.getDealById(id);
  } else {
    accessibleDeal = await dealRepo.getDealByIdForUser(id, req.user.id);
  }

  if (!accessibleDeal.length) {
    return next(new ErrorResponse(`Deal not available or access denied ${id}`, 404));
  }

  if (lead_id) {
    const lead = await dealRepo.getLeadById(lead_id);

    if (!lead || lead.length === 0) {
      return next(new ErrorResponse("Lead not found", 404));
    }
  }

  const updatedDeal = await dealRepo.updateDeal(
    id,
    deal_name,
    lead_id,
    company_id,
    deal_stage,
    amount,
    close_date,
    priority,
    finalOwners
  );

  await sendNotification({
    title: "Deal Updated",
    message: `${deal_name} was updated successfully`,
    type: "deal",
    module: "deals",
    recordId: Number(id),
    actionType: "update",
    createdBy: finalOwners?.[0] || null,
  });

  res.status(200).json({
    success: true,
    message: "Deal updated successfully",
    data: updatedDeal,
  });
});

//----------------------------------------------------------------------------------------------------------------------

const deleteDealController = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  let accessibleDeal = [];

  if (req.user.role === "admin") {
    accessibleDeal = await dealRepo.getDealById(id);
  } else {
    accessibleDeal = await dealRepo.getDealByIdForUser(id, req.user.id);
  }

  if (!accessibleDeal.length) {
    return next(new ErrorResponse(`Deal not available or access denied ${id}`, 404));
  }

  await dealRepo.deleteDeal(id);

  await sendNotification({
    title: "Deal Deleted",
    message: accessibleDeal?.[0]?.deal_name
      ? `${accessibleDeal[0].deal_name} was deleted successfully`
      : `Deal ID ${id} was deleted`,
    type: "deal",
    module: "deals",
    recordId: Number(id),
    actionType: "delete",
    createdBy: accessibleDeal?.[0]?.owners?.[0]?.id || null,
  });

  res.status(200).json({
    success: true,
    message: "Deal deleted successfully",
  });
});

//-------------------------------------------------------------------------------

const getQualifiedLeadsController = asyncHandler(async (req, res, next) => {
  const leads = await dealRepo.getQualifiedLeads();

  if (!leads || leads.length === 0) {
    return next(new ErrorResponse("No qualified leads found", 404));
  }

  res.status(200).json({
    success: true,
    count: leads.length,
    data: leads,
  });
});

//---------------------------------------------------------------------

module.exports = {
  getAllDealController,
  getSingleDealController,
  createDealController,
  importDealsController,
  updateDealController,
  deleteDealController,
  getQualifiedLeadsController,
};