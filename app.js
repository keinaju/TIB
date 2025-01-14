const express = require("express");
const app = express();
const port = process.env.TIB_PORT || 3000;

app.use(express.static("public"));

app.listen(port, () => console.log(`Server is listening on port ${port}.`));
