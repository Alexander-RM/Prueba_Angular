interface Token {
    clientId: string;
    clientSecret: string;
    grantType: string;
    scope: string;
    code: string;
    refreshToken: string;
}

let token: Token;