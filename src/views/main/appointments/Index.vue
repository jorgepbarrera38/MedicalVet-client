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
              <!--vue-loading v-if="loadingResults" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>-->         
            </div>
          </div>
      </div>
      
      <div class="row">
        <div class="col-md-12">
          <div class="tile">
           
            <AppointmentCreateComponent :pet_id="pet_id"/>

          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import SearchOwnersAndPets from './../_components/SearchOwnersAndPets'
  import { VueLoading } from 'vue-loading-template'
  import AppointmentCreateComponent from './AppointmentCreateComponent.vue'
    export default {
        components: {
          VueLoading, 
          SearchOwnersAndPets,
          AppointmentCreateComponent
        },
        data() {
            return {
                //loadingResults: false,
                pet_id: null
            }
        },
        methods: {
          petAndOwnerSelected(petId) {
            /*this.appointmentsFromPet = []
            this.appointment.pet_id = ''
            if (petId) {*/
              //this.searchingAppointmentsFromPet = true
              this.pet_id = petId
              //this.getAppointmentsFromPet()
            //}
          },
          
        },
    }
</script>