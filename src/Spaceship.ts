import fetch from "isomorphic-fetch";
import Account from "./Account";

interface SpaceshipConfig {
  username: string;
  password: string;
}

class Spaceship {
  static host = "https://api.spaceshipinvest.com.au";
  static v1 = (str: string) => `${Spaceship.host}/v1${str}`;

  private account: Account;

  static refreshToken() {}

  async init(config: SpaceshipConfig) {
    this.account = new Account();
    let res = await this.account.login(config.username, config.password);
    // console.log(res);
  }
}

export default Spaceship;
