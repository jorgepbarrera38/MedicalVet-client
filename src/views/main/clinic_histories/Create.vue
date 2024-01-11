<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-file-text"></i> Historia clínica</h1>
            </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="tile">
              <h3 class="tile-title">Registro de historia clínica</h3>
              <SearchOwnersAndPets 
              @owner-and-pet-selected="ownerAndPetSelected"
              
              :disableFields="folioIsOpen"
              :clearData="!folioIsOpen"
              >
            </SearchOwnersAndPets>
            </div>
          </div>  
        </div>

        <ClinicHistoryCreateComponent :pet_id="pet_id" @folioOpened="folioOpened()" @folioClosed="folioClosed()"/>
    </div>
</template>

<script>
    import SearchOwnersAndPets from './../_components/SearchOwnersAndPets'
    import { VueLoading } from 'vue-loading-template'
    import moment from 'moment'
    import AnimateScroll from 'js-animate-scroll'
    import ClinicHistoryCreateComponent from './ClinicHistoryCreateComponent.vue'
    moment.locale('es')
    export default {
        name: 'clinic_history.create',
        components: {
          VueLoading, SearchOwnersAndPets, ClinicHistoryCreateComponent
        },
        data() {
            return {
              pet_id: '',
              folioIsOpen: false,
            }
        },
        methods: {
          ownerAndPetSelected(petId) {
              this.pet_id = petId
          },
          folioOpened () {
            this.folioIsOpen = true
          },
          folioClosed () {
            this.folioIsOpen = false
          }
        },
    }
</script>