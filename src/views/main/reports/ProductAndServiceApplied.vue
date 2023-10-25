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
              <h3 class="tile-title">Productos y servicios aplicados</h3>
              <SearchOwnersAndPets
                  @owner-and-pet-selected="petAndOwnerSelected">
              </SearchOwnersAndPets>
              <!--<form @submit.prevent="loadingResults=true; products = [], services = [];getProductsAndServicesFromPet()">
                <div class="row">
                  <div class="col-md-3">
                    <div class="form-group">
                      <label for="">Desde</label>
                      <input type="date" name="" class="form-control" v-model="dateSince" required>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-group">
                      <label for="">Hasta</label>
                      <input type="date" name="" class="form-control" v-model="dateUntil" required>
                    </div>
                  </div>
                </div>
                <div>
                <button :disabled="!ownerSelected || !petSelected || loadingResults" class="btn btn-primary mr-1" type="submit">
                  <i class="fa fa-fw fa-lg fa-search"></i>Consultar
                </button>
              </div>
            </form>-->
              <button :disabled="!petSelected || exportingProductsAndServicesInPdf || loadingResults" class="btn btn-primary mr-1 btn-sm" @click="exportProductsAndServicesInPdf">
                <i class="fa fa-fw fa-lg fa-print"></i>Exportar <span v-if="exportingProductsAndServicesInPdf" class="spinner-border spinner-border-sm ml-1"></span>
              </button>
              <button class="btn btn-primary btn-sm" @click="loadingResults = true; getProductsAndServicesFromPet()" :disabled="!petSelected || loadingResults">
                    <i class="fa fa-fw fa-lg fa-refresh"></i>
              </button>
            </div>
          </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h5 class="tile-title">Productos aplicados <span v-if="loadingResults" class="spinner-border spinner-border-sm ml-1 mb-1"></span></h5>
            <div class="table-responsive" style="max-height: 200px;">
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th nowrap>Fecha de aplicación</th>
                    <th>Usuario</th>
                    <th>Folio</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="product in products" :key="product.id" :title="product.observations">
                        <td nowrap>{{ product.product.name }}</td>
                        <td nowrap>
                          <template v-if="product.edit">
                            <input type="number" v-model="product.quantity">
                          </template>
                          <span v-else>
                            {{ product.quantity }}
                          </span>
                        </td>
                        <td nowrap>{{ formatDate(product.clinic_history.created_at) }}</td>
                        <td nowrap>{{ product.clinic_history.user.identification + ' - ' + product.clinic_history.user.names + ' ' + product.clinic_history.user.surnames }}</td>
                        <td nowrap>{{ product.clinic_history.number_folio }}</td>
                        <td nowrap>
                          <div v-if="canUpdateAndDelete(product.clinic_history.user.username)">
                            <button class="btn btn-warning btn-sm mr-1" v-if="!product.edit"
                              :disabled="!hasPermission('clinic-histories.edit-quantity-products-applied')"
                              @click="product.edit = true">
                              <i class="fa fa-edit"></i>
                            </button>
                            <button nowrap class="btn btn-primary btn-sm mr-1" v-else
                              :disabled="!hasPermission('clinic-histories.edit-quantity-products-applied') || product.updating"
                              @click="updateApplicationProduct(product)">
                              <span v-if="product.updating" class="spinner-border spinner-border-sm"></span>
                              <i class="fa fa-save" v-else></i>
                            </button>
                            <button class="btn btn-danger btn-sm" v-if="product.edit"
                              :disabled="!hasPermission('clinic-histories.edit-quantity-products-applied') || product.updating"
                              @click="product.edit = false; product.quantity = product.quantityOld">
                              <i class="fa fa-times-circle"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" v-if="!product.edit"
                              :disabled="!hasPermission('clinic-histories.delete-products-applied') || product.deleting"
                              @click="deleteApplicationProduct(product)">
                              <span v-if="product.deleting" class="spinner-border spinner-border-sm"></span>
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
            <h4 class="tile-title">Servicios aplicados <span v-if="loadingResults" class="spinner-border spinner-border-sm ml-1 mb-1"></span></h4>
            <div class="table-responsive" style="max-height: 200px;">
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>Cantidad</th>
                    <th nowrap>Fecha de aplicación</th>
                    <th>Usuario</th>
                    <th>Folio</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="service in services" :key="service.id" :title="service.observations">
                        <td nowrap>{{ service.service.name }}</td>
                        <td nowrap>
                          <template v-if="service.edit">
                            <input type="number" v-model="service.quantity">
                          </template>
                          <span v-else>
                            {{ service.quantity }}
                          </span>
                        </td>
                        <td nowrap>{{ formatDate(service.clinic_history.created_at) }}</td>
                        <td nowrap>{{ service.clinic_history.user.identification + ' - ' + service.clinic_history.user.names + ' ' + service.clinic_history.user.surnames }}</td>
                        <td nowrap>{{ service.clinic_history.number_folio }}</td>
                        <td nowrap>
                          <div v-if="canUpdateAndDelete(service.clinic_history.user.username)">
                            <button class="btn btn-warning btn-sm mr-1" v-if="!service.edit"
                              :disabled="!hasPermission('clinic-histories.edit-quantity-services-applied')"
                              @click="service.edit = true">
                              <i class="fa fa-edit"></i>
                            </button>
                            <button class="btn btn-primary btn-sm mr-1" v-if="service.edit"
                              :disabled="!hasPermission('clinic-histories.edit-quantity-services-applied') || service.updating"
                              @click="updateApplicationService(service)">
                              <span v-if="service.updating" class="spinner-border spinner-border-sm"></span>
                              <i class="fa fa-save" v-else></i>
                            </button>
                            <button class="btn btn-danger btn-sm" v-if="service.edit"
                              :disabled="!hasPermission('clinic-histories.edit-quantity-services-applied') || service.updating"
                              @click="service.edit = false; service.quantity = service.quantityOld">
                              <i class="fa fa-times-circle"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" v-if="!service.edit"
                              :disabled="!hasPermission('clinic-histories.delete-services-applied') || service.deleting"
                              @click="deleteApplicationService(service)">
                              <span v-if="service.deleting" class="spinner-border spinner-border-sm"></span>
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
    </div>
</template>

<script>
    import hasPermission from '../_utilities/hasPermission'
    import SearchOwnersAndPets from './../_components/SearchOwnersAndPets'
    import moment from 'moment'
    moment.locale('es')
    export default {
        mixins: [ hasPermission ],
        components: {
          SearchOwnersAndPets
        },
        data() {
            return {
                owners: [],
                dateSince: '',
                dateUntil: '',
                petSelected: '',
                petsFromOwner: '',
                lookingPet: false,
                products: [],
                services: [],
                loadingResults: false,
                exportingProductsAndServicesInPdf: false,
            }
        },
        methods: {
          getProductsAndServicesFromPet () {
            this.$http.get(`reports/products-and-services-applied/${ this.petSelected }`).then(response => {
              this.loadingResults = false
              if (!response.data.products.length && !response.data.services.length) {
                this.$toastr.info('No existen registros de productos ni servicios aplicados')
              }
              this.products = response.data.products.map(product => {
                return {
                  id: product.id,
                  clinic_history: product.clinic_history,
                  quantity: product.quantity,
                  product: product.product,
                  quantityOld: product.quantity,
                  updating: false,
                  deleting: false,
                  edit: false
                }
              })
              this.services = response.data.services.map(service => {
                return {
                  id: service.id,
                  clinic_history: service.clinic_history,
                  quantity: service.quantity,
                  service: service.service,
                  quantityOld: service.quantity,
                  updating: false, 
                  deleting: false,
                  edit: false
                }
              })
            }).catch( error => {
              this.loadingResults = false
            })
          },
          deleteApplicationProduct (clinicHistoryProduct) {
            clinicHistoryProduct.deleting = true
            this.$http.delete(`clinic-histories/${ clinicHistoryProduct.id }/delete-product-application`).then( response => {
              this.getProductsAndServicesFromPet()
              this.$toastr.success('Registro eliminado exitosamente')
            }).catch( error => {
              clinicHistoryProduct.deleting = false
              if (error.response.status == 422 ) {
                this.$toastr.error(error.response.data.message)
              }
            })
          },
          updateApplicationProduct (clinicHistoryProduct) {
            clinicHistoryProduct.updating = true
            this.$http.put(`clinic-histories/${ clinicHistoryProduct.id }/update-product-application`, { quantity: clinicHistoryProduct.quantity }).then( response => {
              this.getProductsAndServicesFromPet()
              this.$toastr.success('Cantidad del producto actualizada')
            }).catch( error => {
              clinicHistoryProduct.quantity = clinicHistoryProduct.quantityOld
              clinicHistoryProduct.updating = false
              if (error.response.status == 422 ) {
                this.$toastr.error(error.response.data.message)
              }
            })
          },
          deleteApplicationService (clinicHistoryService) {
            clinicHistoryService.deleting = true
            this.$http.delete(`clinic-histories/${ clinicHistoryService.id }/delete-service-application`).then( response => {
              this.$toastr.success('Registro eliminado exitosamente')
              this.getProductsAndServicesFromPet()
            }).catch( error => {
              clinicHistoryService.deleting = false
              if (error.response.status == 422 ) {
                this.$toastr.error(error.response.data.message)
              }
            })
          },
          updateApplicationService (clinicHistoryService) {
            clinicHistoryService.updating = true
            this.$http.put(`clinic-histories/${ clinicHistoryService.id }/update-service-application`, { quantity: clinicHistoryService.quantity }).then( response => {
              this.getProductsAndServicesFromPet()
              this.$toastr.success('Cantidad del servicio actualizada')
            }).catch( error => {
              clinicHistoryService.updating = false
              clinicHistoryService.quantity = clinicHistoryService.quantityOld
              if (error.response.status == 422 ) {
                this.$toastr.error(error.response.data.message)
              }
            })
          },
          canUpdateAndDelete (user) {
            return localStorage.getItem('name_user') == user
          },
          setOwnerSelected (payload) {
            //this.ownerSelected = payload
          },
          petAndOwnerSelected(petId) {
            this.petSelected = petId
            this.products = []
            this.services = []
            if (this.petSelected) {
              this.loadingResults = true
              this.getProductsAndServicesFromPet()
            }
          },
          setStateFromLoading (payload) {
            this.products = []
            this.services = []
            this.loadingResults = payload
          },
          formatDate (date) {
            //return date;
            return moment(date).format('DD-MMM-Y, h:mm a')
          },
          exportProductsAndServicesInPdf () {
            this.exportingProductsAndServicesInPdf = true

            this.$http.get(`reports/products-and-services-applied/${ this.petSelected }/export-pdf`, { params: { dateSince: this.dateSince, dateUntil: this.dateUntil }, responseType: 'blob' }).then(response => {
              this.exportingProductsAndServicesInPdf = false
              window.open(URL.createObjectURL(response.data), '_blank')
            }).catch( error => {
              this.exportingProductsAndServicesInPdf = false
              if (error.response.status == 422) {
                return this.$toastr.info(error.response.data.message)
              }
              this.$toastr.error('El correo no se pudo enviar')
            })
          },
        }
    }
</script>