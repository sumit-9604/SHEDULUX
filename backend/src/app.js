const express = require('express');
const cors = require('cors');
const scheduleRoutes = require('./src/routes/scheduleRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const requestLogger = require('./src/middlewares/requestLogger');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(requestLogger);

app.use('/api', scheduleRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', engine: 'SHEDULUX v1.0' }));

app.use(errorHandler);

module.exports = app;