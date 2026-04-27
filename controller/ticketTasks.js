const repo = require("../repositories/ticketTasks");

// get tasks by ticket id
const getTasksByTicketId = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const data = await repo.getTasksByTicketId(ticketId);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("GET TASKS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get single task by id
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await repo.getTaskById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET TASK BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// create task
const createTask = async (req, res) => {
  try {
    const {
      ticket_id,
      task_name,
      due_date,
      due_time,
      task_type,
      priority,
      assigned_to,
      note,
      status,
      created_by,
    } = req.body;

    if (
      !ticket_id ||
      !task_name ||
      !due_date ||
      !due_time ||
      !task_type ||
      !priority
    ) {
      return res.status(400).json({
        success: false,
        message:
          "ticket_id, task_name, due_date, due_time, task_type and priority are required",
      });
    }

    if (!Array.isArray(assigned_to) || assigned_to.length === 0) {
      return res.status(400).json({
        success: false,
        message: "assigned_to must be a non-empty array",
      });
    }

    const cleanedAssignedTo = assigned_to.map(Number).filter(Boolean);

    if (cleanedAssignedTo.length === 0) {
      return res.status(400).json({
        success: false,
        message: "assigned_to must contain valid user ids",
      });
    }

    const data = await repo.createTask(
      ticket_id,
      task_name,
      due_date,
      due_time,
      task_type,
      priority,
      cleanedAssignedTo,
      note || null,
      status || "Pending",
      created_by || null
    );

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data,
    });
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      task_name,
      due_date,
      due_time,
      task_type,
      priority,
      assigned_to,
      note,
      status,
    } = req.body;

    if (!task_name || !due_date || !due_time || !task_type || !priority) {
      return res.status(400).json({
        success: false,
        message:
          "task_name, due_date, due_time, task_type and priority are required",
      });
    }

    if (!Array.isArray(assigned_to) || assigned_to.length === 0) {
      return res.status(400).json({
        success: false,
        message: "assigned_to must be a non-empty array",
      });
    }

    const cleanedAssignedTo = assigned_to.map(Number).filter(Boolean);

    if (cleanedAssignedTo.length === 0) {
      return res.status(400).json({
        success: false,
        message: "assigned_to must contain valid user ids",
      });
    }

    const existingTask = await repo.getTaskById(id);

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const data = await repo.updateTask(
      id,
      task_name,
      due_date,
      due_time,
      task_type,
      priority,
      cleanedAssignedTo,
      note || null,
      status || existingTask.status
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data,
    });
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const existingTask = await repo.getTaskById(id);

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const data = await repo.deleteTask(id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data,
    });
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTasksByTicketId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};