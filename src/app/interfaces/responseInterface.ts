import {Aplicaciones} from "./aplicaciones";
import {Usuario} from "./usuario";
import {CognitoClient} from "./client";

export interface ResponseApi {
  success: boolean;
  message: string;
  code:    string;
  data?:    Map<string, any>;
}

export interface ResponseAppsApi {
  success: boolean;
  message: string;
  code:    string;
  data?:    Array<Aplicaciones>;
}

export interface ResponseUserApi {
  success: boolean;
  message: string;
  code:    string;
  data?:   Usuario;
}

export interface ResponseCognitoClientApi {
  success: boolean;
  message: string;
  code:    string;
  data?:   CognitoClient;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toResponse(json: string): Response {
    return JSON.parse(json);
  }

  public static responseToJson(value: Response): string {
    return JSON.stringify(value);
  }
}
