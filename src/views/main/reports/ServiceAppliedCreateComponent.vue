<template>
  <div>
      <!--inicio modal vacunas-->
      <div class="modal fade bd-example-modal-lg" id="modalServicesApplied" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
              <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Servicio aplicado</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
              </div>
              <div class="modal-body">
                  <div class="alert alert-danger" v-if="errors">
                      <li v-for="(error, index) in errors" :key="index">
                          {{ error[0] }}
                      </li>
                  </div>
                  <!---->

                  <div class="row">
                    <div class="col-md-8">
                      <div class="form-group">
                        <label for="">Servicio (*)</label>
                        <v-select :options="servicesDB" label="codeAndName" v-model="serviceSelected"></v-select>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label for="">Cantidad (*)</label>
                        <input type="number" class="form-control" v-model="quantityServiceApplied">
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group">
                        <label for="">Observaciónes</label>
                        <input type="text" class="form-control" v-model="observationsServiceApplied" maxlength="1500">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label for=""></label>
                        <button class="btn btn-primary btn-sm" @click="addServiceApplied">
                          <i class="fa fa-plus"></i> Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="table-responsive">
                        <table class="table table-hover table-sm">
                          <thead>
                            <tr>
                              <th>Servicio</th>
                              <th>Cantidad</th>
                              <th>Observaciónes</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(service, index) in services" :key="'prodpet' + index">
                              <td nowrap>{{ service.name }}</td>
                              <td nowrap>{{ service.quantity }}</td>
                              <td nowrap>{{ service.observations }}</td>
                              <td nowrap>
                                <button class="btn btn-danger btn-sm" @click="deleteRegistry(index)">
                                  <i class="fa fa-fw fa-lg fa fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <!---->
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-primary btn-sm mr-1" @click="registerServicesApplied" :disabled="saving">
                      <i  class="fa fa-fw fa-lg fa fa-save"></i> Registrar <span v-if="saving" class="spinner-border spinner-border-sm ml-1"></span>
                  </button>
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
              </div>
          </div>
          </div>
      </div>
      <!--Fin modal vacunas-->
  </div>
</template>
<script>
import { VueLoading } from 'vue-loading-template'
export default {
  components: {
      VueLoading
  },
  props: [ 'pet_id' ],
  created() {
      this.getDataToRegisterProductsAndServicesApplied()
  },
  data() {
      return {
        serviceSelected: null,
        quantityServiceApplied: null,
        observationsServiceApplied: null,
        services: [],
        servicesDB: [],
        errors: null,
        saving: false,
      }
  },
  methods: {
    getDataToRegisterProductsAndServicesApplied () {
      this.$http.get(`reports/get-data-to-register-products-and-services-applied`).then( response => {
    
        this.servicesDB = response.data.services
        this.servicesDB.forEach(serviceDB => {
          this.$set(serviceDB, 'codeAndName', serviceDB.code + ' - ' + serviceDB.name)
        });

      })
    },
    registerServicesApplied () {
        if (!this.pet_id) {
          return this.$toastr.info('Seleccione mascota')
        }

        this.saving = true

        let data = new FormData()
        this.services.forEach((service, index) => {
          data.append(`services[${index}][service_id]`, service.service_id)
          data.append(`services[${index}][quantity]`, service.quantity)
          data.append(`services[${index}][observations]`, service.observations ? service.observations : '')
        })

        this.$http.post(`reports/register-services-applied/${this.pet_id}`, data ).then( response => {

            this.serviceSelected = null
            this.quantityServiceApplied = null
            this.observationsServiceApplied = null
            this.services = []
            this.errors = null
            this.saving = false
            this.$toastr.success('Servicios aplicados registrados')
            this.$emit('serviceAppliedRegistered')

        }).catch( error => {
          this.saving = false
            if (error.response.status == 422) {
              this.errors = error.response.data.errors
            } else {
              this.$toastr.error('Error al guardar')
            }
          })

    },
    addServiceApplied () {
        if (!this.serviceSelected || !this.quantityServiceApplied) {
          return this.$toastr.error('Diligencie los datos del servicio')
        }

        if (this.quantityServiceApplied <= 0 || this.quantityServiceApplied > 1000) {
          return this.$toastr.error('La cantidad debe ser estar entre 1 y 1000')
        }

        let data = {
          service_id: this.serviceSelected.id,
          name: this.serviceSelected.name,
          quantity: this.quantityServiceApplied,
          observations: this.observationsServiceApplied
        }
        this.services.push(data)
        this.serviceSelected = null
        this.quantityServiceApplied = null
        this.observationsServiceApplied = null
      },
      deleteRegistry (index) {
        this.services.splice(index, 1)
      },
  },
}
</script>