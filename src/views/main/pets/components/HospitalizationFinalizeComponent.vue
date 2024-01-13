<template>
    <div>
      <div class="modal fade" id="finalizeHospitalizationModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Dar egreso a la mascota</h5>
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
                  <div class="col-md-12">
                    <b>Fecha y hora de hospitalización: </b> <br>
                    {{ formatDate(hospitalizationInfoFromPet.initial_date) }} <br> <br>
                    <div class="form-group">
                      <label for="">Fecha y hora de egreso (*)</label>
                      <input type="datetime-local" class="form-control" v-model="hospitalization.final_date">
                    </div>
                    <b>Estancia total:</b> <br>
                    {{ hospitalization.quantity_hours }} hora(s)
                  </div>
                </div>
                
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary btn-sm mr-1" @click="finalizeHospitalization" :disabled="saving">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i> Guardar <span v-if="saving" class="spinner-border spinner-border-sm ml-1"></span>
              </button>
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
    import moment from 'moment'
    moment.locale('es') 

    export default {
        props: ['pet_id', 'hospitalizationInfoFromPet'],
        created () {
        },
        data() {
            return {
              hospitalization: {
                final_date: '',
                quantity_hours: 0,
              },
              saving: false,
              errors: null
            }
        },
        methods: {
          finalizeHospitalization () {
            this.saving = true
            
            this.$http.post(`hospitalizations/${this.pet_id}/finalize-hospitalization`, this.hospitalization).then( response => {
              this.saving = false
              
                this.$toastr.success('Egreso de la mascota realizada')

                this.hospitalization = {
                  final_date: '',
                }
                this.saving = false
                this.errors = null

                this.$emit('hospitalizationFinished')
            }).catch( error => {
                this.saving = false
                if (error.response.status == 422) {
                  this.errors = error.response.data.errors
                } else {
                  
                }
              })
          },
          formatDate (date) {
            return moment(date).format('DD-MMM-Y, h:mm a')
          },
        },
        watch: {
          'hospitalization.final_date' () {
            var fechaInicio = new Date(this.hospitalizationInfoFromPet.initial_date).getTime();
            var fechaFin    = new Date(this.hospitalization.final_date).getTime();

            var diff = fechaFin - fechaInicio;

            //console.log(Math.round(diff/(1000*60*60)));
            this.hospitalization.quantity_hours = Math.round(diff/(1000*60*60))
          }
        }
    }
</script>