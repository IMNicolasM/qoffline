import appConfig from 'src/config/app'
import cache from "@imagina/qsite/_plugins/cache";
import eventBus from '@imagina/qsite/_plugins/eventBus';

export const APP_ONLINE = ({ commit }) => {
    commit('APP_ONLINE');
}
export const APP_OFFLINE = ({ commit }) => {
    commit('APP_OFFLINE');
};
let callToAllLists = false

export const OFFLINE_REQUESTS = ({ commit, dispatch, state }, params = {}) => {
    const interval = setInterval(async() => {
        const requests = await cache.get.item('requests');
        const STATUS = 'pending'

        if (requests && Object.keys(requests).length) {
            const userRequests = requests[params.userId] || []

            const thereAreRequests = userRequests.some(
                requests => requests.status === STATUS
            )
            if (!thereAreRequests && !callToAllLists) {
                callToAllLists = true
            }

            if (thereAreRequests && callToAllLists) {
                callToAllLists = false
            }
            if (userRequests) {
                commit('SET_REQUESTS', userRequests);
            }
        }
    }, 1000);

    commit('SET_INTERVAL', interval);
}

export const REFRESH_OFFLINE = ({ commit, dispatch, state }) => {
    return new Promise(async(resolve, reject) => {

        dispatch("SUB_MODULES_REFRESH_OFFLINE")

        let interval = setInterval(async() => {
            let refreshOffline = await cache.get.item("refreshOffline")
            if (refreshOffline) {
                dispatch("SUB_MODULES_REFRESH_OFFLINE", true)
                cache.set("refreshOffline", false)
                eventBus.$emit('page.data.refresh')
                eventBus.$emit('crud.data.refresh')
                eventBus.$emit('export.data.refresh')
            }
        }, 1000);

    })
}

export const SUB_MODULES_REFRESH_OFFLINE = ({ commit, dispatch, state }, refresh = false) => {
    appConfig.modules.forEach(moduleName => {
        let offlineConfig = false

        //Search module in node_modules
        try {
            offlineConfig = require(`@imagina/${moduleName}/_config/offline`)
        } catch (e) {}

        //Search module in project (src)
        try {
            offlineConfig = require(`src/modules/${moduleName}/_config/offline`)
        } catch (e) {}

        offlineConfig ? offlineConfig.default(refresh) : {}

    });
};