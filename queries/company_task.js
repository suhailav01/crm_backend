const getTasksByCompanyId = `
  SELECT
    ct.*,

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

  FROM company_tasks ct
  LEFT JOIN users cu
    ON ct.created_by = cu.id
  LEFT JOIN task_assignees ta
    ON ta.task_id = ct.id
    AND ta.module_type = 'company'
  LEFT JOIN users au
    ON ta.user_id = au.id
  WHERE ct.company_id = $1
  GROUP BY ct.id, cu.first_name, cu.last_name
  ORDER BY ct.created_at DESC
`;

const getTaskById = `
  SELECT
    ct.*,

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

  FROM company_tasks ct
  LEFT JOIN users cu
    ON ct.created_by = cu.id
  LEFT JOIN task_assignees ta
    ON ta.task_id = ct.id
    AND ta.module_type = 'company'
  LEFT JOIN users au
    ON ta.user_id = au.id
  WHERE ct.id = $1
  GROUP BY ct.id, cu.first_name, cu.last_name
`;

const createTask = `
  INSERT INTO company_tasks (
    company_id,
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
  UPDATE company_tasks
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
  DELETE FROM company_tasks
  WHERE id = $1
  RETURNING *
`;

module.exports = {
  getTasksByCompanyId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};