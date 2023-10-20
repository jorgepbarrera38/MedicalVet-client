<template>
    <div class="float-right">
        <button class="btn btn-success btn-sm" @click="showModalForRegisterVaccine">
                <i class="fa fa-fw fa-lg fa-plus"></i> Registrar
        </button>
        <!--inicio modal vacunas-->
        <div class="modal fade bd-example-modal-lg" id="modalForRegisterVaccine" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Registrar vacuna2</h5>
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
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="">Vacuna (*)</label>
                                <v-select :options="vaccines" label="name" :reduce="vaccine => vaccine.id" v-model="vaccineSelected"></v-select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="">Fecha de aplicación (*)</label>
                                <input type="date" class="form-control" v-model="vaccineApplicationDate">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="">Próxima vacuna (*)</label>
                                <input type="date" class="form-control" v-model="nextVaccineDate">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary mr-1" @click="registerVaccine" :disabled="saving || ($limitedVersion && quantityVaccinesCreated === null)">
                        <i  class="fa fa-fw fa-lg fa fa-save"></i> Registrar <span v-if="saving" class="spinner-border spinner-border-sm ml-1"></span>
                    </button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
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
    props: {
        pet_id: {
            type: Number,
            required: true
        }
    },
    created() {
        if (this.$limitedVersion) {
            this.getQuantityVaccinesCreated()
        }
        this.getVaccines()
    },
    data() {
        return {
            vaccines: [],
            vaccineSelected: '',
            vaccineApplicationDate: '',
            nextVaccineDate: '',
            quantityVaccinesCreated: null,
            errors: null,
            saving: false,
        }
    },
    methods: {
        getQuantityVaccinesCreated () {
            this.$http.get(`vaccines/${ this.pet_id }/get-quantity-vaccines-created`).then( response => {
                this.quantityVaccinesCreated = response.data
            })
        },
        getVaccines () {
            this.$http.get('vaccines').then( response => {
                this.vaccines = response.data
            })
        },
        showModalForRegisterVaccine () {
            $('#modalForRegisterVaccine').modal('show')
        },
        registerVaccine () {
            if (this.quantityVaccinesCreated >= 2 && this.$limitedVersion) {
              return this.$toastr.error('Solo puede registrar hasta 2 vacunas en la versión limitada')
            }

            this.saving = true

            let data = {
                pet_id: this.pet_id,
                product_id: this.vaccineSelected,
                application_date: this.vaccineApplicationDate,
                next_date: this.nextVaccineDate
            }

            this.$http.post('vaccines', data).then( response => {
                this.quantityVaccinesCreated = null
                this.getQuantityVaccinesCreated()
                this.$emit('vaccineRegistered')
                this.$toastr.success('Vacunación registrada')
                this.clearFields()
                this.saving = false
            }).catch( error => {
              this.saving = false
              if (error.response.status == 422) {
                this.errors = error.response.data.errors
              }
            })
        },
        clearFields () {
            this.vaccineSelected = ''
            this.vaccineApplicationDate = ''
            this.nextVaccineDate = ''
            this.errors = null
        }
    },
}
</script>