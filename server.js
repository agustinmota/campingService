const express = require('express');
const app = express();
const routes = require('./routes/indexRouter');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(express.json()); 
app.use(cors());
const { init } = require('./models');
routes(app);

init();


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
