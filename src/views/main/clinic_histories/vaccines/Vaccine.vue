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
                  @searching="setStateFromLoading"
                  :loadingResults="loadingResults">
                </SearchOwnersAndPets>
              <div>
                <!--<button :disabled="!ownerSelected || !petSelected || loadingResults" class="btn btn-primary mr-1" @click="loadingResults = true; getVaccinesFromPet()">
                  <i class="fa fa-fw fa-lg fa-search"></i>Consultar <span v-if="loadingResults" class="spinner-border spinner-border-sm ml-1"></span>
                </button>-->
                <button :disabled="!ownerSelected || !petSelected || exportingVaccinesInPdf" class="btn btn-primary mr-1" @click="exportVaccinesInPdf">
                  <i class="fa fa-fw fa-lg fa-print"></i>Exportar <span v-if="exportingVaccinesInPdf" class="spinner-border spinner-border-sm ml-1"></span>
                </button>
                <button :disabled="!ownerSelected || !petSelected || (!vaccinesFromPet.length && !dewormingsFromPet.length) || sendingVaccinesAndDewormingsForEmail" 
                                    class="btn btn-info" @click="sendVaccinesAndDewormingsForEmail">
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="(vaccineFromPet, index) in vaccinesFromPet" :key="vaccineFromPet.id">
                        <td nowrap>
                          <v-select :options="allVaccines" v-if="vaccineFromPet.showFormForEdit" label="name" :reduce="vaccine => vaccine.id" v-model="vaccineFromPet.product_id_copy"></v-select>
                          <span v-else>{{ vaccineFromPet.product.name }}</span>
                        </td>
                        <td nowrap>
                          {{ formatDate(vaccineFromPet.clinic_history ? vaccineFromPet.clinic_history.created_at : vaccineFromPet.created_at) }}
                        </td>
                        <td nowrap>
                          <input type="date" v-if="vaccineFromPet.showFormForEdit" v-model="vaccineFromPet.next_date_copy" class="form-control">
                          <span v-else>{{ formatDate(vaccineFromPet.next_date) }}</span>
                        </td>
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
                        <td nowrap>
                          <div v-if="vaccineFromPet.showFormForEdit">
                            <button class="btn btn-primary btn-sm mr-1" @click="updateVaccine(vaccineFromPet)" :disabled="vaccineFromPet.updating">
                              <span v-if="vaccineFromPet.updating" class="spinner-border spinner-border-sm"></span>
                              <i class="fa fa-save" v-else></i>
                            </button>
                            <button class="btn btn-danger btn-sm" @click="cancelEditingVaccine(vaccineFromPet)" :disabled="vaccineFromPet.updating">
                              <i class="fa fa-times-circle"></i>
                            </button>
                          </div>
                          <div v-else>
                            <button class="btn btn-warning btn-sm mr-1" @click="vaccineFromPet.showFormForEdit = true" :disabled="vaccineFromPet.updating">
                              <span v-if="vaccineFromPet.updating" class="spinner-border spinner-border-sm"></span>
                              <i class="fa fa-edit" v-else></i>
                            </button>
                            <button class="btn btn-danger btn-sm" @click="deleteVaccine(vaccineFromPet, index)" :disabled="vaccineFromPet.deleting">
                              <span v-if="vaccineFromPet.deleting" class="spinner-border spinner-border-sm"></span>
                              <i class="fa fa-trash" v-else></i>
                            </button>
                          </div>
                        </td>
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
                    <th nowrap>Fecha de aplicación</th>
                    <th nowrap>Fecha de siguiente desparasitación</th>
                    <th>Usuario</th>
                    <th>Folio</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="(dewormingFromPet, index) in dewormingsFromPet" :key="dewormingFromPet.id">
                        <td nowrap>
                          <v-select :options="allDewormings" v-if="dewormingFromPet.showFormForEdit" label="name" :reduce="deworming => deworming.id" v-model="dewormingFromPet.product_id_copy"></v-select>
                          <span v-else>{{ dewormingFromPet.product.name }}</span>
                        </td>
                        <td nowrap>{{ formatDate(dewormingFromPet.clinic_history ? 
                                                                    dewormingFromPet.clinic_history.created_at
                                                                    :
                                                                    dewormingFromPet.created_at
                                                                    ) }}
                        </td>
                        <td nowrap>
                          <input type="date" v-if="dewormingFromPet.showFormForEdit" v-model="dewormingFromPet.next_date_copy" class="form-control">
                          <span v-else>{{ formatDate(dewormingFromPet.next_date) }}</span>
                        </td>
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
                        <td nowrap>
                          <div v-if="dewormingFromPet.showFormForEdit">
                            <button class="btn btn-primary btn-sm mr-1" @click="updateDeworming(dewormingFromPet)" :disabled="dewormingFromPet.updating">
                              <span v-if="dewormingFromPet.updating" class="spinner-border spinner-border-sm"></span>
                              <i class="fa fa-save" v-else></i>
                            </button>
                            <button class="btn btn-danger btn-sm" @click="cancelEditingDeworming(dewormingFromPet)" :disabled="dewormingFromPet.updating">
                              <i class="fa fa-times-circle"></i>
                            </button>
                          </div>
                          <div v-else>
                            <button class="btn btn-warning btn-sm mr-1" @click="dewormingFromPet.showFormForEdit = true" :disabled="dewormingFromPet.updating">
                              <span v-if="dewormingFromPet.updating" class="spinner-border spinner-border-sm"></span>
                              <i class="fa fa-edit" v-else></i>
                            </button>
                            <button class="btn btn-danger btn-sm" @click="deleteDeworming(dewormingFromPet, index)" :disabled="dewormingFromPet.deleting">
                              <span v-if="dewormingFromPet.deleting" class="spinner-border spinner-border-sm"></span>
                              <i class="fa fa-trash" v-else></i>
                            </button>
                          </div>
                        </td>
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
                allVaccines: [],
                allDewormings: [],
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
              this.vaccinesFromPet.forEach(vaccine => {
                  this.$set(vaccine, 'deleting', false)
                  this.$set(vaccine, 'showFormForEdit', false)
                  this.$set(vaccine, 'updating', false)

                  this.$set(vaccine, 'next_date_copy', vaccine.next_date)
                  this.$set(vaccine, 'product_id_copy', vaccine.product.id)
                  this.$set(vaccine, 'product_name_copy', vaccine.product.name)
                  
              })
              this.dewormingsFromPet = response.data.dewormings
              this.dewormingsFromPet.forEach(deworming => {
                  this.$set(deworming, 'deleting', false)
                  this.$set(deworming, 'showFormForEdit', false)
                  this.$set(deworming, 'updating', false)

                  this.$set(deworming, 'next_date_copy', deworming.next_date)
                  this.$set(deworming, 'product_id_copy', deworming.product.id)
                  this.$set(deworming, 'product_name_copy', deworming.product.name)
              })

              this.allVaccines = response.data.allVaccines
              this.allDewormings = response.data.allDewormings

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
            this.petSelected = ''
            if (payload) {
              this.loadingResults = true
              this.petSelected = payload
              this.getVaccinesFromPet()
            }
          },
          setStateFromLoading (payload) {
            this.vaccinesFromPet = []
            this.dewormingsFromPet = []
            //this.loadingResults = payload
          },
          deleteVaccine (vaccine, index) {
            vaccine.deleting = true
            this.$http.delete(`vaccines/${ vaccine.id }`).then( response => {
              this.vaccinesFromPet.splice(index, 1)
              this.getVaccinesFromPet()
              this.$toastr.success('Vacuna eliminada con éxito')
            }).catch( () => {
              vaccine.deleting = false
            })
          },
          deleteDeworming (deworming, index) {
            deworming.deleting = true
            this.$http.delete(`dewormings/${ deworming.id }`).then( response => {
              this.dewormingsFromPet.splice(index, 1)
              this.getVaccinesFromPet()
              this.$toastr.success('Desparasitante eliminado con éxito')
            }).catch( () => {
              deworming.deleting = false
            })
          },
          formatDate (date) {
            return moment(date).format('LLL')
          },
          sendVaccinesAndDewormingsForEmail () {
            if (this.$limitedVersion) {
              return this.$toastr.error('Esta funcionalidad no está disponible en la versión limitada')
            }

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
          cancelEditingVaccine (vaccineFromPet) {
            vaccineFromPet.showFormForEdit = false
            vaccineFromPet.next_date_copy = vaccineFromPet.next_date
            vaccineFromPet.product_id_copy = vaccineFromPet.product.id
            vaccineFromPet.product_name_copy = vaccineFromPet.product.name
          },
          updateVaccine (vaccineFromPet) {
            vaccineFromPet.updating = true
            let data = {
              product_id: vaccineFromPet.product_id_copy,
              next_date: vaccineFromPet.next_date_copy,
            }

            this.$http.put(`vaccines/${ vaccineFromPet.id }`, data).then( response => {
              vaccineFromPet.next_date = vaccineFromPet.next_date_copy
              vaccineFromPet.product.id = vaccineFromPet.product_id_copy
              vaccineFromPet.product.name = this.allVaccines.find(vaccine => vaccine.id == vaccineFromPet.product_id_copy).name
              vaccineFromPet.updating = false
              vaccineFromPet.showFormForEdit = false
              this.$toastr.success('Vacunación actualizada')
            }).catch( () => {
              vaccineFromPet.updating = false
            })
          },
          cancelEditingDeworming (dewormingFromPet) {
            dewormingFromPet.showFormForEdit = false
            dewormingFromPet.next_date_copy = dewormingFromPet.next_date
            dewormingFromPet.product_id_copy = dewormingFromPet.product.id
            dewormingFromPet.product_name_copy = dewormingFromPet.product.name
          },
          updateDeworming (dewormingFromPet) {
            dewormingFromPet.updating = true
            let data = {
              product_id: dewormingFromPet.product_id_copy,
              next_date: dewormingFromPet.next_date_copy,
            }

            this.$http.put(`dewormings/${ dewormingFromPet.id }`, data).then( response => {
              dewormingFromPet.next_date = dewormingFromPet.next_date_copy
              dewormingFromPet.product.id = dewormingFromPet.product_id_copy
              dewormingFromPet.product.name = this.allDewormings.find(deworming => deworming.id == dewormingFromPet.product_id_copy).name

              dewormingFromPet.updating = false
              dewormingFromPet.showFormForEdit = false
              this.$toastr.success('Desparasitación actualizada')
            }).catch( () => {
              dewormingFromPet.updating = false
            })
          },
        }
    }
</script>