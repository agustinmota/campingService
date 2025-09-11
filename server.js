const express = require('express');
const app = express();
const routes = require('./routes/indexRouter');

app.use(express.json()); 

const { init } = require('./models');
routes(app);

init();


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
