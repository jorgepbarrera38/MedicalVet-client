<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Citas</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="tile-title">Tablero de citas</h3>
            </div>
            <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <div class="table-responsive" v-else :style="`max-height: ${getHeightFromWindow}px;`">        

              <table class="table table-sm table-hover">
                    <thead>
                    <th nowrap>Propietario</th>
                    <th nowrap>Mascota</th>
                    <th>Consultorio</th>
                    <th>Actividad</th>
                    <th nowrap>Fecha inicio cita</th>
                    <th nowrap>Duración</th>
                    <th nowrap>Fecha fin cita</th>
                    <th nowrap>Estado</th>
                    <th></th>
                    </thead>
                    <tbody>
                    <tr v-for="appointment in allApointments" :key="'appointmentFromPet' + appointment.id" :title="appointment.observations ? appointment.observations : 'No hay observaciónes'">
                        <td nowrap>{{ appointment.pet.owner.identification + ' - ' + appointment.pet.owner.names + ' ' + appointment.pet.owner.surnames }}</td>
                        <td nowrap>{{ appointment.pet.name }}</td>
                        <td nowrap>{{ appointment.consultingroom.name }}</td>
                        <td nowrap>{{ appointment.activity.name }}</td>
                        <td nowrap>{{ formatDate(appointment.date_time_start) }}</td>
                        <td nowrap>{{ appointment.duration }} Minutos</td>
                        <td nowrap>{{ formatDate(appointment.date_time_finish) }}</td>
                        <td nowrap>
                        <div :class="{ badge:true, 
                                        'badge-info': appointment.state == 'PENDIENTE', 
                                        'badge-success': appointment.state == 'CUMPLIDA', 
                                        'badge-warning': appointment.state == 'INCUMPLIDA',
                                        'badge-danger': appointment.state == 'CANCELADA'
                                        }">
                            {{ appointment.state }}</div>
                        </td>
                        <td nowrap>
                        <button :disabled="!hasPermission('appointments.fulfill') || appointment.state != 'PENDIENTE' || appointment.fulfilling"
                            class="btn btn-success btn-sm mr-1" @click="fulfillAppointment(appointment)" title="Cumplir">
                            <span class="spinner-border spinner-border-sm ml-1" v-if="appointment.fulfilling"></span>
                            <i class="fa fa-fw fa-lg fa-check" v-else></i>
                        </button>
                        <button :disabled="!hasPermission('appointments.unfulfill') || appointment.state != 'PENDIENTE' || appointment.unFulfilling"
                            class="btn btn-info btn-sm mr-1" @click="unFulfillAppointment(appointment)" title="Incumplir">
                            <span class="spinner-border spinner-border-sm ml-1" v-if="appointment.unFulfilling"></span>
                            <i class="fa fa-fw fa-lg fa-clock-o" v-else></i>
                        </button>
                        <button :disabled="!hasPermission('appointments.cancel') || appointment.state != 'PENDIENTE'"
                            class="btn btn-danger btn-sm" @click="preCancelAppointment(appointment.id)" title="Cancelar">
                            <i class="fa fa-fw fa-lg fa-times-circle"></i>
                        </button>
                        </td>
                    </tr>
                    </tbody>
                </table>

            </div>
            <!--<pagination class="my-2" align="right" :limit="-1" :data="allApointments" @pagination-change-page="getAllAppointments">
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
                  <div class="alert alert-danger" v-if="errorsToCancelAppointment">
                    <li v-for="(error, index) in errorsToCancelAppointment" :key="'error' + index">
                      {{ error[0] }}
                    </li>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <select class="form-control" v-model="appointmentSelectedToDelete.reason_cancellation_id">
                  <option value="">Seleccione motivo de cancelación</option>
                  <option :value="reasonCancellation.id" v-for="reasonCancellation in reasonCancellations" :key="'reasonCancellations ' + reasonCancellation.id">
                    {{ reasonCancellation.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <vue-loading v-if="cancelingAppointment" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
              <div v-else>
                <button type="button" class="btn btn-secondary btn-sm mr-1" data-dismiss="modal">
                  <i class="fa fa-fw fa-lg fa fa-times-circle"></i>Cancelar
                </button>
                <button type="button" class="btn btn-primary btn-sm" @click="cancelAppointment">
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
        this.getAllAppointments()
        this.getReasonCancellations()
      },
      data() {
          return {
              allApointments: [],
              loading: true,
              errorsToCancelAppointment: null,
              appointmentSelectedToDelete: {
                    id: '',
                    reason_cancellation_id: ''
              },
              reasonCancellations: [],
              cancelingAppointment: false,
          }
      },
      methods: {
        getReasonCancellations () {
            this.$http.get('appointments/get-reason-cancellations').then( response => {
                this.reasonCancellations = response.data
            })
        },
        getAllAppointments (page = 1) {
            this.$http.get('appointments/get-all-appointments?page=' + page).then( response => {
                this.allApointments = response.data

                this.allApointments.forEach(appointment => {
                    this.$set(appointment, 'fulfilling', false);
                    this.$set(appointment, 'unFulfilling', false);
                })

                this.loading = false
            })
        },
        formatDate (date) {
            return moment(date).format('DD-MMM-Y, h:mm a')
        },

        fulfillAppointment (appointment) {
            appointment.fulfilling = true
            this.$http.put(`appointments/${appointment.id}/fulfill-appointment`).then( response => {
              this.getAllAppointments()
              this.$toastr.success('Cita actualizada como cumplida')
            }).catch( error => {
              appointment.fulfilling = false
              if (error.response.status == 422) {
                this.$toastr.error(error.response.data.errors.message)
              }
            })
          },
          unFulfillAppointment (appointment) {
            appointment.unFulfilling = true
            this.$http.put(`appointments/${appointment.id}/unfulfill-appointment`).then( response => {
              this.getAllAppointments()
              this.$toastr.success('Cita actualizada como incumplida')
            }).catch( error => {
              appointment.unFulfilling = false
              if (error.response.status == 422) {
                this.$toastr.error(error.response.data.errors.message)
              }
            })
          },
          cancelAppointment () {
            this.cancelingAppointment = true
            this.$http.put(`appointments/${ this.appointmentSelectedToDelete.id }/cancel-appointment`, { reason_cancellation_id: this.appointmentSelectedToDelete.reason_cancellation_id }).then( response => {
              this.getAllAppointments()
              $('#cancelAppointmentModal').modal('hide')
              this.errorsToCancelAppointment = null
              this.appointmentSelectedToDelete.id = appointment
              this.appointmentSelectedToDelete.reason_cancellation_id = ''
              this.cancelingAppointment = false
              this.$toastr.success('Cita actualizada como cancelada')
            }).catch( error => {
              this.cancelingAppointment = false
              if (error.response.status == 422) {
                this.errorsToCancelAppointment = error.response.data.errors
              }
            })
          },
          preCancelAppointment (appointmentId) {
            this.errorsToCancelAppointment = null
            this.appointmentSelectedToDelete.reason_cancellation_id = ''
            this.appointmentSelectedToDelete.id = appointmentId
            $('#cancelAppointmentModal').modal('show')
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