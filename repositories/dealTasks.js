
const pool = require("../config/db");
const queries = require("../queries/dealTasks");

// get all tasks by deal id
const getTasksByDealId = async (dealId) => {
  const result = await pool.query(queries.getTasksByDealId, [dealId]);
  return result.rows;
};

// get single task by id
const getTaskById = async (id) => {
  const result = await pool.query(queries.getTaskById, [id]);
  return result.rows[0];
};

// create task
const createTask = async (
  deal_id,
  task_name,
  due_date,
  due_time,
  task_type,
  priority,
  assigned_to,
  note,
  status,
  created_by
) => {
  const result = await pool.query(queries.createTask, [
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
  ]);
  return result.rows[0];
};

// update task
const updateTask = async (
  id,
  task_name,
  due_date,
  due_time,
  task_type,
  priority,
  assigned_to,
  note,
  status
) => {
  const result = await pool.query(queries.updateTask, [
    task_name,
    due_date,
    due_time,
    task_type,
    priority,
    assigned_to,
    note,
    status,
    id,
  ]);
  return result.rows[0];
};

// delete task
const deleteTask = async (id) => {
  const result = await pool.query(queries.deleteTask, [id]);
  return result.rows[0];
};

module.exports = {
  getTasksByDealId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};