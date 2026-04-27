const repo = require("../repositories/dealTasks");

// get tasks by deal id
const getTasksByDealId = async (req, res) => {
  try {
    const { dealId } = req.params;

    const data = await repo.getTasksByDealId(dealId);

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
      deal_id,
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
      !deal_id ||
      !task_name ||
      !due_date ||
      !due_time ||
      !task_type ||
      !priority
    ) {
      return res.status(400).json({
        success: false,
        message:
          "deal_id, task_name, due_date, due_time, task_type and priority are required",
      });
    }

    const data = await repo.createTask(
      deal_id,
      task_name,
      due_date,
      due_time,
      task_type,
      priority,
      assigned_to || null,
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
      assigned_to || null,
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
  getTasksByDealId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};