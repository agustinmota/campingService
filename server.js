const express = require('express');
const app = express();
const routes = require('./routes/indexRouter');
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(express.json()); 

const { init } = require('./models');
routes(app);

init();


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
