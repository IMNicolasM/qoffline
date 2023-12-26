export const APP_OFFLINE = (state) => {
  state.isAppOffline = true;
};
export const APP_ONLINE = (state) => {
  state.isAppOffline = false;
};

export const CLEAR_OFFLINE_INTERVAL = (state) => {
  state.offlineInterval = null;
};

export function SET_INTERVAL (state, data) {
  state.offlineInterval = data;
}
export function SET_REQUESTS (state, data) {
  state.requests = data;
  state.requestsReversed = data.reverse();
  let count = 0;
  if(state.requests && state.requests.length){
    state.requests.map((request) => {
      if(request.status != 'success'){
        count++
      }
    })
    state.totalRequests = count
  }else{
    state.totalRequests = null
  }

}
