<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-file-text"></i> Historia clínica</h1>
            </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="tile">
              <h3 class="tile-title">Recetas veterinarias</h3>
              <SearchOwnersAndPets 
                  @owner-and-pet-selected="ownerAndPetSelected">
                </SearchOwnersAndPets>
              <div>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="">Receta</label>
                      <select class="form-control" v-model="prescriptionSelected">
                        <option value="">Seleccione receta veterinaria</option>
                        <option :value="prescription.id" v-for="prescription in prescriptionsFromPet" :key="`presc-${ prescription.id }`">
                          Id: {{ prescription.id }} Folio: {{ prescription.clinic_history.number_folio }} - Fecha: {{ formatDate(prescription.clinic_history.created_at) }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <button :disabled="!petSelectedId || !prescriptionSelected || exportingPrescriptionInPdf || loadingResults" class="btn btn-primary btn-sm mr-1" @click="exportPrescriptionInPdf">
                  <i class="fa fa-fw fa-lg fa-print"></i>Exportar <span v-if="exportingPrescriptionInPdf" class="spinner-border spinner-border-sm ml-1"></span>
                </button>
                <button :disabled="!petSelectedId || !prescriptionSelected || sendingPrescriptionForEmail || loadingResults" class="btn btn-primary btn-sm" @click="sendPrescriptionFromPetForEmail">
                  <i class="fa fa-fw fa-lg fa-envelope"></i>Enviar por email <span v-if="sendingPrescriptionForEmail" class="spinner-border spinner-border-sm ml-1"></span>
                </button>
              </div>              
            </div>
          </div>
      </div>
      <!--Inicio de resultados de vacunas y desparasitaciones-->
      <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Información de la receta <span v-if="loadingResults" class="spinner-border spinner-border-sm ml-1 mb-1"></span></h3>
            <div class="table-responsive">
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Posología</th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="prescriptionFromPetDetail in prescriptionFromPet.clinic_history_prescription_details" 
                      :key="`prescriptionFromPet-${prescriptionFromPetDetail.id}`">
                        <td>{{ prescriptionFromPetDetail.product.name }}</td>
                        <td>{{ prescriptionFromPetDetail.quantity }}</td>
                        <td class="text-justify">{{ prescriptionFromPetDetail.posology }}</td>
                    </tr>
                </tbody>
              </table>
            </div>
            <p class="text-justify">
              <strong>Observaciónes:</strong>
              {{ prescriptionFromPet.observations }}
            </p>
          </div>
        </div>
      </div>
      <!--Inicio de resultados de vacunas y desparasitaciones-->
    </div>
</template>

<script>
    import SearchOwnersAndPets from './../_components/SearchOwnersAndPets'
    import { VueLoading } from 'vue-loading-template'
    import moment from 'moment'
    moment.locale('es')
    export default {
        name: 'reports.prescription',
        components: {
          VueLoading, 
          SearchOwnersAndPets
        },
        data() {
            return {
                petSelectedId: '',
                prescriptionsFromPet: [],
                prescriptionSelected: '',
                prescriptionFromPet: {
                  clinic_history_prescription_details: []
                },

                vaccinesFromPet: [],
                dewormingsFromPet: [],
                loadingResults: false,
                exportingPrescriptionInPdf: false,
                sendingPrescriptionForEmail: false,
            }
        },
        methods: {
          getPrescriptionsFromPet () {
            this.$http.get(`reports/prescriptions/${ this.petSelectedId }/get-prescriptions-from-pet`).then(response => {
              this.prescriptionsFromPet = response.data
            })
          },
          getPrescriptionFromPet () {
            this.loadingResults = true
            this.prescriptionFromPet = {
              clinic_history_prescription_details: []
            }

            this.$http.get(`reports/prescriptions/${ this.prescriptionSelected }/get-prescription-from-pet`).then(response => {
              this.loadingResults = false
              this.prescriptionFromPet = response.data             
            }).catch( error => {
              this.loadingResults = false
            })
          },
          exportPrescriptionInPdf () {
            this.exportingPrescriptionInPdf = true

            this.$http.get(`reports/prescriptions/${ this.prescriptionSelected }/export-prescription-in-pdf`, { responseType: 'blob'}).then(response => {
              this.exportingPrescriptionInPdf = false
                window.open(URL.createObjectURL(response.data), '_blank')
            }).catch( error => {
              this.$toastr.info('Ocurrió un error')
              this.exportingPrescriptionInPdf = false
            })
          },
          ownerAndPetSelected(petId) {
            this.petSelectedId = petId
            this.prescriptionsFromPet = []
            this.prescriptionSelected = ''
            this.prescriptionFromPet = {
                clinic_history_prescription_details: []
              }
            if (this.petSelectedId) {
              this.getPrescriptionsFromPet()
            }
          },
          formatDate (date) {
            return moment(date).format('LLL')
          },
          sendPrescriptionFromPetForEmail () {
            if (this.$limitedVersion) {
              return this.$toastr.error('Esta funcionalidad no está disponible en la versión limitada')
            }
            
            if (!this.prescriptionSelected) {
              return this.$toastr.error('Seleccione receta veterinaria')
            }

            this.sendingPrescriptionForEmail = true

            this.$http.get(`reports/prescriptions/${ this.prescriptionSelected }/send-prescription-from-pet-for-email`).then(response => {
              this.sendingPrescriptionForEmail = false
              this.$toastr.success('Receta veterinaria enviada con éxito')
            }).catch( error => {
              this.sendingPrescriptionForEmail = false
              if (error.response.status == 422) {
                return this.$toastr.info(error.response.data.message)
              }
              this.$toastr.error('El correo no se pudo enviar')
            })
          },
        },
        watch: {
          prescriptionSelected (prescriptionSelectedId) {
            if (prescriptionSelectedId) {
              this.getPrescriptionFromPet()
            }
          }
        }
    }
</script>