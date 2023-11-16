<template>
    <div>
      <div class="app-title">
          <div>
            <h1><i class="fa fa-dashboard"></i> Dashboard</h1>
          </div>
      </div>
      <div class="row">
        <!--<div class="col-md-12" v-if="loadingData">
          <vue-loading type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
        </div>-->

        <template>
          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-3">
            <div @mouseover="shadowOwners = true"
                @mouseleave="shadowOwners = false"
              :class="{ 'widget-small': true, primary: true, 'coloured-icon': true, 'shadow  bg-white rounded': shadowOwners }" style="cursor:pointer" 
              @click="hasPermission('owners.index') ? $router.push({ name: 'owners.index' }) : $toastr.error('No tiene permisos para esta acción')">
              <i class="icon fa fa-users fa-3x"></i>
              <div class="info">
                <h4>Propietarios</h4>
                <p>
                  <span v-if="loadingData" class="spinner-border spinner-border-sm"></span>
                  <b v-else>{{ ownersQuantity }}</b>
                </p>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-3">
            <div @mouseover="shadowPets = true"
                @mouseleave="shadowPets = false"
              :class="{ 'widget-small': true, info: true, 'coloured-icon': true, 'shadow  bg-white rounded': shadowPets }" style="cursor:pointer" 
              @click="hasPermission('pets.index') ? $router.push({ name: 'pets.index' }) : $toastr.error('No tiene permisos para esta acción')">
              <i class="icon fa fa-paw fa-3x"></i>
              <div class="info">
                <h4>Mascotas</h4>
                <p>
                  <span v-if="loadingData" class="spinner-border spinner-border-sm"></span>
                  <b v-else>{{ petsQuantity }}</b>
                </p>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-3">
            <div @mouseover="shadowAppointments = true"
                @mouseleave="shadowAppointments = false"
              :class="{ 'widget-small': true, warning: true, 'coloured-icon': true, 'shadow  bg-white rounded': shadowAppointments }" style="cursor:pointer" 
              @click="hasPermission('appointments.store') ? $router.push({ name: 'appointments.index' }) : $toastr.error('No tiene permisos para esta acción')">
              <i class="icon fa fa-stethoscope fa-3x"></i>
              <div class="info">
                <h4>Citas</h4>
                <p>
                </p>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-3">
            <div @mouseover="shadowAppointmentsBoard = true"
                @mouseleave="shadowAppointmentsBoard = false"
              :class="{ 'widget-small': true, primary: true, 'coloured-icon': true, 'shadow  bg-white rounded': shadowAppointmentsBoard }" style="cursor:pointer" 
              @click="$router.push({ name: 'appointments.board' })">
              <i class="icon fa fa-list-alt fa-3x"></i>
              <div class="info">
                <h4>Tablero de citas</h4>
                <p>
                  
                  Pendientes hoy: <span v-if="loadingData" class="spinner-border spinner-border-sm"></span><b v-else>{{ appointmentsQuantity }}</b>
                </p>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-3">
            <div @mouseover="shadowClinicalHistories = true"
                @mouseleave="shadowClinicalHistories = false" 
                :class="{ 'widget-small': true, warning: true, 'coloured-icon': true, 'shadow  bg-white rounded': shadowClinicalHistories }" style="cursor:pointer" 
                @click="hasPermission('clinic-histories.store') ? $router.push({ name: 'clinic_histories.create' }) : $toastr.error('No tiene permisos para esta acción')">
              <i class="icon fa fa-file-text fa-3x"></i>
              <div class="info">
                <h4>Historias clínicas</h4>
                <p>
                  <span v-if="loadingData" class="spinner-border spinner-border-sm"></span>
                  <b v-else>{{ clinicHistoriesQuantity }}</b>
                </p>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-3">
            <div @mouseover="shadowBills = true"
                @mouseleave="shadowBills = false"
              :class="{ 'widget-small': true, primary: true, 'coloured-icon': true, 'shadow  bg-white rounded': shadowBills }" style="cursor:pointer" 
              @click="$router.push({ name: 'billing.pending_billing' })">
              <i class="icon fa fa-money fa-3x"></i>
              <div class="info">
                <h4>Facturación</h4>
                <p>Total mes: <span v-if="loadingData" class="spinner-border spinner-border-sm"></span><b v-else>${{ totalBillCurrentMonth | convertMoney }}</b></p>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-3">
            <div @mouseover="shadowPrescriptions = true"
                @mouseleave="shadowPrescriptions = false"
              :class="{ 'widget-small': true, info: true, 'coloured-icon': true, 'shadow  bg-white rounded': shadowPrescriptions }" style="cursor:pointer" 
              @click="$router.push({ name: 'reports.prescription' })">
              <i class="icon fa fa-list fa-3x"></i>
              <div class="info">
                <h4>Recetas veterinarias</h4>
                <!--<p>Pendientes hoy: <b></b></p>-->
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-3">
            <div @mouseover="shadowVaccines = true"
                @mouseleave="shadowVaccines = false"
              :class="{ 'widget-small': true, primary: true, 'coloured-icon': true, 'shadow  bg-white rounded': shadowVaccines }" style="cursor:pointer" 
              @click="$router.push({ name: 'clinic_histories.vaccine' })">
              <i class="icon fa fa-eyedropper fa-3x"></i>
              <div class="info">
                <h4>Vacuna y desparasitación</h4>
                <!--<p>Total mes: <b>${{ totalBillCurrentMonth | convertMoney }}</b></p>-->
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-3">
            <div @mouseover="shadowNextVaccines = true"
                @mouseleave="shadowNextVaccines = false" 
                :class="{ 'widget-small': true, danger: true, 'coloured-icon': true, 'shadow  bg-white rounded': shadowNextVaccines }" style="cursor:pointer" 
                @click="hasPermission('clinic-histories.store') ? showModalWithNextVaccines() : $toastr.error('No tiene permisos para esta acción')">
              <i class="icon fa fa-exclamation fa-3x"></i>
              <div class="info">
                <h4>Próximas vacunas</h4>
                <p>
                  <span v-if="loadingData" class="spinner-border spinner-border-sm"></span>
                  <span v-else>
                    Próximos 
                    <span v-if="daysAlertVaccines">{{ daysAlertVaccines }}</span>
                    <span v-else>7</span>
                    días:
                    <b>{{ vaccines.length }}</b>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-3">
            <div @mouseover="informedConsents = true"
                @mouseleave="informedConsents = false"
              :class="{ 'widget-small': true, warning: true, 'coloured-icon': true, 'shadow  bg-white rounded': informedConsents }" style="cursor:pointer" 
              @click="$router.push({ name: 'informed_consent.index' })">
              <i class="icon fa fa-pencil-square-o fa-3x"></i>
              <div class="info">
                <h4>Consentimientos informados</h4>
                <p>
                </p>
              </div>
            </div>
          </div>
          <!--inicio modal vacunas-->
          <div class="modal fade bd-example-modal-lg" id="nextVaccineModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    Vacunas próximos 
                    <span v-if="daysAlertVaccines">{{ daysAlertVaccines }}</span>
                    <span v-else>7</span>
                    días
                  </h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="table-responsive">        
                    <table class="table table-hover table-sm">
                      <thead>
                        <tr>
                          <th>Propietario</th>
                          <th>Teléfono</th>
                          <th>Mascota</th>
                          <th>Siguiente vacuna</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(vaccine, index) in vaccines" :key="index">
                          <td nowrap>{{ vaccine.pet.owner.identification + ' - ' + vaccine.pet.owner.names + ' ' + vaccine.pet.owner.surnames }}</td>
                          <td nowrap>
                            <a :href="`tel:${vaccine.pet.owner.phonenumber}`">{{ vaccine.pet.owner.phonenumber }}</a>
                          </td>
                          <td nowrap>{{ vaccine.pet.name }}</td>
                          <td nowrap>{{ formatDate(vaccine.nextDate) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
          <!--Fin modal vacunas-->
        </template>
      </div>
    </div>
</template>

<script>
    import hasPermission from '../_utilities/hasPermission'
    import moment from 'moment'
    import { VueLoading } from 'vue-loading-template'
    export default {
      mixins: [ hasPermission ],
      components: {
        VueLoading
      },
      created () {
        this.getData()
      },
      data() {
        return {
          petsQuantity: '',
          totalBillCurrentMonth: '',
          ownersQuantity: '',
          clinicHistoriesQuantity: '',
          appointmentsQuantity: '',
          vaccines: [],
          daysAlertVaccines: '',
          shadowOwners: false,
          shadowPets: false,
          shadowClinicalHistories: false,
          shadowBills: false,
          shadowPrescriptions: false,
          shadowVaccines: false,
          shadowNextVaccines: false,
          shadowAppointments: false,
          shadowAppointmentsBoard: false,
          informedConsents: false,
          loadingData: true,
        }
      },
      methods: {
        getData () {
          this.$http.get('dashboard/get-data').then( response => {
            this.vaccines = response.data.vaccines
            this.petsQuantity = response.data.petsQuantity
            this.totalBillCurrentMonth = response.data.totalBillCurrentMonth
            this.ownersQuantity = response.data.ownersQuantity
            this.clinicHistoriesQuantity = response.data.clinicHistoriesQuantity
            this.appointmentsQuantity = response.data.appointmentsQuantity
            this.daysAlertVaccines = response.data.daysAlertVaccines
            this.loadingData = false
          })
        },
        formatDate (date) {
          return moment(date).format('LL')
        },
        showModalWithNextVaccines () {
          $('#nextVaccineModal').modal('show')
        }
      },
    }
</script>