<template>
    <div class="tile">
        <div class="tile-title-w-btn">
            <h3 class="tile-title"><i class="fa fa-stethoscope"></i> Citas</h3>
            <button class="btn btn-secondary btn-sm" @click="showAppointmentCreateComponent = false" v-if="showAppointmentCreateComponent">
                <i class="fa fa-fw fa-lg fa fa-undo"></i>
            </button>
            <button class="btn btn-primary btn-sm" @click="showAppointmentCreateComponent = true" v-else>
                <i class="fa fa-fw fa-lg fa fa-plus"></i>
            </button>
        </div>
        
        <AppointmentCreateComponent :pet_id="pet_id" @appointmentSaved="$emit('appointmentSaved')" v-if="showAppointmentCreateComponent" />

        <!---->

        <div class="table-responsive" style="max-height: 220px;" v-else>
            <table class="table table-sm table-hover">
                <thead>
                <th>Consultorio</th>
                <th>Actividad</th>
                <th nowrap>Fecha inicio cita</th>
                <th nowrap>Fecha fin cita</th>
                <th nowrap>Estado</th>
                <!--<th></th>-->
                </thead>
                <tbody>
                <tr v-for="appointment in appointments" :key="'appointmentFromPet' + appointment.id" :title="appointment.observations ? appointment.observations : 'No hay observaciónes'">
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
                    <!--<td nowrap>
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
                    </td>-->
                </tr>
                </tbody>
            </table>
        </div>

        <!---->
        
    </div>
</template>
<script>
import moment from 'moment'
import AppointmentCreateComponent from '../../appointments/AppointmentCreateComponent.vue'
moment.locale('es')
    export default {
        props: [ 'pet_id', 'appointments' ],
        components: { AppointmentCreateComponent },
        data() {
            return {
                showAppointmentCreateComponent: false,
            }
        },
        methods: {
            formatDate (date) {
            //return date;
            return moment(date).format('DD-MMM-Y, h:mm a')
          },
        }
    }
</script>