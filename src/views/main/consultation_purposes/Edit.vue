<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Finalidades de consulta</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Editar finalidad de consulta</h3>
            <div class="alert alert-danger" v-if="errors">
              <li v-for="(error, index) in errors" :key="index">
                {{ error[0] }}
              </li>
            </div>
            <form @submit.prevent="saveConsultation_purpose()">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="">Nombre (*)</label>
                    <input type="text" class="form-control" v-model="consultation_purposes.name" maxlength="80">
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="table-responsive">
                    <table class="table table-hover table-sm">
                      <thead>
                        <th></th>
                        <th>
                          <button class="btn btn-default btn-sm" type="button" @click="selectAll">
                            Todos
                          </button>
                          <button class="btn btn-default btn-sm" type="button" @click="unSelectAll">
                            Ninguno
                          </button>
                        </th>
                        <th>Detalle</th>
                      </thead>
                      <tbody>
                        <tr>
                          <td nowrap>Motivo</td>
                          <td nowrap>
                              <input type="checkbox" v-model="consultation_purposes.reason_consultation">
                          </td>
                           <td>
                            Obligatorio
                          </td>
                        </tr>
                        <tr>
                          <td nowrap>Síntomas</td>
                          <td nowrap>
                              <input type="checkbox" v-model="consultation_purposes.symptoms">
                          </td>
                           <td>
                            Obligatorio
                          </td>
                        </tr>
                        <tr>
                          <td nowrap>Antecedentes</td>
                          <td nowrap>
                              <input type="checkbox" v-model="consultation_purposes.records">
                          </td>
                           <td>
                            Opcional
                          </td>
                        </tr>
                        <tr>
                          <td nowrap>Constantes fisiológicas</td>
                          <td nowrap>
                              <input type="checkbox" v-model="consultation_purposes.physiological_constants">
                          </td>
                           <td>
                            Obligatorio
                          </td>
                        </tr>
                        <tr>
                          <td nowrap>Diagnósticos</td>
                          <td nowrap>
                              <input type="checkbox" v-model="consultation_purposes.diagnoses">
                          </td>
                           <td>
                            Opcional
                          </td>
                        </tr>
                        <tr>
                          <td nowrap>Vacunas</td>
                          <td nowrap>
                              <input type="checkbox" v-model="consultation_purposes.vaccines">
                          </td>
                           <td>
                            Opcional
                          </td>
                        </tr>
                        <tr>
                          <td nowrap>Desparasitaciones</td>
                          <td nowrap>
                              <input type="checkbox" v-model="consultation_purposes.dewormings">
                          </td>
                           <td>
                            Opcional
                          </td>
                        </tr>
                        <tr>
                          <td nowrap>Productos y servicios aplicados</td>
                          <td nowrap>
                              <input type="checkbox" v-model="consultation_purposes.products_and_services_applied">
                          </td>
                           <td>
                            Opcional
                          </td>
                        </tr>
                        <tr>
                          <td nowrap>Indicaciones</td>
                          <td nowrap>
                              <input type="checkbox" v-model="consultation_purposes.indications">
                          </td>
                          <td>
                            Obligatorio
                          </td>
                        </tr>
                        <tr>
                          <td nowrap>Archivos adjuntos</td>
                          <td nowrap>
                              <input type="checkbox" v-model="consultation_purposes.attachments">
                          </td>
                          <td>
                            Opcional
                          </td>
                        </tr>
                        <tr>
                          <td nowrap>Anamnesis</td>
                          <td nowrap>
                              <input type="checkbox" v-model="consultation_purposes.anamnesis">
                          </td>
                          <td>
                            Obligatorio
                          </td>
                        </tr>
                        <tr>
                          <td nowrap>Receta veterinaria</td>
                          <td nowrap>
                              <input type="checkbox" v-model="consultation_purposes.prescription">
                          </td>
                          <td>
                            Opcional
                          </td>
                        </tr>
                        <tr>
                          <td nowrap>Revisión por sistemas
                          </td>
                          <td nowrap>
                              <input type="checkbox" v-model="consultation_purposes.review_by_systems">
                          </td>
                          <td>
                            Obligatorio
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <vue-loading v-if="saving" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
              <div v-else>
                <button type="submit" class="btn btn-primary">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar
                </button>
                &nbsp;&nbsp;&nbsp;
                <router-link :to="{ name: 'consultation_purposes.index' }" class="btn btn-danger">
                    <i class="fa fa-fw fa-lg fa fa-times-circle"></i>Cancelar
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    export default {
        components: {
          VueLoading
        },
        created () {
          this.getConsultationPurposes()
        },
        data() {
            return {
                consultation_purposes: {
                  id: '',
                  name: '',
                  reason_consultation: false,
                  symptoms: false,
                  records: false,
                  physiological_constants: false,
                  diagnoses: false,
                  vaccines: false,
                  dewormings: false,
                  products_and_services_applied: false,
                  indications: false,
                  attachments: false,
                  anamnesis: false,
                  prescription: false,
                  review_by_systems: false,
                },
                errors: null,
                saving: false,
            }
        },
        methods: {
          saveConsultation_purpose () {
            this.saving = true
            this.$http.put(`consultation-purposes/${ this.$route.params.id }`, this.consultation_purposes).then( response => {
              this.saving = false
              this.$toastr.success('Finalidad actualizada')
              this.$router.push({ name: 'consultation_purposes.index' })
            }).catch( error => {
              this.saving = false
              if (error.response.status == 422) {
                this.errors = error.response.data.errors
              }
            })
          },
          getConsultationPurposes () {
            this.$http.get(`consultation-purposes/${ this.$route.params.id }`).then( response => {
              this.consultation_purposes = response.data
            })
          },
          selectAll () {
            this.consultation_purposes.reason_consultation = true
            this.consultation_purposes.symptoms = true
            this.consultation_purposes.records = true
            this.consultation_purposes.physiological_constants = true
            this.consultation_purposes.diagnoses = true
            this.consultation_purposes.vaccines = true
            this.consultation_purposes.dewormings = true
            this.consultation_purposes.products_and_services_applied = true
            this.consultation_purposes.indications = true
            this.consultation_purposes.attachments = true
            this.consultation_purposes.anamnesis = true
            this.consultation_purposes.prescription = true
            this.consultation_purposes.review_by_systems = true
          },
          unSelectAll () {
            this.consultation_purposes.reason_consultation = false
            this.consultation_purposes.symptoms = false
            this.consultation_purposes.records = false
            this.consultation_purposes.physiological_constants = false
            this.consultation_purposes.diagnoses = false
            this.consultation_purposes.vaccines = false
            this.consultation_purposes.dewormings = false
            this.consultation_purposes.products_and_services_applied = false
            this.consultation_purposes.indications = false
            this.consultation_purposes.attachments = false
            this.consultation_purposes.anamnesis = false
            this.consultation_purposes.prescription = false
            this.consultation_purposes.review_by_systems = false
          }
        },
    }
</script>

<style lang="scss" scoped>

</style>