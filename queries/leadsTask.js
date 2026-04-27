const getTasksByLeadsId = `
  SELECT
    lt.*,

    CONCAT(cu.first_name, ' ', cu.last_name) AS created_by_name,

    COALESCE(
      json_agg(
        DISTINCT jsonb_build_object(
          'id', au.id,
          'name', CONCAT(au.first_name, ' ', au.last_name)
        )
      ) FILTER (WHERE au.id IS NOT NULL),
      '[]'
    ) AS assigned_users

  FROM lead_tasks lt
  LEFT JOIN users cu
    ON lt.created_by = cu.id
  LEFT JOIN task_assignees ta
    ON ta.task_id = lt.id
    AND ta.module_type = 'lead'
  LEFT JOIN users au
    ON ta.user_id = au.id
  WHERE lt.lead_id = $1
  GROUP BY lt.id, cu.first_name, cu.last_name
  ORDER BY lt.created_at DESC
`;

const getTaskById = `
  SELECT
    lt.*,

    CONCAT(cu.first_name, ' ', cu.last_name) AS created_by_name,

    COALESCE(
      json_agg(
        DISTINCT jsonb_build_object(
          'id', au.id,
          'name', CONCAT(au.first_name, ' ', au.last_name)
        )
      ) FILTER (WHERE au.id IS NOT NULL),
      '[]'
    ) AS assigned_users

  FROM lead_tasks lt
  LEFT JOIN users cu
    ON lt.created_by = cu.id
  LEFT JOIN task_assignees ta
    ON ta.task_id = lt.id
    AND ta.module_type = 'lead'
  LEFT JOIN users au
    ON ta.user_id = au.id
  WHERE lt.id = $1
  GROUP BY lt.id, cu.first_name, cu.last_name
`;

const createTask = `
  INSERT INTO lead_tasks (
    lead_id,
    task_name,
    due_date,
    due_time,
    task_type,
    priority,
    note,
    status,
    created_by
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING *
`;

const updateTask = `
  UPDATE lead_tasks
  SET
    task_name = $1,
    due_date = $2,
    due_time = $3,
    task_type = $4,
    priority = $5,
    note = $6,
    status = $7,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $8
  RETURNING *
`;

const deleteTask = `
  DELETE FROM lead_tasks
  WHERE id = $1
  RETURNING *
`;

module.exports = {
  getTasksByLeadsId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};