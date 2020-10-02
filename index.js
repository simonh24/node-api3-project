// code away!
const server = require("./server.js");

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});
