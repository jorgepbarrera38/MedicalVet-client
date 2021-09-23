<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-file-text"></i> Citas</h1>
            </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="tile">
              <h3 class="tile-title">Reporte de citas</h3>
              <div class="form-group">
                  <label for="">Fecha inicio</label>
                  <input type="date" class="form-control" v-model="from">
              </div>
              <div class="form-group">
                  <label for="">Fecha fin</label>
                  <input type="date" class="form-control" v-model="until">
              </div>              
              <div class="form-group">
                  <div class="table-responsive">
                    <table class="table table-sm">
                        <tr>
                            <td nowrap colspan="2">
                                <button class="btn btn-default btn-sm" @click="selectAll">
                                    Todos
                                </button>
                                <button class="btn btn-default btn-sm" @click="unSelectAll">
                                    Ninguno
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td nowrap>
                                <input type="checkbox" v-model="pending"> Pendiente
                            </td>
                            <td nowrap>
                                <input type="checkbox" v-model="fulfilled"> Cumplida
                            </td>
                        </tr>
                        <tr>
                            <td nowrap>
                                <input type="checkbox" v-model="unFulfilled"> Incumplida 
                            </td>
                            <td nowrap>
                                <input type="checkbox" v-model="cancelled"> Cancelada
                            </td>
                        </tr>
                    </table>
                </div>
              </div>
              <div>
                <button :disabled="loadingResults || !from || !until || (!pending && !fulfilled && !unFulfilled && !cancelled) " 
                  @click="getAppointments"  
                  class="btn btn-primary">
                  <i class="fa fa-fw fa-lg fa-search"></i>Consultar
                </button>
              </div>
            </div>
          </div>
            <div class="col-md-8">
                <div class="tile" style="max-height:100%">
                    <div class="tile-title-w-btn">
                        <h3 class="title">Resultados</h3>
                        <button :disabled="!hasPermission('appointments.report-appointments-export') || downloadingReport || !appointments.length || !from || !until || (!pending && !fulfilled && !unFulfilled && !cancelled) "
                            @click="exportAppointments"
                            class="btn btn-success btn-sm">
                            <i class="fa fa-fw fa-lg fa-file-pdf-o"></i>Exportar
                            <span v-if="downloadingReport" class="spinner-border spinner-border-sm"></span>
                        </button>
                    </div>
                    <vue-loading v-if="loadingResults" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                    <div class="table-responsive" v-else>
                        <table class="table table-hover table-sm">
                            <thead>
                                <th>Fecha cita</th>
                                <th>Propietario</th>
                                <th>Mascota</th>
                                <th>Consultorio</th>
                                <th>Actividad</th>
                                <th>Duración</th>
                                <th>Estado</th>
                                <th nowrap>Motivo de cancelación</th>
                            </thead>
                            <tbody>
                                <tr v-for="appointment in appointments" :key="'appointment-report' + appointment.id" :title="appointment.observations ? appointment.observations : 'No hay observaciónes'">
                                    <td nowrap>{{ formatDate(appointment.date_time_start) }}</td>
                                    <td nowrap>{{ appointment.pet.owner.identification + ' - ' + appointment.pet.owner.names + ' ' + appointment.pet.owner.surnames }}</td>
                                    <td nowrap>{{ appointment.pet.name }}</td>
                                    <td nowrap>{{ appointment.consultingroom.name }}</td>
                                    <td nowrap>{{ appointment.activity.name }}</td>
                                    <td nowrap>{{ appointment.duration }}</td>
                                    <td nowrap>
                                        <div :class="{ badge: true, 'badge-info': appointment.state == 'PENDIENTE', 'badge-danger': appointment.state == 'CANCELADA', 'badge-success': appointment.state == 'CUMPLIDA', 'badge-warning': appointment.state == 'INCUMPLIDA' }">
                                            <!--<i :class="{ fa:true, 'fa-fw':true, 'fa-lg': true, 'fa-clock-o': appointment.state == 'PENDIENTE', 'fa-check': appointment.state == 'CUMPLIDA', 'fa-times-circle': appointment.state == 'CANCELADA' }"></i>-->
                                            {{ appointment.state }}
                                        </div>
                                    </td>
                                    <td nowrap>
                                        <span v-if="appointment.state == 'CANCELADA'">
                                            {{ appointment.reason_cancellation.name }}
                                        </span>
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
    import hasPermission from '../../_utilities/hasPermission'
    import { VueLoading } from 'vue-loading-template'
    import moment from 'moment'
    moment.locale('es')
    export default {
        mixins: [ hasPermission ],
        components: {
          VueLoading
        },
        data() {
            return {
                from: '',
                until: '',
                pending: false,
                fulfilled: false,
                unFulfilled: false,
                cancelled: false,
                loadingResults: false,
                appointments: [],
                downloadingReport: false
            }
        },
        methods: {
            getAppointments () {
                this.loadingResults = true
                let data = {
                    from: this.from,
                    until: this.until,
                    pending: this.pending,
                    fulfilled: this.fulfilled,
                    unFulfilled: this.unFulfilled,
                    cancelled: this.cancelled,
                }
                this.$http.get('appointments/reports/get-appointments', { params: data }).then( response => {
                    this.loadingResults = false
                    this.appointments = response.data
                }).catch(() => {
                    this.loadingResults = false
                })
            },
            exportAppointments () {
                this.downloadingReport = true
                let data = {
                    from: this.from,
                    until: this.until,
                    pending: this.pending,
                    fulfilled: this.fulfilled,
                    unFulfilled: this.unFulfilled,
                    cancelled: this.cancelled,
                }
                this.$http.get('appointments/reports/get-appointments-to-pdf', { params: data, responseType: 'blob' }).then( response => {
                    window.open(URL.createObjectURL(response.data), '_blank')
                    this.downloadingReport = false
                }).catch(() => {
                    this.downloadingReport = false
                })
            },
            selectAll () {
                this.pending = true
                this.fulfilled = true
                this.unFulfilled = true
                this.cancelled = true
            },
            unSelectAll () {
                this.pending = false
                this.fulfilled = false
                this.unFulfilled = false
                this.cancelled = false
            },
            formatDate (date) {
                return moment(date).format('DD-MMM-Y, h:mm a')
            }
        }
    }
</script>
