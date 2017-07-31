// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCoSa_3upryZCjoQ7DlTLzc9ISMhKzog_8",
    authDomain: "comp3150project.firebaseapp.com",
    databaseURL: "https://comp3150project.firebaseio.com",
    projectId: "comp3150project",
    storageBucket: "comp3150project.appspot.com",
    messagingSenderId: "857460931484"
  }
};
