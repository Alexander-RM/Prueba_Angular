// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  region: 'us-east-1',
  identityPoolId: '4qslabgj4bddni3l74113t6ll5',
  userPoolId: 'us-east-1_XtycWtPuP',
  clientId: '4qslabgj4bddni3l74113t6ll5',
  cognito_idp_endpoint: '',
  cognito_identity_endpoint: '',
  sts_endpoint: '',
  endpoint_lambda: 'http://localhost:4200/api',
  endpoint_swagger: 'https://mciobapis.ciopendev.com/v1/cibanco/api/swagger-json'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
