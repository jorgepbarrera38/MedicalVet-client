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
              <h3 class="tile-title">Consulta de facturas</h3>
              <button class="btn btn-success btn-sm" @click="getAllBills()">
                <i class="fa fa-fw fa-lg fa-refresh"></i>
              </button>
            </div>
            <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <div class="table-responsive" v-else :style="`max-height: ${getHeightFromWindow}px;`">        

              <table class="table table-sm table-hover">
                    <thead>
                    <th nowrap>Fecha</th>
                    <th>Factura No.</th>
                    <th>Cliente </th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th></th>
                    </thead>
                    <tbody>
                      <tr>
                        <td></td>
                        <td><input type="text" class="form-control form-control-sm" v-model="searchBy.number_bill" @keyup.enter="getAllBills"></td>
                        <td><input type="text" class="form-control form-control-sm" v-model="searchBy.identification_or_names_from_owner" @keyup.enter="getAllBills"></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    <tr v-for="bill in allBills.data" :key="'bill' + bill.id">
                        <td nowrap>{{ formatDate(bill.date) }}</td>
                        <td nowrap>{{ bill.number_bill }}</td>
                        <td nowrap>{{ bill.owner.identification + ' - ' +  bill.owner.names + ' ' +  bill.owner.surnames }}</td>
                        <td nowrap>${{ bill.total | convertMoney }}</td>
                        <td nowrap>{{ bill.cancelled ? 'Anulada' : 'Generada' }}</td>
                        <td nowrap>
                        <!--!hasPermission('appointments.cancel')-->
                        <button :disabled="bill.cancelled == 1 || bill.cancelling"
                            class="btn btn-danger btn-sm" @click="cancelBill(bill)" title="Cancelar">
                            <span class="spinner-border spinner-border-sm" v-if="bill.cancelling"></span>
                            <i class="fa fa-trash" v-else></i>
                        </button>
                        </td>
                    </tr>
                    </tbody>
                </table>

            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="allBills" @pagination-change-page="getAllBills">
              <span slot="prev-nav">&lt; Anterior</span>
              <span slot="next-nav">Siguiente &gt;</span>
            </pagination>
            <!--<pagination class="my-2" align="right" :limit="-1" :data="allBills" @pagination-change-page="getAllAppointments">
              <span slot="prev-nav">&lt; Anterior</span>
              <span slot="next-nav">Siguiente &gt;</span>
            </pagination>-->
            <!-- Modal cancelar cita-->
      <div class="modal fade" id="cancelAppointmentModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Motivo de cancelación</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12">
                  <div class="alert alert-danger" v-if="errorsWhenCancelBill">
                    <li v-for="(error, index) in errorsWhenCancelBill" :key="'error' + index">
                      {{ error[0] }}
                    </li>
                  </div>
                </div>
              </div>
              <div class="form-group">
                
              </div>
            </div>
            <div class="modal-footer">
              <vue-loading type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
              <div>
                <button type="button" class="btn btn-secondary btn-sm mr-1" data-dismiss="modal">
                  <i class="fa fa-fw fa-lg fa fa-times-circle"></i>Cancelar
                </button>
                <button type="button" class="btn btn-primary btn-sm">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i>Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--Fin cancelar cita-->
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import hasPermission from '../_utilities/hasPermission'
    import { VueLoading } from 'vue-loading-template'
    import Search from '../_components/Search'
    import moment from 'moment'
    moment.locale('es')
    export default {
      mixins: [ hasPermission ],
      components: {
        VueLoading, Search
      },
      created () {
        this.getAllBills()
      },
      data() {
          return {
              allBills: [],
              loading: true,
              errorsWhenCancelBill: null,
              reasonCancellations: [],
              searchBy: {
                number_bill: '',
                identification_or_names_from_owner: '',
              }
          }
      },
      methods: {
        getAllBills (page = 1) {
            this.$http.get('billings/get-all-bills?page=' + page + '&number_bill=' + this.searchBy.number_bill + '&identification_or_names_from_owner=' + this.searchBy.identification_or_names_from_owner).then( response => {
                this.allBills = response.data
                this.allBills.data.forEach(bill => {
                  this.$set(bill, 'cancelling', false)  
                });

                this.loading = false
            })
        },
        formatDate (date) {
            return moment(date).format('DD-MMM-Y, h:mm a')
        },
        cancelBill (bill) {
          bill.cancelling = true

          this.$http.post(`billings/${ bill.id }/cancel-bill`).then( response => {
            this.getAllBills()
            this.$toastr.success('Factura anulada')
          }).catch( error => {
            bill.cancelling = false
            if (error.response.status == 422) {
              this.$toastr.error(error.response.data.message)
            }
          })
        },
      },
      computed: {
        getHeightFromWindow () {
            return window.innerHeight - 300
        }
      }
    }
</script>

<style lang="scss" scoped>

</style>