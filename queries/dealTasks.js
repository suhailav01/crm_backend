
const getTasksByDealId = `
  SELECT
    tt.*,

    -- created_by user name
    CONCAT(cu.first_name, ' ', cu.last_name) AS created_by_name,

    -- assigned_to user name
    CONCAT(au.first_name, ' ', au.last_name) AS assigned_to_name
  FROM deal_tasks tt
  LEFT JOIN users cu ON tt.created_by = cu.id
  LEFT JOIN users au ON tt.assigned_to = au.id
  WHERE tt.deal_id = $1
  ORDER BY tt.created_at DESC
`;

const getTaskById = `
  SELECT *
  FROM deal_tasks
  WHERE id = $1
`;

const createTask = `
  INSERT INTO deal_tasks (
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
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *
`;

const updateTask = `
  UPDATE deal_tasks
  SET
    task_name = $1,
    due_date = $2,
    due_time = $3,
    task_type = $4,
    priority = $5,
    assigned_to = $6,
    note = $7,
    status = $8,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $9
  RETURNING *
`;

const deleteTask = `
  DELETE FROM deal_tasks
  WHERE id = $1
  RETURNING *
`;

module.exports = {
  getTasksByDealId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};