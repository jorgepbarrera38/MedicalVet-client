<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-list-ul"></i> Reportes</h1>
            </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="tile">
              <h3 class="tile-title">Informe de servicios prestados</h3>
                <form @submit.prevent="getServicesProvided">
                    <div class="form-group">
                        <label for="">Fecha inicio</label>
                        <input type="date" class="form-control" v-model="rangeDates.startDate">
                    </div>
                    <div class="form-group">
                        <label for="">Fecha fin</label>
                        <input type="date" class="form-control" v-model="rangeDates.endDate">
                    </div>
                    <div>
                        <button type="submit" :disabled="!rangeDates.startDate || !rangeDates.startDate || loadingResults" class="btn btn-primary btn-sm mb-1">
                        <i class="fa fa-fw fa-lg fa-search"></i>Consultar
                        </button>
                    </div>              
                </form>
            </div>
            <vue-loading v-if="loadingResults" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
          </div>
          <div class="col-md-8">
              <div class="tile">
                <div class="tile-title-w-btn">
                    <h3 class="tile-title">Resultados</h3>
                    <button :disabled="!services.length || downloadingReport"
                        @click="exportConsultationsInExcel"
                        class="btn btn-success btn-sm">
                        <i class="fa fa-fw fa-lg fa-file-excel-o"></i>Exportar
                        <span v-if="downloadingReport" class="spinner-border spinner-border-sm"></span>
                    </button>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover table-sm">
                        <thead>
                            <th>Fecha</th>
                            <th>Servicio</th>
                            <th>Cantidad</th>
                            <th>Propietario</th>
                            <th>Mascota</th>
                            <th>Folio</th>
                        </thead>
                        <tbody>
                            <tr v-for="service in services" :key="service.id">
                                <td>{{ formatDate(service.created_at) }}</td>
                                <td>{{ service.service.name }}</td>
                                <td>{{ service.quantity }}</td>
                                <td>{{ service.clinic_history.pet.owner.identification + ' - ' + service.clinic_history.pet.owner.names + ' - ' + service.clinic_history.pet.owner.surnames }}</td>
                                <td>{{ service.clinic_history.pet.name }}</td>
                                <td>{{ service.clinic_history.number_folio }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
              </div>
          </div>
      </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    import moment from 'moment'
    moment.locale('es')
    import download from 'downloadjs'
    export default {
        components: {
          VueLoading
        },
        data() {
            return {
                rangeDates: {
                    startDate: '',
                    endDate: '',
                },
                services: [],
                loadingResults: false,
                downloadingReport: false,
            }
        },
        methods: {
          getServicesProvided () {
            this.loadingResults = true
            this.services = []
            this.$http.get(`reports/get-services-provided?startDate=${ this.rangeDates.startDate }&endDate=${ this.rangeDates.endDate }`).then(response => {
                this.services = response.data
                this.loadingResults = false
            }).catch( error => {
              this.loadingResults = false
              if (error.response.status == 422) {
                this.$toastr.info(error.response.data.message)
              }
            })
          },
          exportConsultationsInExcel () {
            this.downloadingReport = true
            this.$http.get(`reports/export-services-in-excel?startDate=${ this.rangeDates.startDate }
                            &endDate=${ this.rangeDates.endDate }`, { responseType: 'blob' }).then(response => {
                download(response.data, 'Informe de servicios prestados.xlsx')
                this.downloadingReport = false
            }).catch( () => {
                this.downloadingReport = false
            })
          },
          formatDate (date) {
            return moment(date).format('LLL')
          },
        },
    }
</script>
