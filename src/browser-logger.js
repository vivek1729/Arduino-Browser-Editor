export default element => {
  function logHTML(arr) {
    const div = document.createElement("div");
    const text = document.createTextNode(arr.join(""));

    div.appendChild(text);
    element.appendChild(div);
  }

  const Logger = {
    log() {
      const args = [].slice.call(arguments, 0);
      logHTML(args);
    }
  };

  ['debug', 'info', 'warn', 'error', 'fatal'].forEach(type => {
    Logger[type] = Logger.log;
  });

  return Logger;
};