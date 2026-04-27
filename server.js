const express = require('express')
const createTables = require('./config/createTables')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })
const errorHandler = require('./middlewares/errorHandler')
const PORT = process.env.PORT || 5000;
const app = express()
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend.vercel.app"
  ],
  credentials: true
}));
app.use(express.json())
createTables()
//signup rout
const signupRouter = require('./router/signup')
app.use('/api/auth/signup', signupRouter)
// login rout
const loginRouter = require('./router/login')
app.use('/api/auth/login', loginRouter)
//company rout
const companyRout = require('./router/companies')
app.use('/api/v1/companies', companyRout)
//reset password rout
const auth = require('./router/auth')
app.use('/api/auth', auth)
///leads router
const leadsroute = require('./router/leads')
app.use('/api/v1/leads', leadsroute)
//deals route
const dealsroute = require('./router/Deals')
app.use('/api/v1/deals', dealsroute)
const ticketsRoutes = require('./router/tickets');
app.use('/api/v1/tickets', ticketsRoutes);
//tickets notes route
const ticketsNotesRouter = require('./router/ticketsNotes');
app.use("/api/v1/notes", ticketsNotesRouter);
// ticket emails route
const ticketEmailRouter = require('./router/ticketsEmail');
app.use("/api/v1/emails", ticketEmailRouter)
// ticket calls route
const ticketCallsRouter = require('./router/ticketsCalls');
app.use("/api/v1/calls", ticketCallsRouter)
// ticket tasks route
const ticketTasksRouter = require('./router/ticketTasks');
app.use("/api/v1/tasks", ticketTasksRouter)
// ticket meetings route
const ticketMeetingRouter = require('./router/ticketMeeting')
app.use("/api/v1/meetings", ticketMeetingRouter)
// ticket activity route
const activityRouter = require("./router/ticketActivity");
app.use("/api/v1/activity", activityRouter);
// attachment routes
const attachmentRoutes = require("./router/ticketAttachment");
app.use("/api/attachments", attachmentRoutes);
//leads notes route
const leadsNotesRouter = require('./router/leadsNotes');
app.use("/api/v1/leads-notes", leadsNotesRouter);
// leads emails route
const leadsEmailRouter = require('./router/leadsEmails');
app.use("/api/v1/lead-emails", leadsEmailRouter)
// leads calls route
const leadsCallsRouter = require('./router/leadsCalls');
app.use("/api/v1/lead-calls", leadsCallsRouter)
// leads tasks route
const leadsTasksRouter = require('./router/leadsTasks');
app.use("/api/v1/lead-tasks", leadsTasksRouter)
// leads meetings route
const leadsMeetingRouter = require('./router/leadsMeeting')
app.use("/api/v1/lead-meetings", leadsMeetingRouter)
// leads activity route
const leadactivityRouter = require("./router/leadsActivity");
app.use("/api/v1/lead-activity", leadactivityRouter);
// lead attachment routes
const leadattachmentRoutes = require("./router/leadsAttachment");
app.use("/api/v1/lead-attachments", leadattachmentRoutes);

//------------------------------------------------------

//deal notes route
const dealNotesRouter = require('./router/dealNotes');
app.use("/api/v1/deal/notes", dealNotesRouter);
// deal emails route
const dealEmailRouter = require('./router/dealEmail');
app.use("/api/v1/deal/emails", dealEmailRouter)
// deal calls route
const dealCallsRouter = require('./router/dealCalls');
app.use("/api/v1/deal/calls", dealCallsRouter)
// deal tasks route
const dealTasksRouter = require('./router/dealTask');
app.use("/api/v1/deal/tasks", dealTasksRouter)
// deal meetings route
const dealMeetingRouter = require('./router/dealMeeting')
app.use("/api/v1/deal/meetings", dealMeetingRouter)
// deal activity route
const dealactivityRouter = require("./router/dealActivity");
app.use("/api/v1/deal/activity", dealactivityRouter);
// deal attachment routes
const dealattachmentRoutes = require("./router/dealAttachments");
app.use("/api/v1/deal/attachments", dealattachmentRoutes);
// static access
app.use("/uploads", express.static("uploads"));
// search routes
const searchRouter = require("./router/search");
app.use("/api/v1/search", searchRouter);
// notification routes
const notificationsRouter = require("./router/notification");
app.use("/api/v1/notifications", notificationsRouter);
// dashboard route 
const dashboardRouter = require('./router/dashboard');
app.use('/api/v1/dashboard', dashboardRouter);
// company notes route
const companyNotesRouter = require('./router/company_notes');
app.use("/api/v1/company/notes", companyNotesRouter);
// company emails route 
const companyEmailRouter = require("./router/company_emails");
app.use('/api/v1/company/emails', companyEmailRouter);
// company calls route 
const companyCallsRouter = require("./router/company_calls");
app.use('/api/v1/company/calls', companyCallsRouter);
// company attachments route 
const companyAttachmentRouter = require("./router/company_attachments");
app.use('/api/v1/company/attachments', companyAttachmentRouter);
// company tasks route 
const companyTasksRouter = require("./router/company_tasks");
app.use('/api/v1/company/tasks', companyTasksRouter);
// company meetings route 
const companyMeetingsRouter = require('./router/company_meetings');
app.use('/api/v1/company/meetings', companyMeetingsRouter);
app.use("/uploads", express.static("uploads"));
app.use("/api/v1/profile", require("./router/profile"));
app.use(errorHandler)
app.listen(PORT, () => {
  console.log('server running port', PORT);
})