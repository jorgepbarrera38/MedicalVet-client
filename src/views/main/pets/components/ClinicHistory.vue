<template>
    <div class="tile">
        <div class="tile-title-w-btn">
            <h3 class="tile-title"><i class="fa fa-file-text"></i> Historia clínica</h3>
            <button class="btn btn-primary btn-sm" @click="exportClinicHistoryInPdf" :disabled="exportingClinicHistoryInPdf">
                <span class="spinner-border spinner-border-sm ml-1" v-if="exportingClinicHistoryInPdf"></span>
                <i class="fa fa-fw fa-lg fa fa-print" v-else></i> Exportar
            </button>
        </div>
        <!---->

        <div class="table-responsive" style="max-height: 220px;">
            <table class="table table-sm table-hover">
                <thead>
                    <th nowrap>
                      <button class="btn btn-default btn-sm" @click="selectAllFolios">
                        T
                      </button>
                      <button class="btn btn-default btn-sm" @click="unSelectAllFolios">
                        N
                      </button>
                    </th>
                    <th>Fecha</th>
                    <th>Finalidad de consulta</th>
                </thead>
                <tbody>
                <tr v-for="clinicHistory in clinicHistories" :key="'clinicHistoryFromPet' + clinicHistory.id">
                    <td nowrap><input type="checkbox" :value="clinicHistory" v-model="foliosSelectedToExport"> Folio {{ clinicHistory.number_folio }}</td>  
                    <td nowrap>{{ formatDate(clinicHistory.created_at) }}</td>
                    <td nowrap>{{ clinicHistory.consultation_purposes.name }}</td>
                </tr>
                </tbody>
            </table>
        </div>

        <!---->
        
    </div>
</template>
<script>
import moment from 'moment'
moment.locale('es')
    export default {
        props: [ 'pet_id', 'clinicHistories' ],
        data() {
            return {
              foliosSelectedToExport: [],
              exportingClinicHistoryInPdf: false,
            }
        },
        methods: {
            formatDate (date) {
            //return date;
            return moment(date).format('DD-MMM-Y, h:mm a')
          },
          selectAllFolios () {
            this.foliosSelectedToExport = this.clinicHistories
          },
          unSelectAllFolios () {
            this.foliosSelectedToExport = []
          },
          exportClinicHistoryInPdf () {
            if (this.foliosSelectedToExport.length == 0) return this.$toastr.info('Seleccione los folios que desea exportar')
            
            this.exportingClinicHistoryInPdf = true
            let folios = this.foliosSelectedToExport.map(folio => {
              return folio.number_folio
            })
            this.$http.get(`reports/clinic-history/${ this.pet_id }`, { responseType: 'blob', params: { folios }}).then(response => {
              window.open(URL.createObjectURL(response.data), '_blank')
              this.exportingClinicHistoryInPdf = false
            }).catch( error => {
              this.exportingClinicHistoryInPdf = false
              if (error.response.status == 422) {
                this.$toastr.info('La mascota no tiene registros de historia clínica')
              }
            })
          }
        }
    }
</script>