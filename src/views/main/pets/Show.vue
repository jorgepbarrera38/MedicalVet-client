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
                
                <div class="btn-group">
                  <button
                      @click="refreshingInfoFromPet = true; getPet()" :disabled="refreshingInfoFromPet"
                      class="btn btn-primary btn-sm mr-1">
                      <span v-if="refreshingInfoFromPet" class="spinner-border spinner-border-sm"></span>
                      <i class="fa fa-fw fa-lg fa-refresh" v-else></i>
                    </button>
                  <button
                    @click="$router.back()"
                    class="btn btn-secondary btn-sm">
                    <i class="fa fa-fw fa-lg fa-undo"></i>Atrás
                  </button>
                </div>
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
                  <div class="col-md-12">
                    <button v-if="!pet.hospitalization"
                      @click="showModalToHospitalizePet()"
                      class="btn btn-primary btn-sm mr-1">
                      <i class="fa fa-fw fa-lg fa-hospital-o"></i>Hospitalizar
                    </button>

                    
                    <div class="alert alert-success mb-0" v-if="pet.hospitalization">
                      <h5>Mascota hospitalizada</h5>
                      <b>Fecha y hora hospit: </b>{{ formatDate(pet.hospitalization.initial_date) }}
                      <div class="mb-3">
                        <b>Servicio: </b>{{ pet.hospitalization.service.code + ' - ' + pet.hospitalization.service.name }}
                      </div>

                      <button v-if="pet.hospitalization"
                        @click="showModalToEditHospitalizePet()"
                        class="btn btn-primary btn-sm mr-1">
                        <i class="fa fa-fw fa-lg fa-edit"></i>Editar
                      </button>
                      
                      <button @click="showModalToFinalizeHospitalization()"
                          class="btn btn-primary btn-sm ">
                          <i class="fa fa-fw fa-lg fa-sign-out"></i>Dar egreso
                        </button>
                    </div>
                    
                    <HospitalizationCreateComponent :pet_id="pet.id" @petHospitalized="petHospitalized()"/>
                    <HospitalizationEditComponent :pet_id="pet.id" :hospitalizationInfoFromPet="pet.hospitalization" @hospitalizationUpdated="hospitalizationUpdated()"/>
                    <HospitalizationFinalizeComponent :pet_id="pet.id" :hospitalizationInfoFromPet="pet.hospitalization" @hospitalizationFinished="hospitalizationFinished()"/>
                  </div>
                </div>


              </div>
                  <!--<button @click="getPet">Update</button>-->
          </div>

          
          <Hospitalization :hospitalizations="pet.hospitalizations" />
          <Record :records="pet.records" />
          <Diagnosis :diagnoses="pet.diagnoses" />
          <Attachment :clinicHistoryAttachments="pet.clinicHistoryAttachments" />

        </div>
        <div class="col-md-8">
          <div class="row">
            
            <div class="col-md-12">
              <Appointment :appointments="pet.appointments" :pet_id="pet.id" @appointmentSaved="getPet()" />
            </div>
            <div class="col-md-12">
              <Prescription :prescriptions="pet.prescriptions" :pet_id="pet.id" @prescriptionSaved="getPet()"/>
            </div>
            <div class="col-md-12">
              <Vaccine :vaccines="pet.vaccines" :dewormings="pet.dewormings" :pet_id="pet.id" @vaccineRegistered="getPet()" @dewormingRegistered="getPet()"/>
            </div>
            <div class="col-md-12">
              <ProductServiceApplied :products_applied="pet.products_applied" :services_applied="pet.services_applied" :pet_id="pet.id" 
                          @productAppliedRegistered="getPet()"
                          @serviceAppliedRegistered="getPet()"/>
            </div>
            <div class="col-md-12">
              <ClinicHistory :clinicHistories="pet.clinicHistories" :pet_id="pet.id" @clinicHistorySaved="getPet()"/>
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
    import Diagnosis from './components/Diagnosis.vue'
    import HospitalizationCreateComponent from './components/HospitalizationCreateComponent.vue'
    import HospitalizationFinalizeComponent from './components/HospitalizationFinalizeComponent.vue'
    import HospitalizationEditComponent from './components/HospitalizationEditComponent.vue'
    import Hospitalization from './components/Hospitalization.vue'

    moment.locale('es')    
    export default {
      components: {
        VueLoading, Appointment, Prescription, Vaccine, 
        ProductServiceApplied, Record, Attachment, 
        ClinicHistory, Diagnosis, HospitalizationCreateComponent, 
        HospitalizationFinalizeComponent, HospitalizationEditComponent, Hospitalization
      },
      created () {
          this.getPet()
      },
      data() {
          return {
              pet: {},
              refreshingInfoFromPet: false,
              loading: true,
              avatarPet: 'img/avatar_pet.jpg',
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
            this.refreshingInfoFromPet = false
          }).catch( () => {
            this.loading = false
          })
        },
        showModalToHospitalizePet () {
          $('#hospitalizeModal').modal('show')
        },
        petHospitalized () {
          this.getPet()
          $('#hospitalizeModal').modal('hide')
        },
        showModalToEditHospitalizePet () {
          $('#hospitalizeEditModal').modal('show')
        },
        hospitalizationUpdated () {
          this.getPet()
          $('#hospitalizeEditModal').modal('hide')
        },
        showModalToFinalizeHospitalization () {
          $('#finalizeHospitalizationModal').modal('show')
        },
        hospitalizationFinished () {
          this.getPet()
          $('#finalizeHospitalizationModal').modal('hide')
        },
        formatDate (date) {
            //return date;
            return moment(date).format('DD-MMM-Y, h:mm a')
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