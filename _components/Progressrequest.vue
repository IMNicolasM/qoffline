<template>
    <div id="progress-request">
        <master-modal v-model="modal.show" :title="modal.title">
            <p>Quantity Roles: {{ getQuantityRoles }}</p>
            <p>Quantity Requests: {{ getQuantityRequests }}</p>
            <q-linear-progress size="30px" :value="progressRequestsCompleted" color="primary" class="q-mt-sm">
                <div class="absolute-full flex flex-center">
                    <q-badge color="white" text-color="primary" :label="progressLabel" />
                </div>
            </q-linear-progress>
        </master-modal>
    </div>
</template>

<script>

export default {
    name: "Progressrequest",
    props: {},
    components: {},
    watch: {},
    data() {
        return {
            modal: {
                show: false,
                title: "Sync Offline Requests"
            },
            sessionData: {},
            progressRequestsCompleted: 0,
            progressLabel: '0.00%',
            interval: null,
            offlineSetting: this.$store.getters['qsiteApp/getSettingValueByName']('isite::offline')
        }
    },
    computed: {
        getQuantityRoles() {
            return this.sessionData?.userData?.roles?.length || 0;
        },
        getQuantityRequests() {
            let countRequests = 0;
            this.sessionData?.userData?.roles.forEach(role => {
                if (role.options && role.options.offlineRequests) {
                    countRequests += role.options.offlineRequests.length
                }
            });
            return countRequests === 0 ? countRequests : countRequests - 1;
        },
    },
    methods: {
        executeOfflineRequests() {
            const initialRequests = this.getQuantityRequests;
            if (initialRequests === 0) {
                this.progressLabel = '100.00%';
            } else {
                const percentageByRequest = (1 * 100) / (initialRequests);
                let quantityPercentage = 0;
                this.sessionData.userData.roles.forEach(role => {
                    role.options.offlineRequests.forEach((offlineReq) => {
                        this.$crud.index(offlineReq.apiRoute, { params: { ...offlineReq.requestParams } }).then(response => {
                            quantityPercentage += percentageByRequest;
                            this.progressRequestsCompleted = Number(`0.${parseInt(quantityPercentage)}`);
                            this.progressLabel = `${quantityPercentage.toFixed(2)}%`;
                            console.log(this.progressRequestsCompleted)
                            if (this.progressRequestsCompleted === 0.1) {
                                this.modal.show = false;
                                this.progressRequestsCompleted = 0;
                                this.progressLabel = '00.00%';
                            }
                        });
                    });
                })
            }
        },
        deletePreviousCacheByRequest() {
            this.sessionData.userData.roles.forEach(role => {
                role.options.offlineRequests.forEach(offlineReq => {
                    this.$cache.keys().then((response) => {
                        response.forEach((key) => {
                            if (key.includes(offlineReq.apiRoute)) {
                                this.$cache.remove(key);
                            }
                        });
                    })
                });
            });
        },
        async checkTimeToSync() {
            const timeStamp = new Date().getTime();
            const lastSync = await this.$cache.get.item("lastOfflineSync");
            if ((timeStamp >= lastSync && this.offlineSetting == 1) || !lastSync) {
                if (!lastSync) {
                    this.syncOffline();
                } else {
                    this.syncOffline(true)
                }
            }
        },
        async syncOffline(deletePreviousCache = false) {
            this.modal.show = true;
            if (deletePreviousCache) {
                await this.deletePreviousCacheByRequest();
            }
            setTimeout(() => {
                this.executeOfflineRequests();
                const timeStamp = new Date().getTime();
                const fiveHoursMiliseconds = 18000000;
                this.$cache.set("lastOfflineSync", timeStamp + fiveHoursMiliseconds);
            }, 2000)
        }
    },
    beforeDestroy() {
        this.$eventBus.$off('offlineSync');
    },
    mounted() {
        this.$nextTick(async () => {
            clearInterval(this.interval);
            this.interval = setInterval(() => this.checkTimeToSync(), 500000);
            this.$eventBus.$on('offlineSync', async () => {
                if (this.offlineSetting == 1) {
                    this.syncOffline(true);
                }
            })
            if (this.offlineSetting == 1) {
                this.sessionData = await this.$cache.get.item('sessionData');
                this.checkTimeToSync();
            }
        });
    },
}
</script>