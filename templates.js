const apiConfiguration = params => `
  <button name="show" class="toggle">Settings</button>
  <form>
    Enter API URL <br>
    <input type="text" name="api_path" value="${params.path}">
    <button name="save">Save</button>
    <button name="clear">Clear</button>
  </form>
  `

export { apiConfiguration }
