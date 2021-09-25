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
              <h3 class="tile-title">Vacunación y desparasitación</h3>
              <SearchOwnersAndPets 
                  @owner-selected="setOwnerSelected"
                  @pet-selected="petOwnerSelected"
                  @searching="setStateFromLoading">
                </SearchOwnersAndPets>
              <div>
                <!--<button :disabled="!ownerSelected || !petSelected || loadingResults" class="btn btn-primary mr-1" @click="loadingResults = true; getVaccinesFromPet()">
                  <i class="fa fa-fw fa-lg fa-search"></i>Consultar <span v-if="loadingResults" class="spinner-border spinner-border-sm ml-1"></span>
                </button>-->
                <button :disabled="!ownerSelected || !petSelected || exportingVaccinesInPdf" class="btn btn-primary mr-1" @click="exportVaccinesInPdf">
                  <i class="fa fa-fw fa-lg fa-print"></i>Exportar <span v-if="exportingVaccinesInPdf" class="spinner-border spinner-border-sm ml-1"></span>
                </button>
                <button :disabled="!ownerSelected || !petSelected || (!vaccinesFromPet.length && !dewormingsFromPet.length) || sendingVaccinesAndDewormingsForEmail" class="btn btn-info" @click="sendVaccinesAndDewormingsForEmail">
                  <i class="fa fa-fw fa-lg fa-envelope"></i>Enviar por email <span v-if="sendingVaccinesAndDewormingsForEmail" class="spinner-border spinner-border-sm ml-1"></span>
                </button>
              </div>              
            </div>
          </div>
      </div>
      <!--Inicio de resultados de vacunas y desparasitaciones-->
      <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="title">Vacunas <span v-if="loadingResults" class="spinner-border spinner-border-sm ml-1 mb-1"></span></h3>
              <CreateVaccineModal v-if="petSelected" :pet_id="petSelected" @vaccineRegistered="loadingResults = true; getVaccinesFromPet()"/>
            </div>
            <div class="table-responsive">
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Vacuna</th>
                    <th nowrap>Fecha de aplicación</th>
                    <th nowrap>Fecha de siguiente vacuna</th>
                    <th>Usuario</th>
                    <th>Folio</th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="vaccineFromPet in vaccinesFromPet" :key="vaccineFromPet.id">
                        <td nowrap>{{ vaccineFromPet.product.name }}</td>
                        <td nowrap>{{ formatDate(vaccineFromPet.clinic_history ? vaccineFromPet.clinic_history.created_at : vaccineFromPet.created_at) }}</td>
                        <td nowrap>{{ formatDate(vaccineFromPet.next_date) }}</td>
                        <td nowrap>{{ vaccineFromPet.clinic_history ? 
                                                            vaccineFromPet.clinic_history.user.identification + ' - ' + 
                                                            vaccineFromPet.clinic_history.user.names + ' ' + 
                                                            vaccineFromPet.clinic_history.user.surnames 
                                                            : 
                                                            vaccineFromPet.user.identification + ' - ' + 
                                                            vaccineFromPet.user.names + ' ' + 
                                                            vaccineFromPet.user.surnames }}
                        </td>
                        <td nowrap>{{ vaccineFromPet.clinic_history ? vaccineFromPet.clinic_history.number_folio : '' }}</td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
         <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="title">Desparasitaciones <span v-if="loadingResults" class="spinner-border spinner-border-sm ml-1 mb-1"></span></h3>
              <CreateDewormingModal v-if="petSelected" :pet_id="petSelected" @dewormingRegistered="loadingResults = true; getVaccinesFromPet()"/>
            </div>
            <div class="table-responsive">
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Desparasitante</th>
                    <th>Dosis</th>
                    <th>Unidad</th>
                    <th nowrap>Fecha de aplicación</th>
                    <th nowrap>Fecha de siguiente desparasitación</th>
                    <th>Usuario</th>
                    <th>Folio</th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="dewormingFromPet in dewormingsFromPet" :key="dewormingFromPet.id">
                        <td nowrap>{{ dewormingFromPet.product.name }}</td>
                        <td nowrap>{{ dewormingFromPet.dose }}</td>
                        <td nowrap>{{ dewormingFromPet.unity.description }}</td>
                        <td nowrap>{{ formatDate(dewormingFromPet.clinic_history ? 
                                                                    dewormingFromPet.clinic_history.created_at
                                                                    :
                                                                    dewormingFromPet.created_at
                                                                    ) }}
                        </td>
                        <td nowrap>{{ formatDate(dewormingFromPet.next_date) }}</td>
                        <td nowrap>{{ dewormingFromPet.clinic_history ?
                                                                dewormingFromPet.clinic_history.user.identification + ' - ' + 
                                                                dewormingFromPet.clinic_history.user.names + ' ' + 
                                                                dewormingFromPet.clinic_history.user.surnames 
                                                                :
                                                                dewormingFromPet.user.identification + ' - ' + 
                                                                dewormingFromPet.user.names + ' ' + 
                                                                dewormingFromPet.user.surnames 
                        }}</td>
                        <td nowrap>{{ dewormingFromPet.clinic_history ? dewormingFromPet.clinic_history.number_folio : '' }}</td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!--Inicio de resultados de vacunas y desparasitaciones-->
    </div>
</template>

<script>
    import SearchOwnersAndPets from './../../_components/SearchOwnersAndPets'
    import CreateVaccineModal from './components/CreateVaccineModal'
    import CreateDewormingModal from './components/CreateDewormingModal'
    import { VueLoading } from 'vue-loading-template'
    import moment from 'moment'
    moment.locale('es')
    export default {
        components: {
          VueLoading, 
          SearchOwnersAndPets,
          CreateVaccineModal,
          CreateDewormingModal
        },
        data() {
            return {
                ownerSelected: false,
                petSelected: '',
                vaccinesFromPet: [],
                dewormingsFromPet: [],
                loadingResults: false,
                exportingVaccinesInPdf: false,
                sendingVaccinesAndDewormingsForEmail: false,
            }
        },
        methods: {
          getVaccinesFromPet () {
            this.$http.get(`reports/vaccine/${ this.petSelected }`).then(response => {
              if (!response.data.vaccines.length && !response.data.dewormings.length) {
                this.$toastr.info('No existen registros de vacunas ni desparasitaciones')
              }
              this.vaccinesFromPet = response.data.vaccines
              this.dewormingsFromPet = response.data.dewormings
              this.loadingResults = false
            }).catch(() => {
              this.loadingResults = false
            })
          },
          exportVaccinesInPdf () {
            this.exportingVaccinesInPdf = true

            this.$http.get(`reports/vaccine/${ this.petSelected }/export-pdf`, { responseType: 'blob'}).then(response => {
              this.exportingVaccinesInPdf = false
                window.open(URL.createObjectURL(response.data), '_blank')
            }).catch( error => {
              this.$toastr.info('Ocurrió un error')
              this.exportingVaccinesInPdf = false
            })
          },
          setOwnerSelected (payload) {
            this.ownerSelected = payload
          },
          petOwnerSelected(payload) {
            this.vaccinesFromPet = []
            this.dewormingsFromPet = []
            this.loadingResults = true
            this.petSelected = payload
            this.getVaccinesFromPet()
          },
          setStateFromLoading (payload) {
            this.vaccinesFromPet = []
            this.dewormingsFromPet = []
            //this.loadingResults = payload
          },
          formatDate (date) {
            return moment(date).format('LLL')
          },
          sendVaccinesAndDewormingsForEmail () {
            this.sendingVaccinesAndDewormingsForEmail = true

            this.$http.get(`reports/vaccine/${ this.petSelected }/send-vaccines-and-dewormings-for-email`).then(response => {
              this.sendingVaccinesAndDewormingsForEmail = false
              this.$toastr.success('Informe enviado con éxito')
            }).catch( error => {
              this.sendingVaccinesAndDewormingsForEmail = false
              if (error.response.status == 422) {
                return this.$toastr.info(error.response.data.message)
              }
              this.$toastr.error('El correo no se pudo enviar')
            })
          },
        }
    }
</script>