##Module Offline
 Module to manage requests and views in Offline Mode
##Required

####Plugins
- axios


##Usage

####Routes and Middleware

In file `src/router/routes` add:
```js
import offline from '@imagina/qoffline/_router/routes' //Routes module
```

####Stores

In file `src/store/index` add:
```js
import offline from '@imagina/qoffline/_store/index'; //Import this file
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    offline //Add offlineStore
  }
});
```

##Components
- widget-offline: component with bottom alert bar and pending requests:

`  import WidgetOffline from "@imagina/qoffline/_components/widget-offline";`

- add to your master layout 

 `<widget-offline></widget-offline>`
 
