<template></template>

<script>
export default {
  name: "Alert",
  beforeDestroy() {
    window.removeEventListener("online", this.connectionSwitch);
    window.removeEventListener("offline", this.connectionSwitch);
  },
  mounted() {
    window.addEventListener("online", this.connectionSwitch);
    window.addEventListener("offline", this.connectionSwitch);
    this.connectionSwitch();
  },
  methods: {
    connectionSwitch() {
      if (navigator.onLine) {
        this.$store.dispatch("qofflineMaster/APP_ONLINE")
      } else {
        this.$store.dispatch("qofflineMaster/APP_OFFLINE")
      }
    },
  }
}
</script>

<style></style>