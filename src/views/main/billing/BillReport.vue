<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-file-text"></i> Facturación</h1>
            </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="tile">
              <h3 class="tile-title">Reporte de facturación</h3>
              <div class="form-group">
                  <label for="">Fecha inicio</label>
                  <input type="date" class="form-control" v-model="from">
              </div>
              <div class="form-group">
                  <label for="">Fecha fin</label>
                  <input type="date" class="form-control" v-model="until">
              </div>
              <!--<div class="form-group">
                  <label for=""></label>
                  <input type="checkbox" v-model="includeCancelleds"> Incluir anuladas
              </div>-->
              <div>
                <button :disabled="loadingResults || !from || !until" 
                  @click="loadingResults = true; getBills()"  
                  class="btn btn-primary btn-sm">
                  <i class="fa fa-fw fa-lg fa-search"></i>Consultar
                  <span v-if="loadingResults" class="spinner-border spinner-border-sm ml-1"></span>
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-8">
                <div class="tile" style="max-height:100%">
                    <div class="tile-title-w-btn">
                        <h3 class="tile-title">Resultados</h3>
                        <!--!hasPermission('bills.report-bills-export')-->
                        <button :disabled="downloadingReport || loadingResults || !bills.data.length || !from || !until"
                            @click="exportBills"
                            class="btn btn-success btn-sm">
                            <i class="fa fa-fw fa-lg fa-file-excel-o"></i>Exportar
                            <span v-if="downloadingReport" class="spinner-border spinner-border-sm"></span>
                        </button>
                    </div>
                    <vue-loading v-if="loadingResults" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                    <div class="table-responsive" v-else>        

                        <table class="table table-sm table-hover">
                            <thead>
                            <th nowrap>Fecha</th>
                            <th>Factura No.</th>
                            <th>Cliente </th>
                            <th>Total</th>
                            <th>Estado</th>
                            </thead>
                            <tbody>
                            <tr v-for="bill in bills.data" :key="'bill' + bill.id">
                                <td nowrap>{{ formatDate(bill.date) }}</td>
                                <td nowrap>{{ bill.number_bill }}</td>
                                <td nowrap>{{ bill.owner.identification + ' - ' +  bill.owner.names + ' ' +  bill.owner.surnames }}</td>
                                <td nowrap>${{ bill.total | convertMoney }}</td>
                                <td nowrap>{{ bill.cancelled ? 'Anulada' : 'Generada' }}</td>
                            </tr>
                            </tbody>
                        </table>

                    </div>
                        <pagination class="my-2" align="right" :limit="-1" :data="bills" @pagination-change-page="getBills">
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
    import moment from 'moment'
    moment.locale('es')
    import download from 'downloadjs'
    export default {
        mixins: [ hasPermission ],
        components: {
          VueLoading
        },
        created () {
            //this.getBills()
        },
        data() {
            return {
                bills: {
                    data: []
                },
                from: '',
                until: '',
                includeCancelleds: false,

                loadingResults: false,
                downloadingReport: false,
            }
        },
        methods: {
            getBills (page  = 1) {
                //this.loadingResults = true
                let data = {
                    from: this.from,
                    until: this.until,
                    includeCancelleds: this.includeCancelleds,                    
                }
                this.$http.get('billings/bill-report/get-all-bills?page=' + page, { params: data }).then( response => {
                    this.loadingResults = false
                    this.bills = response.data
                }).catch(() => {
                    this.loadingResults = false
                })
            },
            exportBills () {
                this.downloadingReport = true
                let data = {
                    from: this.from,
                    until: this.until,
                    includeCancelleds: this.includeCancelleds,          
                }
                this.$http.get('billings/bill-report/get-all-bills-to-excel', { params: data, responseType: 'blob' }).then( response => {
                    //window.open(URL.createObjectURL(response.data), '_blank')
                    download(response.data, 'Reporte-de-facturacion')
                    this.downloadingReport = false
                }).catch(() => {
                    this.downloadingReport = false
                })
            },
            formatDate (date) {
                return moment(date).format('DD-MMM-Y, h:mm a')
            }
        }
    }
</script>
