const express = require('express')

const app = express()

app.get('/',function(req,res) {
    res.send("Hello world From Server 1");
});

app.listen(process.env.PORT, process.env.IP, () => {
	console.log(`Test server started on port ${process.env.PORT}`);
});
