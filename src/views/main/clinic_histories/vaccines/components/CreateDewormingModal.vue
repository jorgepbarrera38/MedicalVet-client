<template>
    <div class="float-right">
        <button class="btn btn-success btn-sm" @click="showModalForRegisterDeworming">
                <i class="fa fa-fw fa-lg fa-plus"></i> Registrar
        </button>
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
                            <label for="">Dosis (*)</label>
                            <input type="number" class="form-control" v-model="doseDeworming">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                            <label for="">Unidad (*)</label>
                            <select v-model="unityDoseDeworming" class="form-control">
                                <option value="">Seleccione unidad</option>
                                <option :value="unity.id" v-for="unity in unities" :key="'unity' + unity.id">
                                    {{ unity.description }}
                                </option>
                            </select>
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
                    <button type="button" class="btn btn-primary mr-1" @click="registerDeworming" :disabled="saving">
                        <i  class="fa fa-fw fa-lg fa fa-save"></i> Registrar <span v-if="saving" class="spinner-border spinner-border-sm ml-1"></span>
                    </button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
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
        this.getDewormingsAndUnities()
    },
    data() {
        return {
            dewormings: [],
            dewormingSelected: '',
            doseDeworming: '',
            unityDoseDeworming: '',
            nextDewormingDate: '',
            unities: [],
            errors: null,
            saving: false,
        }
    },
    methods: {
        getDewormingsAndUnities () {
            this.$http.get('dewormings').then( response => {
                this.dewormings = response.data.dewormings
                this.unities = response.data.unities
            })
        },
        showModalForRegisterDeworming () {
            $('#modalForRegisterDeworming').modal('show')
        },
        registerDeworming () {
            this.saving = true

            let data = {
                pet_id: this.pet_id,
                product_id: this.dewormingSelected,
                dose: this.doseDeworming,
                unity_id: this.unityDoseDeworming,
                next_date: this.nextDewormingDate
            }

            this.$http.post('dewormings', data).then( response => {
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
            this.doseDeworming = ''
            this.unityDoseDeworming = ''
            this.nextDewormingDate = ''
            this.errors = null
        }
    },
}
</script>