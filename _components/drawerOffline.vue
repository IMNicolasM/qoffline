<template>
  <div id="drawerOffline" class="q-pa-md">
    <!-- ===== Header ===== -->
    <div class="row justify-between items-center">
      <div class="text-subtitle1 row items-center">
        <q-icon name="fas fa-cog" color="primary" size="20px" class="q-mr-sm" />
        <label>{{ $tr('isite.cms.label.offlineRequests', { capitalize: true }) }}</label>
      </div>
      <!-- Close icon -->
      <q-icon name="fas fa-times" color="blue-grey" size="20px" class="cursor-pointer"
        @click="$eventBus.$emit('toggleMasterDrawer', 'offline')" />
    </div>
    <!--Separator-->
    <q-separator class="q-my-md" />
    <q-list>
      <div v-for="request in this.$store.state.qofflineMaster.requestsReversed" :key="request._id">
        <q-item class="q-py-xs">
          <q-item-section>
            <q-item-label>{{ getTitle(request)}}</q-item-label>
            <q-item-label caption lines="2">{{ translateRequestMethod(request.method) }}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-icon v-if="request.status == 'failed'" name="fa-light fa-xmark" color="negative" />
            <q-icon v-if="request.status == 'success'" name="fa-light fa-check" color="positive" />
            <q-icon v-if="request.status == 'pending'" name="fa-light fa-spinner-third fa-spin" color="warning" />
            <q-item-label caption>{{ translateRequestStatus(request.status) }}</q-item-label>
            <q-item-label caption>{{ $moment(request.createdAt).fromNow() }}</q-item-label>
          </q-item-section>

        </q-item>
        <q-separator class="q-my-xs" spaced inset />
      </div>
    </q-list>
  </div>
</template>

<script>
export default {
  name: "drawerOffline",
  props: {},
  components: {},
  watch: {},

  beforeDestroy() {
    this.$eventBus.$off('header.badge.manage');
  },
  mounted() {
    this.$nextTick(async () => {
      this.$store.dispatch('qofflineMaster/OFFLINE_REQUESTS', { userId: this.$store.state.quserAuth.userId });
      await config('main').qramp.offline(true)
    });
  },
  data() {
    return {
      refreshIntervalId: null,
    }
  },
  methods: {
    getTitle(request){
      const bodyParse = JSON.parse(request.body);
      return bodyParse?.attributes?.title_offline || request.titleOffline;

    },
    translateRequestStatus(status) {
      switch (status) {
        case 'pending': return "Pending";
        case 'success': return "Success";
        case 'failed': return "Failed";
      }
    },
    translateRequestMethod(method) {
      switch (method) {
        case 'post': return "Create";
        case 'put': return "Update";
        case 'delete': return "Delete";
      }
    },
  },
}
</script>