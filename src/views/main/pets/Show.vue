<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-paw"></i> Mascotas</h1>
            </div>
        </div>
        <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>

        <div class="row" v-else>
          <div class="col-md-4">

            <div class="tile">
              <div class="tile-title-w-btn">
                <h3 class="tile-title">Información de la mascota</h3>
                <button
                  @click="$router.back()"
                  class="btn btn-secondary btn-sm">
                  <i class="fa fa-fw fa-lg fa-undo"></i>Atrás
                </button>
              </div>
                  
              <div>
                <div class="row">
                  <div class="col-md-12">
                    <b>Propietario: </b> {{ pet.owner.identification + ' - ' + pet.owner.names + ' ' + pet.owner.surnames }}
                    <hr>
                  </div>
                  <div class="col-md-4">
                    <img style="border-radius:10%"
                              width="100%" :src="pet.photo ? $APP_URL + pet.photo : avatarPet" alt="">
                  </div>
                  <div class="col-md-8">
                    <b>Nombre: </b> {{ pet.name }}
                    <hr>
                    <b>Especie: </b> {{ pet.species.name }}
                    <hr>
                    <b>Raza: </b> {{ pet.race.name }}
                    <hr>
                    <b>Sexo: </b> {{ pet.sex }}
                    <hr>
                  </div>
                  <div class="col-md-12">
                    <b>Fecha nac: </b> {{ pet.date_born }}
                    <hr>
                    <b>Color: </b> {{ pet.color }}
                    <hr>
                    <b>Tamaño: </b> {{ pet.size }}
                    <hr>
                    <b>Observaciónes: </b> {{ pet.observations }}
                    <hr>
                  </div>
                </div>


              </div>
                  <!--<button @click="getPet">Update</button>-->
          </div>

          <Record :records="pet.records" />
          <Attachment :clinicHistoryAttachments="pet.clinicHistoryAttachments" />

        </div>
        <div class="col-md-8">
          <div class="row">
            
            <div class="col-md-12">
              <Appointment :appointments="pet.appointments" />
            </div>
            <div class="col-md-12">
              <Prescription :prescriptions="pet.prescriptions" :pet_id="pet.id" />
            </div>
            <div class="col-md-12">
              <Vaccine :vaccines="pet.vaccines" :dewormings="pet.dewormings" />
            </div>
            <div class="col-md-12">
              <ProductServiceApplied :products_applied="pet.products_applied" :services_applied="pet.services_applied" />
            </div>
            <div class="col-md-12">
              <ClinicHistory :clinicHistories="pet.clinicHistories" :pet_id="pet.id" />
            </div>

          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    import moment from 'moment'
    import Appointment from './components/Appointment.vue'
    import Prescription from './components/Prescription.vue'
    import Vaccine from './components/Vaccine.vue'
    import ProductServiceApplied from './components/ProductServiceApplied.vue'
    import Record from './components/Record.vue'
    import Attachment from './components/Attachment.vue'
    import ClinicHistory from './components/ClinicHistory.vue'
    moment.locale('es')    
    export default {
      components: {
        VueLoading, Appointment, Prescription, Vaccine, ProductServiceApplied, Record, Attachment, ClinicHistory
      },
      created () {
          this.getPet()
      },
      data() {
          return {
              pet: {},
              loading: true,
              avatarPet: 'img/avatar_pet.jpg'
          }
      },
      methods: {
        getPet () {
          this.$http.get(`pets/${ this.$route.params.id }`).then( response => {
            this.pet = response.data
            this.pet.prescriptions.forEach(prescription => {
              this.$set(prescription, 'exportingPrescriptionInPdf', false)
            });
            console.log(this.pet);
            this.loading = false
          }).catch( () => {
            this.loading = false
          })
        },
      },
    }
</script>

<style scoped>
hr {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>