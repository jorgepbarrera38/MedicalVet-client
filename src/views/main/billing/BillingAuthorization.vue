<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Facturación</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="tile-title">Autorización de facturación</h3>
              <!--:disabled="!hasPermission('billingAuthorizations.store')"-->
              <button class="btn btn-success btn-sm" @click="openModalToRegisterAuthorization">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
              <!--inicio modal vacunas-->
                <div class="modal fade bd-example-modal-lg" id="modalForRegisterAuthorization" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Registrar autorización de facturación</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div class="modal-body">
                            <BillingAuthorizationCreateComponent @authorization-saved="getBillingAuthorizations"/>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                    </div>
                </div>
                <!--Fin modal vacunas-->
              <!--inicio modal vacunas-->
                <div class="modal fade bd-example-modal-lg" id="modalForRegisterAuthorizationDetail" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Detalle autorización de facturación</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div class="modal-body">
                            <BillingAuthorizationDetailComponent :billingAuthorization_id="billingAuthorization_id"/>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                    </div>
                </div>
                <!--Fin modal vacunas-->
            </div>
            <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <div class="table-responsive" v-else>        
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Maneja prefijo</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="billingAuthorization in billingAuthorizations.data" :key="billingAuthorization.id">
                    <td nowrap>{{ billingAuthorization.code }}</td>
                    <td nowrap>{{ billingAuthorization.name }}</td>
                    <td nowrap>
                        <input type="checkbox" :checked="billingAuthorization.handles_prefix">
                    </td>
                    <td nowrap>
                      <button class="btn btn-info btn-sm mr-1" 
                        @click="openModalToRegisterAuthorizationDetail(billingAuthorization.id)">
                        <i class="fa fa-fw fa-lg fa fa-eye"></i>
                      </button>
                      <!--<button class="btn btn-danger btn-sm" 
                        @click="deleteActivity(billingAuthorization.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>-->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="billingAuthorizations" @pagination-change-page="getBillingAuthorizations">
              <span slot="prev-nav">&lt; Anterior</span>
              <span slot="next-nav">Siguiente &gt;</span>
            </pagination>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import hasPermission from '../_utilities/hasPermission'
    import { VueLoading } from 'vue-loading-template'
    import BillingAuthorizationCreateComponent from './BillingAuthorizationCreateComponent'
    import BillingAuthorizationDetailComponent from './BillingAuthorizationDetailComponent'
    export default {
      mixins: [ hasPermission ],
      components: {
        VueLoading, BillingAuthorizationCreateComponent, BillingAuthorizationDetailComponent
      },
      created () {
          this.getBillingAuthorizations()
      },
      data() {
          return {
              billingAuthorizations: {},
              billingAuthorization_id: '',
              loading: true
          }
      },
      methods: {
        getBillingAuthorizations (page = 1) {
          this.$http.get('bill/billing-authorization?page=' + page).then( response => {
              this.billingAuthorizations = response.data
              this.loading = false
          })
        },
        editActivity (id) {
          this.$router.push({ name: 'billingAuthorizations.edit', params: { id } })
        },
        deleteActivity (id) {
          this.$http.delete(`billingAuthorizations/${ id }`).then( response => {
              this.getBillingAuthorizations()
              this.$toastr.success('Actividad eliminada')
          }).catch( errors => {
            if (errors.response.status == 422) {
              this.$toastr.error('La actividad no se puede eliminar ya que tiene registros relacionadas')
            }
          })
        },

        openModalToRegisterAuthorization () {
            $('#modalForRegisterAuthorization').modal('show')
        },
        openModalToRegisterAuthorizationDetail (billingAuthorization_id) {
            this.billingAuthorization_id = billingAuthorization_id
            $('#modalForRegisterAuthorizationDetail').modal('show')
        },
      }
    }
</script>

<style lang="scss" scoped>

</style>