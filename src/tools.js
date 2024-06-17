const logDebug = (localStorage.getItem("logDebug") === "true"); // true | false
export const log = (log) => {
  if (logDebug) {
    console.log(log);
  }
}
