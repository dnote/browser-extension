class Store {
  constructor() {
    this._state = {};
  }

  get = () => {
    console.log("geting");
    return this._state;
  };

  set = obj => {
    console.log("obj", obj);
    this._state = {
      ...this._state,
      ...obj
    };
  };
}

export default Store;
