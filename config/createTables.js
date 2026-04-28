const pool = require("./db");

const createTables = async () => {
  try {
    // Users table
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    email VARCHAR(200) UNIQUE,
    phone_number VARCHAR(15),
    company_name VARCHAR(210),
    industry_type VARCHAR(150),
    country_region VARCHAR(150),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
    console.log("✅ Users table created");

    await pool.query(`
  ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
`);
    console.log("✅ Role column ensured");

    // Companies table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(150) NOT NULL,
        company_owner VARCHAR(150),
        email VARCHAR(150),
        phone_number VARCHAR(20),
        industry VARCHAR(100),
        city VARCHAR(100),
        country_region VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Companies table created");
    await pool.query(`
  ALTER TABLE companies 
  ADD COLUMN IF NOT EXISTS no_of_employees INTEGER;
`);
    await pool.query(`
  ALTER TABLE companies 
  ADD COLUMN IF NOT EXISTS annual_revenue NUMERIC;
`);
await pool.query(`
  ALTER TABLE companies 
  ADD COLUMN IF NOT EXISTS domain_name VARCHAR(255);
`);
    // Password resets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id SERIAL PRIMARY KEY,
        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL
      );
    `);
    console.log("✅ Password resets table created");

    // Leads table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        email VARCHAR(150),
        phone_number VARCHAR(20),
        job_title VARCHAR(150),
        city VARCHAR(100),
        contact_owner BIGINT REFERENCES users(id) ON DELETE SET NULL,
        company_id INT REFERENCES companies(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'New',
        is_converted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Leads table created");

    // Deals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS deals (
        id SERIAL PRIMARY KEY,
        deal_name VARCHAR(255) NOT NULL,
        lead_id INT REFERENCES leads(id) ON DELETE SET NULL,
        deal_stage VARCHAR(100) CHECK (
          deal_stage IN ('Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost')
        ),
        amount NUMERIC(12,2),
        deal_owner BIGINT REFERENCES users(id) ON DELETE SET NULL,
        close_date DATE,
        priority VARCHAR(50) CHECK (
          priority IN ('Low', 'Medium', 'High')
        ),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Deals table created");

    // Tickets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        ticket_name VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'Open' CHECK (
          status IN ('Open', 'In Progress', 'Resolved', 'Closed')
        ),
        source VARCHAR(100),
        priority VARCHAR(50) CHECK (
          priority IN ('Low', 'Medium', 'High')
        ),
        ticket_owner BIGINT REFERENCES users(id) ON DELETE SET NULL,
        deal_id INT REFERENCES deals(id) ON DELETE SET NULL,
        company_id INT REFERENCES companies(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tickets table created");

    // Ticket notes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ticket_notes (
        id SERIAL PRIMARY KEY,
        ticket_id INT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
        note_text TEXT NOT NULL,
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Ticket notes table created");

    // Ticket emails table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ticket_emails (
        id SERIAL PRIMARY KEY,
        ticket_id INT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
        recipients TEXT NOT NULL,
        subject VARCHAR(255),
        body TEXT NOT NULL,
        sent_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Ticket emails table created");

    // Ticket calls table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ticket_calls (
        id SERIAL PRIMARY KEY,
        ticket_id INT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
        connected_to VARCHAR(255) NOT NULL,
        call_outcome VARCHAR(100) NOT NULL,
        call_date DATE NOT NULL,
        call_time TIME NOT NULL,
        note TEXT,
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Ticket calls table created");

    // Ticket tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ticket_tasks (
        id SERIAL PRIMARY KEY,
        ticket_id INT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
        task_name VARCHAR(255) NOT NULL,
        due_date DATE NOT NULL,
        due_time TIME NOT NULL,
        task_type VARCHAR(100) NOT NULL,
        priority VARCHAR(50) NOT NULL,
        assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL,
        note TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Ticket tasks table created");

    // Ticket meetings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ticket_meetings (
        id SERIAL PRIMARY KEY,
        ticket_id INT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        attendees TEXT NOT NULL,
        location VARCHAR(255),
        reminder VARCHAR(100),
        note TEXT,
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Ticket meetings table created");

    // Ticket attachments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attachments (
        id SERIAL PRIMARY KEY,
        ticket_id INT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        uploaded_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Ticket attachments table created");

    // Lead notes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lead_notes (
        id SERIAL PRIMARY KEY,
        lead_id INT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        note_text TEXT NOT NULL,
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        attachments JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Lead notes table created");

    // Lead emails table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lead_emails (
        id SERIAL PRIMARY KEY,
        lead_id INT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        recipients TEXT NOT NULL,
        cc TEXT,
        bcc TEXT,
        subject VARCHAR(255),
        body TEXT NOT NULL,
        sent_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Lead emails table created");

    // Lead calls table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lead_calls (
        id SERIAL PRIMARY KEY,
        lead_id INT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        connected_to VARCHAR(255) NOT NULL,
        call_outcome VARCHAR(100) NOT NULL,
        call_date DATE NOT NULL,
        call_time TIME NOT NULL,
        note TEXT,
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Lead calls table created");

    // Notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        module VARCHAR(50) NOT NULL,
        record_id INT,
        action_type VARCHAR(20) NOT NULL,
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Notifications table created");

    // Company owners table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_owners (
        id SERIAL PRIMARY KEY,
        company_id INT REFERENCES companies(id) ON DELETE CASCADE,
        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log("✅ Company owners table created");

    // Ticket owners table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ticket_owners (
        id SERIAL PRIMARY KEY,
        ticket_id INT REFERENCES tickets(id) ON DELETE CASCADE,
        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log("✅ Ticket owners table created");

    // Lead owners table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lead_owners (
        id SERIAL PRIMARY KEY,
        lead_id INT REFERENCES leads(id) ON DELETE CASCADE,
        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log("✅ Lead owners table created");

    // Deal owners table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS deal_owners (
        id SERIAL PRIMARY KEY,
        deal_id INT REFERENCES deals(id) ON DELETE CASCADE,
        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log("✅ Deal owners table created");

    // Deal notes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS deal_notes (
        id SERIAL PRIMARY KEY,
        deal_id INT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
        note_text TEXT NOT NULL,
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Deal notes table created");

    // Deal emails table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS deal_emails (
        id SERIAL PRIMARY KEY,
        deal_id INT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
        recipients TEXT NOT NULL,
        subject VARCHAR(255),
        body TEXT NOT NULL,
        sent_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Deal emails table created");

    // Deal calls table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS deal_calls (
        id SERIAL PRIMARY KEY,
        deal_id INT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
        connected_to VARCHAR(255) NOT NULL,
        call_outcome VARCHAR(100) NOT NULL,
        call_date DATE NOT NULL,
        call_time TIME NOT NULL,
        note TEXT,
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Deal calls table created");

    // Lead tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lead_tasks (
        id SERIAL PRIMARY KEY,
        lead_id INT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        task_name VARCHAR(255) NOT NULL,
        due_date DATE NOT NULL,
        due_time TIME NOT NULL,
        task_type VARCHAR(100) NOT NULL,
        priority VARCHAR(50) NOT NULL,
        assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL,
        note TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Lead tasks table created");

    // Deal tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS deal_tasks (
        id SERIAL PRIMARY KEY,
        deal_id INT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
        task_name VARCHAR(255) NOT NULL,
        due_date DATE NOT NULL,
        due_time TIME NOT NULL,
        task_type VARCHAR(100) NOT NULL,
        priority VARCHAR(50) NOT NULL,
        assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL,
        note TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Deal tasks table created");

    // Lead meetings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lead_meetings (
        id SERIAL PRIMARY KEY,
        lead_id INT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        attendees TEXT NOT NULL,
        location VARCHAR(255),
        reminder VARCHAR(100),
        note TEXT,
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Lead meetings table created");

    // Lead attachments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lead_attachments (
        id SERIAL PRIMARY KEY,
        lead_id INT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        uploaded_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Lead attachments table created");

    // Deal meetings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS deal_meetings (
        id SERIAL PRIMARY KEY,
        deal_id INT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        attendees TEXT NOT NULL,
        location VARCHAR(255),
        reminder VARCHAR(100),
        note TEXT,
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Deal meetings table created");

    // Deal attachments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS deal_attachments (
        id SERIAL PRIMARY KEY,
        deal_id INT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        uploaded_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Deal attachments table created");
    // task assignees table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS task_assignees (
      id SERIAL PRIMARY KEY,
      module_type VARCHAR(50) NOT NULL CHECK (module_type IN ('lead', 'deal', 'company', 'ticket')),
      task_id INT NOT NULL,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE (module_type, task_id, user_id)
       );
      `);
    console.log("✅ task assignees table created");
    // company notes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_notes (
        id SERIAL PRIMARY KEY,
        company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        note_text TEXT NOT NULL,
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Company notes table created");
    // company email table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_emails (
        id SERIAL PRIMARY KEY,
        company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        recipients TEXT NOT NULL,
        subject VARCHAR(255),
        body TEXT NOT NULL,
        sent_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Company emails table created");
    // company calls table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_calls (
        id SERIAL PRIMARY KEY,
        company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        connected_to VARCHAR(255) NOT NULL,
        call_outcome VARCHAR(100) NOT NULL,
        call_date DATE NOT NULL,
        call_time TIME NOT NULL,
        note TEXT,
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Company calls table created");
    // company tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_tasks (
        id SERIAL PRIMARY KEY,
        company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        task_name VARCHAR(255) NOT NULL,
        due_date DATE NOT NULL,
        due_time TIME NOT NULL,
        task_type VARCHAR(100) NOT NULL,
        priority VARCHAR(50) NOT NULL,
        assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL,
        note TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Company tasks table created");
    // company meetings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_meetings (
        id SERIAL PRIMARY KEY,
        company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        attendees TEXT NOT NULL,
        location VARCHAR(255),
        reminder VARCHAR(100),
        note TEXT,
        created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Company meetings table created");
    // company attachments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_attachments (
        id SERIAL PRIMARY KEY,
        company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        uploaded_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Company attachments table created");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

module.exports = createTables;
