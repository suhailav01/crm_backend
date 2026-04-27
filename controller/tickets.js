const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const sendNotification = require("../utils/notify");
const repo = require("../repositories/tickets");

// GET ALL TICKETS
const getTickets = asyncHandler(async (req, res, next) => {
  let result = [];

  if (req.user.role === "admin") {
    result = await repo.getAllTickets();
  } else {
    result = await repo.getAllTicketsByUserId(req.user.id);
  }

  res.status(200).json({
    success: true,
    data: result,
  });
});

// GET SINGLE TICKET
const getTicket = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let result = [];

  if (req.user.role === "admin") {
    result = await repo.getTicketById(id);
  } else {
    result = await repo.getTicketByIdForUser(id, req.user.id);
  }

  if (!result.length) {
    return next(
      new ErrorResponse(`Ticket not available or access denied ${id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: result[0],
  });
});

// CREATE TICKET
const createTicket = asyncHandler(async (req, res, next) => {
  const {
    ticket_name,
    description,
    status,
    source,
    priority,
    phone_number,
    deal_id,
    company_id,
    owners,
  } = req.body;

  if (deal_id && company_id) {
    return next(new ErrorResponse("Select either Deal OR Company", 400));
  }

  const finalOwners = req.user.role === "admin" ? owners || [] : [req.user.id];

  const createdTicket = await repo.createTicket(
    ticket_name,
    description,
    status,
    source,
    priority,
    phone_number,
    deal_id,
    company_id,
    finalOwners
  );

  await sendNotification({
    title: "New Ticket Created",
    message: `${ticket_name} was created successfully`,
    type: "ticket",
    module: "tickets",
    recordId: createdTicket.id,
    actionType: "create",
    createdBy: finalOwners?.[0] || null,
  });

  res.status(201).json({
    success: true,
    data: createdTicket,
  });
});

// IMPORT MULTIPLE TICKETS
const importTickets = asyncHandler(async (req, res, next) => {
  const { tickets } = req.body;

  if (!Array.isArray(tickets) || tickets.length === 0) {
    return next(new ErrorResponse("Tickets array is required", 400));
  }

  const insertedTickets = [];

  for (const ticket of tickets) {
    const {
      ticket_name,
      description = "",
      status = "Open",
      source = "Chat",
      priority = "Medium",
      phone_number = "",
      deal_id = null,
      company_id = null,
      owners = [],
    } = ticket;

    if (!ticket_name) {
      continue;
    }

    if ((deal_id && company_id) || (!deal_id && !company_id)) {
      continue;
    }

    const finalOwners =
      req.user.role === "admin"
        ? (owners || []).map((id) => Number(id)).filter(Boolean)
        : [req.user.id];

    if (!finalOwners.length) {
      continue;
    }

    const createdTicket = await repo.createTicket(
      ticket_name,
      description,
      status,
      source,
      priority,
      phone_number,
      deal_id,
      company_id,
      finalOwners
    );

    insertedTickets.push(createdTicket);

    await sendNotification({
      title: "New Ticket Created",
      message: `${ticket_name} was created successfully`,
      type: "ticket",
      module: "tickets",
      recordId: createdTicket.id,
      actionType: "create",
      createdBy: finalOwners?.[0] || null,
    });
  }

  res.status(201).json({
    success: true,
    message: "Tickets imported successfully",
    count: insertedTickets.length,
    data: insertedTickets,
  });
});

// UPDATE TICKET
const updateTicket = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const {
    ticket_name,
    description,
    status,
    source,
    priority,
    phone_number,
    deal_id,
    company_id,
    owners,
  } = req.body;

  if (deal_id && company_id) {
    return next(new ErrorResponse("Select either Deal OR Company", 400));
  }

  const finalOwners = req.user.role === "admin" ? owners || [] : [req.user.id];

  let accessibleTicket = [];

  if (req.user.role === "admin") {
    accessibleTicket = await repo.getTicketById(id);
  } else {
    accessibleTicket = await repo.getTicketByIdForUser(id, req.user.id);
  }

  if (!accessibleTicket.length) {
    return next(
      new ErrorResponse(`Ticket not available or access denied ${id}`, 404)
    );
  }

  const result = await repo.updateTickets(
    ticket_name,
    description,
    status,
    source,
    priority,
    phone_number,
    deal_id,
    company_id,
    finalOwners,
    id
  );

  const updatedTicket = result[0];

  await sendNotification({
    title: "Ticket Updated",
    message: `${ticket_name} was updated successfully`,
    type: "ticket",
    module: "tickets",
    recordId: Number(id),
    actionType: "update",
    createdBy: finalOwners?.[0] || null,
  });

  res.status(200).json({
    success: true,
    data: updatedTicket,
  });
});

// DELETE TICKET
const deleteTicket = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let accessibleTicket = [];

  if (req.user.role === "admin") {
    accessibleTicket = await repo.getTicketById(id);
  } else {
    accessibleTicket = await repo.getTicketByIdForUser(id, req.user.id);
  }

  if (!accessibleTicket.length) {
    return next(
      new ErrorResponse(`Ticket not available or access denied ${id}`, 404)
    );
  }

  await repo.deleteTickets(id);

  await sendNotification({
    title: "Ticket Deleted",
    message: accessibleTicket?.[0]?.ticket_name
      ? `${accessibleTicket[0].ticket_name} was deleted successfully`
      : `Ticket ID ${id} was deleted`,
    type: "ticket",
    module: "tickets",
    recordId: Number(id),
    actionType: "delete",
    createdBy: accessibleTicket?.[0]?.owners?.[0]?.id || null,
  });

  res.status(200).json({
    success: true,
    message: "Ticket deleted successfully",
  });
});

module.exports = {
  getTickets,
  getTicket,
  createTicket,
  importTickets,
  updateTicket,
  deleteTicket,
};