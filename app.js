const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4000;
app.set('view engine', 'ejs'); 

const homeRoutes = require('./routes/home');

// Middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRoutes);

app.listen(port, () => console.log(`Listening on port ${port}`));
