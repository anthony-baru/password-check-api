const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const PORT = process.env.HOST_PORT || 3000;

async function start() {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

start().then( () => {
  console.log(`Server started`)
});

