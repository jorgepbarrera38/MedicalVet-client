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
                            <button class="btn btn-info btn-sm mr-1" v-if="!product.edit"
                              :disabled="!hasPermission('clinic-histories.edit-quantity-products-applied')"
                              @click="product.edit = true">
                              <i class="fa fa-edit"></i>
                            </button>
                            <button nowrap class="btn btn-primary btn-sm mr-1" v-else
                              :disabled="!hasPermission('clinic-histories.edit-quantity-products-applied')"
                              @click="updateApplicationProduct(product)">
                              <i class="fa fa-save"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" v-if="product.edit"
                              :disabled="!hasPermission('clinic-histories.edit-quantity-products-applied')"
                              @click="product.edit = false">
                              <i class="fa fa-close"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" v-if="!product.edit"
                              :disabled="!hasPermission('clinic-histories.delete-products-applied')"
                              @click="deleteApplicationProduct(product.id)">
                              <i class="fa fa-trash"></i>
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
                            <button class="btn btn-info btn-sm mr-1" v-if="!service.edit"
                              :disabled="!hasPermission('clinic-histories.edit-quantity-services-applied')"
                              @click="service.edit = true">
                              <i class="fa fa-edit"></i>
                            </button>
                            <button class="btn btn-primary btn-sm mr-1" v-if="service.edit"
                              :disabled="!hasPermission('clinic-histories.edit-quantity-services-applied')"
                              @click="updateApplicationService(service)">
                              <i class="fa fa-save"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" v-if="service.edit"
                              :disabled="!hasPermission('clinic-histories.edit-quantity-services-applied')"
                              @click="service.edit = false">
                              <i class="fa fa-close"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" v-if="!service.edit"
                              :disabled="!hasPermission('clinic-histories.delete-services-applied')"
                              @click="deleteApplicationService(service.id)">
                              <i class="fa fa-trash"></i>
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
                  edit: false
                }
              })
              this.services = response.data.services.map(service => {
                return {
                  id: service.id,
                  clinic_history: service.clinic_history,
                  quantity: service.quantity,
                  service: service.service,
                  edit: false
                }
              })
            }).catch( error => {
              this.loadingResults = false
            })
          },
          deleteApplicationProduct (clinicHistoryProductId) {
            this.$http.delete(`clinic-histories/${ clinicHistoryProductId }/delete-product-application`).then( response => {
              this.$toastr.success('Registro eliminado exitosamente')
              this.getProductsAndServicesFromPet()
            }).catch( error => {
              if (error.response.status == 422 ) {
                this.$toastr.error(error.response.data.message)
              }
            })
          },
          updateApplicationProduct (clinicHistoryProduct, element) {
            this.$http.put(`clinic-histories/${ clinicHistoryProduct.id }/update-product-application`, { quantity: clinicHistoryProduct.quantity }).then( response => {
              this.getProductsAndServicesFromPet()
            }).catch( error => {
              if (error.response.status == 422 ) {
                this.$toastr.error(error.response.data.message)
              }
            })
          },
          deleteApplicationService (clinicHistoryServiceId) {
            this.$http.delete(`clinic-histories/${ clinicHistoryServiceId }/delete-service-application`).then( response => {
              this.$toastr.success('Registro eliminado exitosamente')
              this.getProductsAndServicesFromPet()
            }).catch( error => {
              if (error.response.status == 422 ) {
                this.$toastr.error(error.response.data.message)
              }
            })
          },
          updateApplicationService (clinicHistoryService) {
            this.$http.put(`clinic-histories/${ clinicHistoryService.id }/update-service-application`, { quantity: clinicHistoryService.quantity }).then( response => {
              this.getProductsAndServicesFromPet()
            }).catch( error => {
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