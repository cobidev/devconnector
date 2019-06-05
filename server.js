const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('API RUNNING');
});

const PORT = process.env.port || 5000;
app.listen(PORT, err => console.log(`Server started on port: ${PORT}`));
