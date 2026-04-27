const pool = require("../config/db");
const queries = require("../queries/company_task");

// get all tasks by company id
const getTasksByCompanyId = async (companyId) => {
  const result = await pool.query(queries.getTasksByCompanyId, [companyId]);
  return result.rows;
};

// get single task by id
const getTaskById = async (id) => {
  const result = await pool.query(queries.getTaskById, [id]);
  return result.rows[0];
};

// create task
const createTask = async (
  company_id,
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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const taskResult = await client.query(queries.createTask, [
      company_id,
      task_name,
      due_date,
      due_time,
      task_type,
      priority,
      note,
      status,
      created_by,
    ]);

    const task = taskResult.rows[0];

    if (Array.isArray(assigned_to) && assigned_to.length > 0) {
      for (const userId of assigned_to) {
        await client.query(
          `
          INSERT INTO task_assignees (module_type, task_id, user_id)
          VALUES ($1, $2, $3)
          `,
          ["company", task.id, userId]
        );
      }
    }

    await client.query("COMMIT");
    return task;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const taskResult = await client.query(queries.updateTask, [
      task_name,
      due_date,
      due_time,
      task_type,
      priority,
      note,
      status,
      id,
    ]);

    const task = taskResult.rows[0];

    await client.query(
      `
      DELETE FROM task_assignees
      WHERE module_type = $1 AND task_id = $2
      `,
      ["company", id]
    );

    if (Array.isArray(assigned_to) && assigned_to.length > 0) {
      for (const userId of assigned_to) {
        await client.query(
          `
          INSERT INTO task_assignees (module_type, task_id, user_id)
          VALUES ($1, $2, $3)
          `,
          ["company", id, userId]
        );
      }
    }

    await client.query("COMMIT");
    return task;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// delete task
const deleteTask = async (id) => {
  const result = await pool.query(queries.deleteTask, [id]);
  return result.rows[0];
};

module.exports = {
  getTasksByCompanyId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};