<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-stethoscope"></i> Citas</h1>
            </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="tile">
              <h3 class="tile-title">Asignación de citas</h3>
              <SearchOwnersAndPets 
                  @owner-and-pet-selected="petAndOwnerSelected">
                </SearchOwnersAndPets>
              <!--<div>
                <button class="btn btn-primary" @click="scheduleAppointment" :disabled="!appointment.pet_id">
                  <i class="fa fa-fw fa-lg fa-calendar-check-o"></i>Agregar cita
                </button>
              </div>-->
              <vue-loading v-if="loadingResults" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>           
            </div>
          </div>
      </div>
      
      <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="bs-component">
              <ul class="nav nav-tabs">
                <li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#home">Citas</a></li>
                <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#profile">Agenda de citas</a></li>
                
              </ul>
              <div class="tab-content" id="myTabContent">
                <!--Citas de la mascota-->
                <div class="tab-pane fade active show" id="home">
                  <div class="row mt-3">
                    <div class="col-md-12">
                      <vue-loading v-if="searchingAppointmentsFromPet" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                      <div class="table-responsive" v-else>
                        <table class="table table-sm table-hover">
                          <thead>
                            <th>Consultorio</th>
                            <th>Actividad</th>
                            <th nowrap>Fecha inicio cita</th>
                            <th nowrap>Fecha fin cita</th>
                            <th nowrap>Estado</th>
                          </thead>
                          <tbody>
                            <tr v-for="appointment in appointmentsFromPet" :key="'appointmentFromPet' + appointment.id" :title="appointment.observations ? appointment.observations : 'No hay observaciónes'">
                              <td nowrap>{{ appointment.consultingroom.name }}</td>
                              <td nowrap>{{ appointment.activity.name }}</td>
                              <td nowrap>{{ formatDate(appointment.date_time_start) }}</td>
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
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <!--Fin citas de la mascota-->
                <!--Agenda de citas-->
                <!-- Modal agendar cita -->
                <div class="modal fade bd-example-modal-lg" id="appointmentModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Agregar cita</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <div class="row">
                          <div class="col-md-12">
                            <div class="alert alert-danger" v-if="errors">
                              <li v-for="(error, index) in errors" :key="'error' + index">
                                {{ error[0] }}
                              </li>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-4">
                            <div class="form-group">
                              <label for="">Fecha (*)</label>
                              <input type="datetime-local" class="form-control" v-model="appointment.date_time_start">
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-group">
                              <label for="">Consultorio (*)</label>
                              <select class="form-control" v-model="appointment.consultingroom_id">
                                <option value="">Seleccione consultorio</option>
                                <option :value="consultingroom.id" v-for="consultingroom in consultingrooms" :key="'consultingroom-' + consultingroom.id">
                                  {{ consultingroom.name }}
                                </option>
                              </select>
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-group">
                              <label for="">Actividad (*)</label>
                              <select class="form-control" v-model="activitySelected">
                                <option :value="{ id: '', name: '', duration: '' }">Seleccione actividad</option>
                                <option :value="activity" v-for="activity in activities" :key="'activity-' + activity.id">
                                  {{ activity.name }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                              <div class="form-group">
                                <label for="">Duración en minutos (*)</label>
                                <input type="number" class="form-control" v-model="appointment.duration">
                              </div>
                            </div>
                            <div class="col-md-12">
                              <div class="form-group">
                                <label for="">Observaciónes</label>
                                <textarea rows="3" class="form-control" maxlength="300" v-model="appointment.observations"></textarea>
                              </div>
                            </div>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <vue-loading v-if="savingAppointment" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                        <div v-else>
                          <button type="button" class="btn btn-secondary btn-sm mr-1" data-dismiss="modal">Cerrar</button>
                          <button type="button" class="btn btn-primary btn-sm" @click="saveAppointment">Guardar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Fin modal agendar cita -->
                <div class="tab-pane fade" id="profile">
                  <div class="row">
                    <div class="col-sm-12 col-md-12 col-lg-4 mt-3">
                        <!--<h4 class="tile-title">Asignación</h4>-->
                        <v-date-picker is-expanded v-model="date"/>
                    </div>
                    <div class="col-sm-12 col-md-12 col-lg-8 mt-3">
                      <!--
                        <div class="tile-title-w-btn">
                          <button @click="searchingAppointments = true; getAppointments()"
                            class="btn btn-primary btn-sm">
                            <i class="fa fa-fw fa-lg fa-refresh"></i>
                          </button>
                        </div>
                        -->
                        <div class="row mb-2">
                          <div class="col-md-4">
                            <input type="text" class="form-control" placeholder="Buscar propietario o mascota" v-model="searchAppointment">
                          </div>
                          <div class="col-md-4">
                              <select name="" class="form-control" v-model="consultingroomSearchAppointment">
                                  <option v-for="consultingroom in consultingrooms" :value="consultingroom.id" :key="`consultingroomlist-${consultingroom.id}`">
                                    {{ consultingroom.name }}
                                  </option>
                              </select>
                          </div>
                        </div>
                        <vue-loading v-if="searchingAppointments" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                        <div class="table-responsive" v-else style="max-height: 350px;">
                          <table class="table table-sm table-hover">
                            <thead>
                              <th>Propietario</th>
                              <th>Mascota</th>
                              <th>Consultorio</th>
                              <th>Actividad</th>
                              <th nowrap>Fecha inicio cita</th>
                              <th nowrap>Fecha fin cita</th>
                              <th></th>
                            </thead>
                            <tbody>
                              <!--v-if="!appointmentsFiltered.length"-->
                                <tr class="table-success" style="cursor:pointer" 
                                  @click="openScheduleFromAppointment(date, consultingroomSearchAppointment)">
                                  <td colspan="8">
                                        Agregar cita
                                  </td>
                                </tr>
                                <template v-for="(appointment, index) in appointmentsFiltered">
                                  <tr :key="'appointment' + appointment.id" :title="appointment.observations ? appointment.observations : 'No hay observaciónes'">
                                    <td nowrap>{{ appointment.pet.owner.identification + ' - ' + appointment.pet.owner.names + ' ' + appointment.pet.owner.surnames }}</td>
                                    <td nowrap>{{ appointment.pet.name }}</td>
                                    <td nowrap>{{ appointment.consultingroom.name }}</td>
                                    <td nowrap>{{ appointment.activity.name }}</td>
                                    <td nowrap>{{ formatDate(appointment.date_time_start) }}</td>
                                    <td nowrap>{{ formatDate(appointment.date_time_finish) }}</td>
                                    <td nowrap>
                                      <button :disabled="!hasPermission('appointments.fulfill')"
                                        class="btn btn-success btn-sm" @click="fulfillAppointment(appointment.id)" title="Cumplir">
                                        <i class="fa fa-fw fa-lg fa-check"></i>
                                      </button>
                                      &nbsp;&nbsp;&nbsp;
                                      <button :disabled="!hasPermission('appointments.unfulfill')"
                                        class="btn btn-info btn-sm" @click="unFulfillAppointment(appointment.id)" title="Incumplir">
                                        <i class="fa fa-fw fa-lg fa-clock-o"></i>
                                      </button>
                                      &nbsp;&nbsp;&nbsp;
                                      <button :disabled="!hasPermission('appointments.cancel')"
                                        class="btn btn-danger btn-sm" @click="preCancelAppointment(appointment.id)" title="Cancelar">
                                        <i class="fa fa-fw fa-lg fa-times-circle"></i>
                                      </button>
                                    </td>
                                  </tr>
                                  <tr :key="'appointment2-' + appointment.id" class="table-success" style="cursor:pointer" v-if="appointmentsFiltered[index + 1] ? appointmentsFiltered[index].date_time_finish != appointmentsFiltered[index + 1].date_time_start : true"
                                    @click="openScheduleFromAppointment(appointmentsFiltered[index].date_time_finish, appointment.consultingroom_id)">
                                    <td colspan="8">
                                          {{ formatDate(appointmentsFiltered[index].date_time_finish) }}  
                                          <span v-if="appointmentsFiltered[index + 1]">
                                            - {{ formatDate(appointmentsFiltered[index + 1].date_time_start) }}
                                          </span>
                                    </td>
                                  </tr>
                                </template>
                                
                            </tbody>
                          </table>
                        </div>
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
                <!--Agenda de citas-->
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
</template>

<script>
  import SearchOwnersAndPets from './../_components/SearchOwnersAndPets'
  import { VueLoading } from 'vue-loading-template'
  import moment from 'moment'
  import hasPermission from '../_utilities/hasPermission'
  import { error } from 'toastr'
    moment.locale('es')
    export default {
      mixins: [ hasPermission ],
        components: {
          VueLoading, 
          SearchOwnersAndPets
        },
        created () {
          this.getAppointments()
          this.getDataToCreateAppointment()
          this.getReasonCancellations()
          this.appointment.date_time_start = moment(this.date).format('YYYY-MM-DD') + 'T00:00'
        },
        data() {
            return {
                loadingResults: false,
                date: new Date(),
                appointment: {
                  date_time_start: '',
                  pet_id: '',
                  consultingroom_id: '',
                  activity_id: '',
                  duration: '',
                  observations: ''
                },
                appointmentSelectedToDelete: {
                  id: '',
                  reason_cancellation_id: ''
                },
                cancelingAppointment: false,
                errors: null,
                errorsToCancelAppointment: null,
                consultingrooms: [],
                activities: [],
                activitySelected: {
                  id: '',
                  name: '',
                  duration: ''
                },
                savingAppointment: false,
                appointments: [],
                reasonCancellations: [],
                searchingAppointments: true,
                appointmentsFromPet: [],
                searchingAppointmentsFromPet: false,
                searchAppointment: '',
                consultingroomSearchAppointment: 1
            }
        },
        methods: {

          getReasonCancellations () {
            this.$http.get('appointments/get-reason-cancellations').then( response => {
              this.reasonCancellations = response.data
            })
          },
          getDataToCreateAppointment () {
            this.$http.get('appointments/get-data-to-create-appointment').then( response => {
              this.consultingrooms = response.data.consultingrooms
              this.activities = response.data.activities
            })
          },
          getAppointments () {
            let date = moment(this.date).format('YYYY-MM-DD')
            this.$http.get(`appointments`, { params: { date } }).then( response => {
            this.appointments = response.data.map( appointment => {
                appointment.pet.owner.fullNames = appointment.pet.owner.names + ' ' + appointment.pet.owner.surnames
                return appointment
            })

              this.searchingAppointments = false
            }).catch( error => {
              this.searchingAppointments = false
            })
          },
          saveAppointment () {
            this.savingAppointment = true

            this.$http.post('appointments', this.appointment).then( response => {
              this.getAppointments()
              this.getAppointmentsFromPet()
              $('#appointmentModal').modal('hide')
              this.$toastr.success('Cita asignada')
              this.savingAppointment = false
              this.clearData()
            }).catch( error => {
              this.savingAppointment = false
              if (error.response.status == 422) {
                this.errors = error.response.data.errors
              }
            })
          },
          clearData () {
            //this.appointment.date_time_start = ''
            this.appointment.consultingroom_id = ''
            this.appointment.observations = ''
            this.appointment.activity_id = ''
            this.appointment.duration = ''
            this.activitySelected = {
                  id: '',
                  name: '',
                  duration: ''
            }
            this.errors = null
            this.savingAppointment = false      
          },
          scheduleAppointment () {
            $('#appointmentModal').modal('show')
          },
          fulfillAppointment (appointment) {
            this.$http.put(`appointments/${appointment}/fulfill-appointment`).then( response => {
              this.getAppointments()
              this.getAppointmentsFromPet()
              this.$toastr.success('Cita actualizada como cumplida')
            }).catch( error => {
              if (error.response.status == 422) {
                this.$toastr.error(error.response.data.errors.message)
              }
            })
          },
          unFulfillAppointment (appointment) {
            this.$http.put(`appointments/${appointment}/unfulfill-appointment`).then( response => {
              this.getAppointments()
              this.getAppointmentsFromPet()
              this.$toastr.success('Cita actualizada como incumplida')
            }).catch( error => {
              if (error.response.status == 422) {
                this.$toastr.error(error.response.data.errors.message)
              }
            })
          },
          cancelAppointment () {
            this.cancelingAppointment = true
            this.$http.put(`appointments/${ this.appointmentSelectedToDelete.id }/cancel-appointment`, { reason_cancellation_id: this.appointmentSelectedToDelete.reason_cancellation_id }).then( response => {
              this.getAppointments()
              this.getAppointmentsFromPet()
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
          preCancelAppointment (appointment) {
            this.errorsToCancelAppointment = null
            this.appointmentSelectedToDelete.reason_cancellation_id = ''
            this.appointmentSelectedToDelete.id = appointment
            $('#cancelAppointmentModal').modal('show')
          },
          petAndOwnerSelected(petId) {
            this.appointment.pet_id = petId
            this.getAppointmentsFromPet()
          },
          getAppointmentsFromPet () {
            if (this.appointment.pet_id) {
              this.searchingAppointmentsFromPet = true
              this.$http.get(`appointments/${ this.appointment.pet_id }/get-appointments`).then( response => {
                this.searchingAppointmentsFromPet = false
                this.appointmentsFromPet = response.data
              }).catch(() => {
                this.searchingAppointmentsFromPet = false
              })
            } else {
              this.appointmentsFromPet = []
            }
          },
          setStateFromLoading (payload) {
            //this.loadingResults = payload
          },
          formatDate (date) {
            //return date;
            return moment(date).format('DD-MMM-Y, h:mm a')
          },
          openScheduleFromAppointment (date, consultingroomId) {
            if (!this.appointment.pet_id) {
              return this.$toastr.error('Debe seleccionar una mascota')
            }
            this.appointment.consultingroom_id = consultingroomId
            this.appointment.date_time_start = moment(date).format('YYYY-MM-DDTHH:mm')
            this.scheduleAppointment()
          }
        },
        computed: {
          appointmentsFiltered () {
            return this.appointments.filter(appointment => {
              return appointment.consultingroom_id == this.consultingroomSearchAppointment &&  (appointment.pet.owner.identification.includes(this.searchAppointment.trim()) || appointment.pet.owner.fullNames.toLowerCase().includes(this.searchAppointment.toLowerCase().trim()) || appointment.pet.name.toLowerCase().includes(this.searchAppointment.toLowerCase().trim()))
            })
          }
        },
        watch: {
          date(newValue, oldValue) {
            this.searchingAppointments = true
            this.getAppointments()
            this.appointment.date_time_start = moment(newValue).format('YYYY-MM-DD') + 'T00:00'
          },
          activitySelected (newValue, oldValue) {
            this.appointment.activity_id = newValue.id
            this.appointment.duration = newValue.duration
          }
        },
    }
</script>