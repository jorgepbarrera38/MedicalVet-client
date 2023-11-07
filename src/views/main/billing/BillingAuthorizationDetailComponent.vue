<template>
    <div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label for="">Código:</label> 
              {{ authorization.code }}

              <br>

              <label for="">Nombre:</label>
              {{ authorization.name }}

              <br>

              <label for="" class="mr-2">Maneja prefijo</label>
              <input type="checkbox" v-model="authorization.handles_prefix">
            </div>

            <br>  

            <div class="table-responsive">
              <table class="table table-hover table-sm">
                <thead>
                  <th>Número de resolución</th>
                  <th>Fecha de resolución</th>
                  <th>Factura inicial</th>
                  <th>Factura final</th>
                  <th>Fecha inicial</th>
                  <th>Fecha final</th>
                  <th>Activo</th>
                  <th></th>
                </thead>
                <tbody>
                  <tr v-for="authorization_detail in authorization.bill_billing_authorization_details">
                    <td nowrap>{{ authorization_detail.resolution_number }}</td>
                    <td nowrap>{{ authorization_detail.resolution_date }}</td>
                    <td nowrap>{{ authorization_detail.initial_bill }}</td>
                    <td nowrap>{{ authorization_detail.final_bill }}</td>
                    <td nowrap>{{ authorization_detail.initial_date }}</td>
                    <td nowrap>{{ authorization_detail.final_date }}</td>
                    <td nowrap>
                      <input type="checkbox" :checked="authorization_detail.active">
                    </td>
                    <td nowrap>
                      <button class="btn btn-danger btn-sm mr-1" :disabled="authorization_detail.deleting" @click="deleteAuthorizationDetail(authorization_detail)">
                        <span class="spinner-border spinner-border-sm" v-if="authorization_detail.deleting"></span>
                        <i class="fa fa-trash" v-else></i>
                      </button>
                      <button class="btn btn-warning btn-sm" :disabled="authorization_detail.editing" @click="authorization_detail.editing = true, editAuthorizationDetail = {...authorization_detail}, showFormToEditDetail = true">
                        <i class="fa fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button class="btn btn-success btn-sm" @click="showFormToAddDetail = true" v-if="!showFormToAddDetail">
              <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo 
            </button>

            <div v-if="showFormToAddDetail">
              <div class="alert alert-danger" v-if="errors">
                <li v-for="(error, index) in errors" :key="index">
                  {{ error[0] }}
                </li>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">Número de resolución</label>
                    <input type="text" class="form-control" v-model="newAuthorizationDetail.resolution_number">
                  </div> 
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">Fecha de resolución</label>
                    <input type="date" class="form-control" v-model="newAuthorizationDetail.resolution_date">
                  </div> 
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">Factura inicial</label>
                    <input type="number" class="form-control" v-model="newAuthorizationDetail.initial_bill">
                  </div> 
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">Factura final</label>
                    <input type="number" class="form-control" v-model="newAuthorizationDetail.final_bill">
                  </div> 
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">Fecha inicial</label>
                    <input type="date" class="form-control" v-model="newAuthorizationDetail.initial_date">
                  </div> 
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">Fecha final</label>
                    <input type="date" class="form-control" v-model="newAuthorizationDetail.final_date">
                  </div> 
                </div>

                <div class="col-md-12">
                  <div class="form-group">
                    <label for="" class="mr-2">Activo</label>
                    <input type="checkbox" v-model="newAuthorizationDetail.active">
                  </div> 
                </div>

                <div class="col-md-12">
                  <button class="btn btn-primary btn-sm mr-1" @click="saveAuthorizationDetail" :disabled="saving">
                    <i  class="fa fa-fw fa-lg fa-save"></i>Guardar <span v-if="saving" class="spinner-border spinner-border-sm ml-1"></span>
                  </button>
                  <button class="btn btn-danger btn-sm" @click="showFormToAddDetail = false" :disabled="saving">
                    <i  class="fa fa-fw fa-lg fa-times-circle"></i>Cancelar
                  </button>
                </div>

              </div>
            </div>
            <div v-if="showFormToEditDetail">
              <div class="alert alert-danger" v-if="errors">
                <li v-for="(error, index) in errors" :key="index">
                  {{ error[0] }}
                </li>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">Número de resolución</label>
                    <input type="text" class="form-control" v-model="editAuthorizationDetail.resolution_number">
                  </div> 
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">Fecha de resolución</label>
                    <input type="date" class="form-control" v-model="editAuthorizationDetail.resolution_date">
                  </div> 
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">Factura inicial</label>
                    <input type="number" class="form-control" v-model="editAuthorizationDetail.initial_bill">
                  </div> 
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">Factura final</label>
                    <input type="number" class="form-control" v-model="editAuthorizationDetail.final_bill">
                  </div> 
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">Fecha inicial</label>
                    <input type="date" class="form-control" v-model="editAuthorizationDetail.initial_date">
                  </div> 
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">Fecha final</label>
                    <input type="date" class="form-control" v-model="editAuthorizationDetail.final_date">
                  </div> 
                </div>

                <div class="col-md-12">
                  <div class="form-group">
                    <label for="" class="mr-2">Activo</label>
                    <input type="checkbox" v-model="editAuthorizationDetail.active">
                  </div> 
                </div>

                <div class="col-md-12">
                  <button class="btn btn-primary btn-sm mr-1" @click="updateAuthorizationDetail" :disabled="saving">
                    <i  class="fa fa-fw fa-lg fa-save"></i>Guardar <span v-if="saving" class="spinner-border spinner-border-sm ml-1"></span>
                  </button>
                  <button class="btn btn-danger btn-sm" @click="showFormToEditDetail = false; getAuthorization()" :disabled="saving">
                    <i  class="fa fa-fw fa-lg fa-times-circle"></i>Cancelar
                  </button>
                </div>

              </div>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    
    export default {
      props: ['billingAuthorization_id'],
      data() {
          return {
            authorization: {
              code: '',
              name: '',
              handles_prefix: false,
            },
            newAuthorizationDetail: {
              resolution_number: '',
              resolution_date: '',
              initial_bill: '',
              final_bill: '',
              initial_date: '',
              final_date: '',
              active: false,
            },
            editAuthorizationDetail: {
              resolution_number: '',
              resolution_date: '',
              initial_bill: '',
              final_bill: '',
              initial_date: '',
              final_date: '',
              active: false,
            },
            saving: false,
            errors: null,
            showFormToAddDetail: false,
            showFormToEditDetail: false,
          }
      },
      methods: {
        getAuthorization () {
          this.$http.get(`bill/billing-authorization/${ this.billingAuthorization_id }/edit`).then( response => {
           this.authorization = response.data
           this.authorization.bill_billing_authorization_details.forEach(authorizationDetail => {
              this.$set(authorizationDetail, 'deleting', false)
              this.$set(authorizationDetail, 'editing', false)
              authorizationDetail.active = authorizationDetail.active == 1 ? true : false
           });
          })
        },
        openModalToRegisterAuthorization () {
            $('#modalForRegisterAuthorization').modal('show')
        },
        saveAuthorizationDetail () {
          this.saving = true

          this.$http.post(`bill/billing-authorization/${ this.billingAuthorization_id}/add-detail`, this.newAuthorizationDetail).then( response => {
            this.$toastr.success('Detalle registrado')
            this.getAuthorization()
            this.newAuthorizationDetail = {
              resolution_number: '',
              resolution_date: '',
              initial_bill: '',
              final_bill: '',
              initial_date: '',
              final_date: '',
              active: false,
            }
            this.errors = null
            this.saving = false
            this.showFormToAddDetail = false

          }).catch( error => {
              this.saving = false
              if (error.response.status == 422) {
                this.errors = error.response.data.errors
              }
            })
        },
        updateAuthorizationDetail () {
          this.saving = true

          this.$http.post(`bill/billing-authorization/${ this.editAuthorizationDetail.id}/update-detail`, this.editAuthorizationDetail).then( response => {
            this.$toastr.success('Detalle actualizado')
            this.getAuthorization()
            this.editAuthorizationDetail = {
              resolution_number: '',
              resolution_date: '',
              initial_bill: '',
              final_bill: '',
              initial_date: '',
              final_date: '',
              active: false,
            }
            this.errors = null
            this.saving = false
            this.showFormToEditDetail = false

          }).catch( error => {
              this.saving = false
              if (error.response.status == 422) {
                this.errors = error.response.data.errors
              }
            })
        },
        deleteAuthorizationDetail (authorization_detail) {
          authorization_detail.deleting = true

          this.$http.delete(`bill/billing-authorization/delete-detail/${authorization_detail.id}`).then( response => {
           this.getAuthorization()
          })
        }
      },
      watch: {
        billingAuthorization_id (billingAuthorization_id) {
          this.authorization = {
              code: '',
              name: '',
              handles_prefix: false,
            }
          if (billingAuthorization_id) {
            this.getAuthorization()
          }
        }
      }
    }
</script>

<style lang="scss" scoped>

</style>