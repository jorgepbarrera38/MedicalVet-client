<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-file-text"></i> Facturación</h1>
            </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="tile">
              <h3 class="tile-title">Pendiente por facturar</h3>
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
                <!--<button :disabled="!ownerSelected || !petSelected || exportingVaccinesInPdf" class="btn btn-primary mr-1" @click="exportVaccinesInPdf">
                  <i class="fa fa-fw fa-lg fa-print"></i>Exportar <span v-if="exportingVaccinesInPdf" class="spinner-border spinner-border-sm ml-1"></span>
                </button>-->
              </div>              
            </div>
          </div>
      </div>
      <!--Inicio de resultados de vacunas y desparasitaciones-->
      <div class="row">
        <div class="col-md-7">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="tile-title">Productos y servicios <span v-if="loadingResults" class="spinner-border spinner-border-sm ml-1 mb-1"></span></h3>
              <button class="btn btn-success btn-sm" @click="loadingResults = true; getVaccinesFromPet()" :disabled="!petSelected || loadingResults">
                    <i class="fa fa-fw fa-lg fa-refresh"></i>
              </button>
              
            </div>
            <div class="table-responsive">
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th nowrap>Fecha</th>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="(productAndService, index) in productsAndServices" :key="productAndService.id">
                      <td>
                        {{ productAndService.id }}
                      </td>
                        <td nowrap>
                          {{ formatDate(productAndService.datetime) }}
                        </td>
                        <td>
                          {{ productAndService.code }}
                        </td>
                        <td>
                          {{ productAndService.description }}
                        </td>
                        <td>
                          {{ productAndService.price }}
                        </td>
                        <td>
                          {{ productAndService.quantity }}
                        </td>
                        
                        <td nowrap>
                          <div>
                            <button class="btn btn-danger btn-sm mr-1" @click="deleteProductOrService(productAndService, index)" :disabled="productAndService.deleting">
                              <span v-if="productAndService.deleting" class="spinner-border spinner-border-sm"></span>
                              <i class="fa fa-trash" v-else></i>
                            </button>
                            <button class="btn btn-success btn-sm mr-1" @click="addProductOrServiceToBill(productAndService)" v-if="!productAndService.checked">
                              <i class="fa fa-check"></i>
                            </button>
                            <button class="btn btn-warning btn-sm" @click="deleteProductOrServiceFromBill(productAndService)" v-else>
                              <i class="fa fa-times"></i>
                            </button>
                          </div>
                        </td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-md-5">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="tile-title">Facturar</h3>
              <!--<button class="btn btn-danger btn-sm" @click="cancelbill">
                    <i class="fa fa-fw fa-lg fa-times"></i> Cancelar
              </button>-->
              
            </div>
            <div class="table-responsive">
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th nowrap>Fecha</th>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="(productAndService, index) in productsAndServicesChecked" :key="productAndService.id">
                        <td>
                          {{ productAndService.id }}
                        </td>
                        <td nowrap>
                          {{ formatDate(productAndService.datetime) }}
                        </td>
                        <td>
                          {{ productAndService.code }}
                        </td>
                        <td>
                          {{ productAndService.description }}
                        </td>
                        <td>
                          {{ productAndService.price }}
                        </td>
                        <td>
                          {{ productAndService.quantity }}
                        </td>
                        <td>
                          {{ productAndService.quantity * productAndService.price  }}
                        </td>
                    </tr>
                </tbody>
              </table>
            </div>
            <h3>Total: ${{ calculateTotalBill() }}</h3>
            <button class="btn btn-primary btn-sm" @click="bill" :disabled="saving || !productsAndServicesChecked.length">
                    <i class="fa fa-fw fa-lg fa fa-save"></i> Grabar <span v-if="saving" class="spinner-border spinner-border-sm ml-1"></span>
              </button>
          </div>
        </div>
      </div>
      <!--Inicio de resultados de vacunas y desparasitaciones-->
    </div>
</template>

<script>
    import SearchOwnersAndPets from '../_components/SearchOwnersAndPets'
    import { VueLoading } from 'vue-loading-template'
    import moment from 'moment'
    moment.locale('es')
    export default {
        components: {
          VueLoading, 
          SearchOwnersAndPets,
        },
        data() {
            return {
                ownerSelected: false,
                petSelected: '',
                productsAndServices: [],
                productsAndServicesChecked : [],

                /*Para agregar más productos y/o servicios*/
                allVaccines: [],
                allDewormings: [],
                
                loadingResults: false,
                exportingVaccinesInPdf: false,

                saving: false
            }
        },
        methods: {
          getVaccinesFromPet () {
            this.$http.get(`billings/${ this.petSelected }/get-pending-billing`).then(response => {
              /*if (!response.data.vaccines.length && !response.data.dewormings.length) {
                this.$toastr.info('No existen registros de vacunas ni desparasitaciones')
              }*/
              this.productsAndServices = response.data.productsAndServices
              this.productsAndServices.forEach(productOrService => {
                  this.$set(productOrService, 'deleting', false)
                  this.$set(productOrService, 'checked', false)
              })
              
              /*this.allVaccines = response.data.allVaccines
              this.allDewormings = response.data.allDewormings*/

              if (!this.productsAndServices.length) {
                this.$toastr.info('No existen productos o servicios pendientes por facturar')
              }

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
            this.productsAndServices = []
            this.dewormingsFromPet = []
            this.petSelected = ''
            if (payload) {
              this.loadingResults = true
              this.petSelected = payload
              this.getVaccinesFromPet()
            }
          },
          setStateFromLoading (payload) {
            this.productsAndServices = []
            this.dewormingsFromPet = []
            //this.loadingResults = payload
          },
          deleteProductOrService (vaccine, index) {
            vaccine.deleting = true
            this.$http.delete(`vaccines/${ vaccine.id }`).then( response => {
              this.productsAndServices.splice(index, 1)
              this.getVaccinesFromPet()
              this.$toastr.success('Vacuna eliminada con éxito')
            }).catch( () => {
              vaccine.deleting = false
            })
          },
          formatDate (date) {
            return moment(date).format('LLL')
          },
          bill () {
            this.saving = true
            this.$http.post(`billings/${ this.petSelected }/bill`, { productsAndServicesChecked: this.productsAndServicesChecked} ).then(response => {
              
            this.productsAndServices = []
            this.productsAndServicesChecked = []
            this.loadingResults = true
            this.getVaccinesFromPet()
                      
            this.$toastr.success('Factura generada')
            this.saving = false
            }).catch(() => {
              this.saving = false
            })
          },
          cancelbill () {
            this.productsAndServices.forEach(productOrService => {
                productOrService.checked = false
            })

            this.productsAndServicesChecked = []
            
          },
          addProductOrServiceToBill (productAndService) {
            productAndService.checked = true
            this.productsAndServicesChecked.push(productAndService)
          },
          deleteProductOrServiceFromBill (productAndService) {
            productAndService.checked = false
            this.productsAndServicesChecked.splice(this.productsAndServicesChecked.findIndex(productAndServiceChecked => productAndServiceChecked.id == productAndService.id), 1)
          },
          calculateTotalBill () {
            let total = 0;

            this.productsAndServicesChecked.forEach(productAndServiceChecked => {
              total += productAndServiceChecked.price * productAndServiceChecked.quantity
            })

            return total
          }
        }
    }
</script>