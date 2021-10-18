import { Component, OnInit } from '@angular/core';
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';
import { environment } from "src/environments/environment";


@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html'
})
export class DocumentacionComponent implements OnInit {
  
  public SWAGGER_URL: string;

  constructor() { 
    this.SWAGGER_URL = environment.endpoint_swagger;
  }

  ngOnInit(): void {
       // Custom plugin for update component infoURL button download json definition
       const ButtonDownloadPlugin = function() {
        return {
            wrapComponents: {
                InfoUrl: (Original: any, { React}: any) => (props: any) => {
                  const url_json = props.url;
                  return React.createElement("a", {href: url_json, download: "swagger-api-cibanco"},
                         React.createElement("button", {className: "button-download-json"}, 
                         React.createElement("span", null, "Swagger "),
                         React.createElement("i", {className:"fa fa-download", 'aria-hidden':"true"})
                        )
                    )
                }
            }
        }
    }
    //Disable try out button
    const DisableTryItOutPlugin = function() {
      return {
        statePlugins: {
          spec: {
            wrapSelectors: {
              allowTryItOutFor: () => () => false
            }
          }
        }
      }
    }
    // Object that store url config, default show one url, but you can add more than one separate by commsssas
    const urlsConfig = [
          {"url": this.SWAGGER_URL, "name": "Open API ATMs"},
          //{"url": "https://petstore.swagger.io/v2/swagger.json", "name": "SwaggerExample API"}
    ];
    
      SwaggerUIBundle({
        urls: urlsConfig,
          dom_id: '#swagger-ui-container',
          deepLinking: true,
          syntaxHighlight: {
            activated: true,
            theme: 'monokai'
          },
          defaultModelsExpandDepth: -1,
          tryItOutEnabled: false,
          validatorUrl: 'none',
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl,
            ButtonDownloadPlugin,
            DisableTryItOutPlugin
          ],
          layout: "StandaloneLayout"
      });
  }

}
