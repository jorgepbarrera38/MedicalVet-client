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
                  @owner-and-pet-selected="ownerAndPetSelected">
                </SearchOwnersAndPets>
              <div>
              </div>              
            </div>
          </div>
      </div>
      <!--Inicio de resultados de vacunas y desparasitaciones-->
      <div class="row">
        <div class="col-md-6">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="tile-title">Productos y servicios <span v-if="loadingResults" class="spinner-border spinner-border-sm ml-1 mb-1"></span></h3>
              <button class="btn btn-success btn-sm" @click="loadingResults = true; getPendingBilling()" :disabled="!petSelectedId || loadingResults">
                    <i class="fa fa-fw fa-lg fa-refresh"></i>
              </button>
              
            </div>
            <div class="table-responsive" style="max-height: 300px;">
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
        <div class="col-md-6">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="tile-title">Facturar</h3>
            </div>
            <div class="table-responsive" style="max-height: 300px;">
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
                    <th></th>
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
                        <td>
                          <div>
                            <button class="btn btn-success btn-sm mr-1" @click="addProductOrServiceToBill(productAndService)" v-if="!productAndService.checked">
                              <i class="fa fa-check"></i>
                            </button>
                            <button class="btn btn-warning btn-sm" @click="deleteProductOrServiceFromBill2(productAndService)" v-else>
                              <i class="fa fa-times"></i>
                            </button>
                          </div>
                        </td>
                    </tr>
                </tbody>
              </table>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="">Entregado</label>
                  <input type="number" class="form-control" v-model="moneyGiven">
                </div>
              </div>
            </div>

            <h3>Total: ${{ calculateTotalBill() }}</h3>
            
            <h3>Entregado: ${{ moneyGiven }}</h3>


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
    import moment, { relativeTimeThreshold } from 'moment'
    moment.locale('es')
    export default {
        components: {
          VueLoading, 
          SearchOwnersAndPets,
        },
        data() {
            return {
                petSelectedId: '',
                productsAndServices: [],
                productsAndServicesChecked : [],

                /*Para agregar más productos y/o servicios*/
                allVaccines: [],
                allDewormings: [],
                
                loadingResults: false,
                exportingVaccinesInPdf: false,

                saving: false,
                moneyGiven: 0
            }
        },
        methods: {
          getPendingBilling () {
            this.$http.get(`billings/${ this.petSelectedId }/get-pending-billing`).then(response => {
              
              this.productsAndServices = response.data.productsAndServices
              this.productsAndServices.forEach(productAndService => {
                  this.$set(productAndService, 'checked', this.productsAndServicesChecked.find(productAndServiceChecked => productAndServiceChecked.id == productAndService.id) ? true : false)
              })

              if (!this.productsAndServices.length) {
                this.$toastr.info('No existen productos o servicios pendientes por facturar')
              }

              this.loadingResults = false
            }).catch(() => {
              this.loadingResults = false
            })
          },
          ownerAndPetSelected(petId) {
            this.productsAndServices = []
            this.productsAndServicesChecked = []
            this.petSelectedId = ''
            if (petId) {
              this.loadingResults = true
              this.petSelectedId = petId
              this.getPendingBilling()
            }
          },
          formatDate (date) {
            return moment(date).format('LLL')
          },
          bill () {
            this.saving = true
            this.$http.post(`billings/${ this.petSelectedId }/bill`, { productsAndServicesChecked: this.productsAndServicesChecked, moneyGiven: this.moneyGiven } ).then(response => {
              
            this.productsAndServices = []
            this.productsAndServicesChecked = []
            this.moneyGiven = 0
            this.loadingResults = true
            this.getPendingBilling()
                      
            this.$toastr.success('Factura generada')
            this.saving = false
            }).catch(error => {
              this.saving = false
              if (error.response.status == 422) {
                this.$toastr.error(error.response.data.message)
              }
            })
          },
          addProductOrServiceToBill (productAndService) {
            productAndService.checked = true
            this.productsAndServicesChecked.push(productAndService)
            this.productsAndServicesChecked.sort((a, b) => b.id - a.id)
          },
          deleteProductOrServiceFromBill (productAndService) {
            productAndService.checked = false
            this.productsAndServicesChecked.splice(this.productsAndServicesChecked.findIndex(productAndServiceChecked => productAndServiceChecked.id == productAndService.id), 1)
          },
          deleteProductOrServiceFromBill2 (productAndService) {
            this.productsAndServicesChecked.splice(this.productsAndServicesChecked.findIndex(productAndServiceChecked => productAndServiceChecked.id == productAndService.id), 1)
            let productAndServiceFound = this.productsAndServices.find(productAndService1 => productAndService1.id == productAndService.id)
            if (productAndServiceFound) {
              productAndServiceFound.checked = false
            }
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