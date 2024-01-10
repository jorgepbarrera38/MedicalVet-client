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
                          Id: {{ prescription.id }} Folio: {{ prescription.clinic_history ? prescription.clinic_history.number_folio : '' }} - Fecha: {{ formatDate(prescription.created_at) }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <button :disabled="!petSelectedId || !prescriptionSelected || exportingPrescriptionInPdf || loadingResults" class="btn btn-primary btn-sm mr-1" @click="exportPrescriptionInPdf">
                  <i class="fa fa-fw fa-lg fa-print"></i>Exportar <span v-if="exportingPrescriptionInPdf" class="spinner-border spinner-border-sm ml-1"></span>
                </button>
                <button :disabled="!petSelectedId || !prescriptionSelected || sendingPrescriptionForEmail || loadingResults" class="btn btn-primary btn-sm mr-1" @click="sendPrescriptionFromPetForEmail">
                  <i class="fa fa-fw fa-lg fa-envelope"></i>Enviar por email <span v-if="sendingPrescriptionForEmail" class="spinner-border spinner-border-sm ml-1"></span>
                </button>
                <button :disabled="!petSelectedId || loadingResults" class="btn btn-success btn-sm" @click="openModalToAddPrescription">
                  <i class="fa fa-fw fa-lg fa-plus"></i> Nuevo 
                </button>
                <!--inicio modal buscar propietarios-->
                <div class="modal fade" id="addPrescriptionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Registra receta veterinaria</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        
                        <div class="row">
                          <div class="col-md-12">
                            <div class="alert alert-danger" v-if="errors">
                              <li v-for="(error, index) in errors" :key="index">
                                {{ error[0] }}
                              </li>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-4">
                            <div class="form-group">
                              <label for="">Producto (*)</label>
                              <v-select :options="products" label="name" v-model="productToAddToPrescription.product"></v-select>
                            </div>
                            <div class="form-group">
                              <label for="">Cantidad (*)</label>
                              <input type="number" class="form-control" v-model="productToAddToPrescription.quantity">
                            </div>
                            <div class="form-group">
                              <label for="">Posología (*)</label>
                              <textarea rows="4" class="form-control" v-model="productToAddToPrescription.posology" maxlength="500"></textarea>
                            </div>
                            <div class="form-group">
                              <button class="btn btn-primary btn-sm" @click="addProductToPrescription"><i class="fa fa-plus"></i> Agregar</button>
                            </div>
                          </div>
                          <div class="col-md-8">
                            <div class="table-responsive" style="min-height:300px;max-height:300px;overflow:auto">
                              <table class="table table-hover table-sm">
                                <thead>
                                  <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Posología</th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="(product, index) in newPrescription.products" :key="'productsFromPrescription-' + index">
                                    <td>{{ product.product_name }}</td>
                                    <td nowrap>{{ product.quantity }}</td>
                                    <td>{{ product.posology }}</td>
                                    
                                    <td nowrap>
                                      <button class="btn btn-danger btn-sm" @click="deleteProductFromPrescription(index)">
                                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div class="col-md-12">
                            <div class="form-group">
                              <label for="">Observaciónes</label>
                              <textarea rows="4" class="form-control" v-model="newPrescription.observations" maxlength="800"></textarea>                                                    
                            </div>
                          </div>
                        </div>
                        
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary btn-sm mr-1" @click="savePrescription" :disabled="savingPrescription">
                          <i  class="fa fa-fw fa-lg fa fa-save"></i> Guardar <span v-if="savingPrescription" class="spinner-border spinner-border-sm ml-1"></span>
                      </button>
                        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
                      </div>
                    </div>
                  </div>
                </div>
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
    import moment, { relativeTimeThreshold } from 'moment'
    moment.locale('es')
    export default {
        name: 'reports.prescription',
        components: {
          VueLoading, 
          SearchOwnersAndPets
        },
        created () {
          this.getProducts()
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

                productToAddToPrescription: {
                  product: {},
                  quantity: '',
                  posology: '',
                },
                products: [],
                newPrescription: {
                  products: [],
                  observations: '',
                },
                savingPrescription: false,
                errors: null
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
          openModalToAddPrescription () {
            $('#addPrescriptionModal').modal('show')
          },
          addProductToPrescription () {
            if (!this.productToAddToPrescription.product || !Object.keys(this.productToAddToPrescription.product).length) {
              return this.$toastr.error('Seleccione el producto')
            }

            if (!this.productToAddToPrescription.quantity) {
              return this.$toastr.error('Digite la cantidad')
            }

            if (this.productToAddToPrescription.quantity < 1 || this.productToAddToPrescription.quantity > 500 ) {
              return this.$toastr.error('La cantidad debe estar en 1 y 500')
            }

            if (!this.productToAddToPrescription.posology) {
              return this.$toastr.error('Diligencie la posología')
            }

            let data = { 
                  product_id: this.productToAddToPrescription.product.id,
                  product_name: this.productToAddToPrescription.product.name,
                  quantity: this.productToAddToPrescription.quantity,
                  posology: this.productToAddToPrescription.posology,
            }

            this.newPrescription.products.push(data)
            this.productToAddToPrescription = {
                  product: {},
                  quantity: '',
                  posology: ''
            }
          },
          deleteProductFromPrescription (index) {
            this.newPrescription.products.splice(index, 1)
          },
          getProducts () {
            this.$http.get('prescriptions/get-products').then( response => {
              
              this.products = response.data

            })
          },
          savePrescription () {
            this.savingPrescription = true
            
            this.$http.post(`prescriptions/${this.petSelectedId}`, {...this.newPrescription} ).then( response => {
              this.getPrescriptionsFromPet()
              console.log(response.data);
              this.savingPrescription = false
                this.productToAddToPrescription = {
                  product: {},
                  quantity: '',
                  posology: '',
                }

                this.newPrescription = {
                  products: [],
                  observations: '',
                }

                this.errors = null
                this.$toastr.success('Receta veterinaria registrada')
            }).catch( error => {
                this.savingPrescription = false
                if (error.response.status == 422) {
                  this.errors = error.response.data.errors
                } else {
                  this.$toastr.error('La receta veterinaria no pudo ser registrada')
                }
              })

          }
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