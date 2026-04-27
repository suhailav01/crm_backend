const pool = require("../config/db");
const queries = require("../queries/leadsTask");

// get all tasks by lead id
const getTasksByLeadId = async (leadsId) => {
  const result = await pool.query(queries.getTasksByLeadsId, [leadsId]);
  return result.rows;
};

// get single task by id
const getTaskById = async (id) => {
  const result = await pool.query(queries.getTaskById, [id]);
  return result.rows[0];
};

// create task
const createTask = async (
  leads_id,
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

    // 1. insert task
    const taskResult = await client.query(queries.createTask, [
      leads_id,
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

    // 2. insert multiple assignees
    if (Array.isArray(assigned_to) && assigned_to.length > 0) {
      for (const userId of assigned_to) {
        await client.query(
          `
          INSERT INTO task_assignees (module_type, task_id, user_id)
          VALUES ($1, $2, $3)
          `,
          ["lead", task.id, userId]
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

    // 1. update task
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

    // 2. delete old assignees
    await client.query(
      `
      DELETE FROM task_assignees
      WHERE module_type = $1 AND task_id = $2
      `,
      ["lead", id]
    );

    // 3. insert new assignees
    if (Array.isArray(assigned_to) && assigned_to.length > 0) {
      for (const userId of assigned_to) {
        await client.query(
          `
          INSERT INTO task_assignees (module_type, task_id, user_id)
          VALUES ($1, $2, $3)
          `,
          ["lead", id, userId]
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
  getTasksByLeadId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};