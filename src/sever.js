const express = require('express');
const bodyParser = require('body-paser');
const app = express();
const PORT = 3000

let collaborationUpdates = [];

app.use(bodyParser.json());

app.post('/webhook',(req, res) =>{
    const update = req.body;
    collaborationUpdates.push(update);
    res.status(200).send('Webhook received');
});

app.get('/updates', (req, res) => {
    res.status(200).json(collaborationUpdates);
});

app.listen(PORT, () => {
    console.log('Server is runing on port ${PORT}');
});