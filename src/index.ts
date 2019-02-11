import env from "dotenv";
import Spaceship from "./Spaceship";

env.config();

(async () => {
  let spaceship = new Spaceship();
  await spaceship.init({
    username: process.env.SPACESHIP_USERNAME,
    password: process.env.SPACESHIP_PASSWORD
  });
})();

//export default Spaceship;
