import fetch from "isomorphic-fetch";
import uuid from "uuid/v4";
import Spaceship from "./Spaceship";

type Token = string;
type Uuid = string;
type EpochTime = number;

interface LoginSuccessResponse {
  signup_id: Uuid;
  decoupled: boolean;
  intercom_android_hash: string;
  intercom_ios_hash: string;
  oauth2: {
    access_token: Token;
    expires_in: number;
    refresh_token: Token;
    scope: string;
    token_type: "Bearer";
  };
}

interface LoginFailedResponse {
  code: number;
  message: string;
}

type LoginResponse = LoginSuccessResponse | LoginFailedResponse;

function isLoginSuccess(res: LoginResponse): res is LoginSuccessResponse {
  return (<LoginSuccessResponse>res).signup_id !== undefined;
}

type UserStatus = "ACTIVE";
type Gender = "X";

interface UserResponse {
  dob: string;
  id: Uuid;
  account_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  gender: Gender;
  cookie_id: Uuid;
  status: UserStatus;
  created_at: EpochTime;
  last_updated_at: EpochTime;
  address: [
    {
      id: Uuid;
      contact_id: Uuid;
      type: number;
      street_address: string;
      state: string;
      suburb: string;
      postcode: string;

      raw_address: string;
      created_at: EpochTime;
      last_updated_at: EpochTime;
    }
  ];
  verification: {
    ehawk: boolean;
    green_id: boolean;
    green_id_status:
      | "VERIFIED"
      | "VERIFIED_ADMIN"
      | "VERIFIED_WITH_CHANGES"
      | "IN_PROGRESS"
      | "PENDING"
      | "LOCKED_OUT";
  };
}

class Account {
  static go = (str: string) => Spaceship.v1(`/account${str}`);

  bearer: Token;

  async getUser() {
    if (!this.bearer) {
      throw new Error("Please login first.");
    }

    const res = await fetch(Account.go("/user"), {
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${this.bearer}`
      }
    });

    const payload = await res.json();
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const auth = Buffer.from(`${username}:${password}`).toString("base64");

    const res = await fetch(Account.go("/login"), {
      method: "post",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Basic ${auth}`
      }
    });

    const payload: LoginResponse = await res.json();

    if (!isLoginSuccess(payload)) {
      throw new Error(payload.message);
    }

    this.bearer = payload.oauth2.access_token;

    return payload;
  }
}

export default Account;
