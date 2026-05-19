require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');

const authRoutes        = require('./routes/authRoutes');
const dashboardRoutes   = require('./routes/dashboardRoutes');
const subprojectRoutes  = require('./routes/subprojectRoutes');
const installerRoutes   = require('./routes/installerRoutes');
const materialRoutes    = require('./routes/materialRoutes');
const userRoutes        = require('./routes/userRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

// CORS — allow React dev server to call this API
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Parse JSON and form bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session auth — TODO: replace with JWT when React frontend is wired up
app.use(session({
  secret:            process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave:            false,
  saveUninitialized: false,
  cookie:            { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
}));

// API routes
app.use('/api/auth',      authRoutes);
app.use('/api',           dashboardRoutes);
app.use('/api',           subprojectRoutes);
app.use('/api',           installerRoutes);
app.use('/api',           materialRoutes);
app.use('/api/users',     userRoutes);

// TODO: mount as modules are built
// app.use('/api/projects',  projectRoutes);
// app.use('/api/materials', materialRoutes);
// app.use('/api/schedule',  scheduleRoutes);
// app.use('/api/punch',     punchRoutes);
// app.use('/api/billing',   billingRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`James Blinds API running at http://localhost:${PORT}`);
});
