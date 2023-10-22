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
              <h3 class="tile-title">Informe de atenciónes</h3>
                <form @submit.prevent="getConsultations">
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
                    <button :disabled="!clinicHistories.length || downloadingReport"
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
                            <th>Finalidad de consulta</th>
                            <th>Usuario</th>
                            <th>Propietario</th>
                            <th>Mascota</th>
                        </thead>
                        <tbody>
                            <tr v-for="clinicHistory in clinicHistories" :key="clinicHistory.id">
                                <td>{{ formatDate(clinicHistory.created_at) }}</td>
                                <td>{{ clinicHistory.consultation_purposes.name }}</td>
                                <td>{{ clinicHistory.user.identification + ' - ' + clinicHistory.user.names + ' - ' + clinicHistory.user.surnames }}</td>
                                <td>{{ clinicHistory.pet.owner.identification + ' - ' + clinicHistory.pet.owner.names + ' - ' + clinicHistory.pet.owner.surnames }}</td>
                                <td>{{ clinicHistory.pet.name }}</td>
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
                clinicHistories: [],
                loadingResults: false,
                downloadingReport: false,
            }
        },
        methods: {
          getConsultations () {
            this.loadingResults = true
            this.clinicHistories = []
            this.$http.get(`reports/get-consultations?startDate=${ this.rangeDates.startDate }&endDate=${ this.rangeDates.endDate }`).then(response => {
                this.clinicHistories = response.data
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
            this.$http.get(`reports/export-consultations-in-excel?startDate=${ this.rangeDates.startDate }
                            &endDate=${ this.rangeDates.endDate }`, { responseType: 'blob' }).then(response => {
                download(response.data, 'Informe de atenciónes.xlsx')
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
