<template>
    <div>
        <!--inicio modal desparasitaciónes-->
        <div class="modal fade bd-example-modal-lg" id="modalForRegisterDeworming" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Registrar desparasitación</h5>
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
                                <label for="">Desparasitante (*)</label>
                                <v-select :options="dewormings" label="name" :reduce="deworming => deworming.id" v-model="dewormingSelected"></v-select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="">Fecha de aplicación (*)</label>
                                <input type="date" class="form-control" v-model="dewormingApplicationDate">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="">Próxima desparasitación (*)</label>
                                <input type="date" class="form-control" v-model="nextDewormingDate">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary btn-sm mr-1" @click="registerDeworming" :disabled="saving || ($limitedVersion && quantityDewormingsCreated === null)">
                        <i  class="fa fa-fw fa-lg fa fa-save"></i> Registrar <span v-if="saving" class="spinner-border spinner-border-sm ml-1"></span>
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
                </div>
            </div>
            </div>
        </div>
        <!--Fin modal desparasitaciónes-->
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
            this.getQuantityDewormingsCreated()
        }
        this.getDewormings()
    },
    data() {
        return {
            dewormings: [],
            dewormingSelected: '',
            dewormingApplicationDate: '',
            nextDewormingDate: '',
            quantityDewormingsCreated: null,
            errors: null,
            saving: false,
        }
    },
    methods: {
        getQuantityDewormingsCreated () {
            this.$http.get(`dewormings/${ this.pet_id }/get-quantity-dewormings-created`).then( response => {
                this.quantityDewormingsCreated = response.data
            })
        },
        getDewormings () {
            this.$http.get('dewormings').then( response => {
                this.dewormings = response.data.dewormings
            })
        },
        showModalForRegisterDeworming () {
            $('#modalForRegisterDeworming').modal('show')
        },
        registerDeworming () {
            if (this.quantityDewormingsCreated >= 2 && this.$limitedVersion) {
              return this.$toastr.error('Solo puede registrar hasta 2 desparasitaciones en la versión limitada')
            }

            this.saving = true

            let data = {
                pet_id: this.pet_id,
                product_id: this.dewormingSelected,
                application_date: this.dewormingApplicationDate,
                next_date: this.nextDewormingDate
            }

            this.$http.post('dewormings', data).then( response => {
                this.quantityDewormingsCreated = null
                this.getQuantityDewormingsCreated()
                this.$emit('dewormingRegistered')
                this.clearFields()
                this.$toastr.success('Desparasitación registrada')
                this.saving = false
            }).catch( error => {
              this.saving = false
              if (error.response.status == 422) {
                this.errors = error.response.data.errors
              }
            })
        },
        clearFields () {
            this.dewormingSelected = ''
            this.dewormingApplicationDate = ''
            this.nextDewormingDate = ''
            this.errors = null
        }
    },
}
</script>