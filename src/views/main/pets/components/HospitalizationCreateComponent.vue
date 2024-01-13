<template>
    <div>
      <div class="modal fade" id="hospitalizeModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Hospitalizar mascota</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                
                <div class="row">
                  <div class="col-md-12">
                    <div class="alert alert-danger" v-if="errors">
                      <li v-for="(error, index) in errors" :key="index">
                        {{ error[0] }}
                      </li>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="">Fecha y hora de hospitalización (*)</label>
                      <input type="datetime-local" class="form-control" v-model="newHospitalization.initial_date">
                    </div>
                  </div>
                  <div class="col-md-8">
                    <div class="form-group">
                      <label for="">Servicio (*)</label>
                      <v-select :options="services" label="codeAndName" :reduce="service => service.id" v-model="newHospitalization.service_id"></v-select>
                    </div>
                  </div>
                </div>
                
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary btn-sm mr-1" @click="saveHospitalization" :disabled="savingHospitalization">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i> Guardar <span v-if="savingHospitalization" class="spinner-border spinner-border-sm ml-1"></span>
              </button>
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import moment, { relativeTimeThreshold } from 'moment'
moment.locale('es')
    export default {
        props: ['pet_id'],
        created () {
          this.getDataToHospitalizePet()
        },
        data() {
            return {
              newHospitalization: {
                initial_date: '',
                service_id: '',
              },
              services: [],
              savingHospitalization: false,
              errors: null
            }
        },
        methods: {
          getDataToHospitalizePet () {
            this.$http.get('hospitalizations/get-data-to-hospitalize-pet').then( response => {
              this.services = response.data.services
              this.services.forEach(service => {
                  this.$set(service, 'codeAndName', service.code + ' - ' + service.name)
              });
            })
          },
          saveHospitalization () {
            this.savingHospitalization = true
            
            this.$http.post(`hospitalizations/${this.pet_id}/hospitalize-pet`, this.newHospitalization).then( response => {
              this.savingHospitalization = false
              
                this.$toastr.success('Mascota hospitalizada')

                this.newHospitalization = {
                  initial_date: '',
                  service_id: '',
                }
                this.savingHospitalization = false
                this.errors = null

                this.$emit('petHospitalized')
            }).catch( error => {
                this.savingHospitalization = false
                if (error.response.status == 422) {
                  this.errors = error.response.data.errors
                } else {
                  this.$toastr.error('La mascota no se pudo hospitalizar')
                }
              })

          }
        }
    }
</script>