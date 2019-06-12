export function logRedux(action: any) {
  if (process.env.NODE_ENV === "development") {
    console.log("\n------------------------------------"); // tslint:disable-line
    console.log("action.type", action.type); // tslint:disable-line
    console.log("action.payload", action.payload); // tslint:disable-line
    console.log("------------------------------------\n"); // tslint:disable-line
  }
}
