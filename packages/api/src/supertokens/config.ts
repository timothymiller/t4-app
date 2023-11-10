import type { TypeInput} from "supertokens-node/types";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import { TypeFramework } from "supertokens-node/lib/build/framework/types";


export const superTokensConfig: TypeInput = {
  framework: "custom" as TypeFramework,
  supertokens: {
    // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
    connectionURI: "https://try.supertokens.com",
    // apiKey: <API_KEY(if configured)>,
  },
  appInfo: {
    appName: "T4 App",
    apiDomain: "http://localhost:8787",
    websiteDomain: "http://localhost:3000",
    apiBasePath: "/api/auth",
  },
  recipeList: [
    ThirdPartyEmailPassword.init(), // initializes signin / sign up features
    Session.init(), // initializes session features
  ],
}