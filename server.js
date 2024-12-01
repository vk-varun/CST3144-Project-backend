var express = require("express");

const app = express();

app.use(express.json())

// logger middleware
app.use((req, res, next) => {
    console.log("Request IP: " + req.url);
    console.log("Request Date: " + new Date());
    next();
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});