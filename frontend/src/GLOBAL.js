const apiPort = process.env.REACT_APP_API_PORT || window.location.port;
const apiLocation = `${process.env.REACT_APP_API_PROTOCOL || window.location.protocol}//${process.env.REACT_APP_API_HOST || window.location.hostname}${
    apiPort ? ":" + apiPort : ""
}`;
const loadStatuses = { initial: "initial", loading: "loading", error: "error", loaded: "loaded" };

export { apiLocation, loadStatuses };
