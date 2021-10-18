export interface Client {
  clientName: string;
}

export interface CognitoClient {
  clientId: string | undefined;
  clientSecret: string | undefined;
}

let client: Client;
