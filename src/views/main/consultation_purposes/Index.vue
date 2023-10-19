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
            <div class="tile-title-w-btn">
              <h3 class="title">Listado de finalidades de consulta</h3>
              <button :disabled="!hasPermission('consultation-purposes.store')"
                @click="$router.push({ name: 'consultation_purposes.create' })"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
            </div>
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <Search @data-search="getConsultationPurposesFiltered" label="Finalidad de consulta"/>
              </div>
            </div>
            <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <div v-else class="table-responsive">
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Motivo</th>
                    <th>Síntomas</th>
                    <th>Antecedentes</th>
                    <th nowrap>Constantes fisiológicas</th>
                    <th>Diagnósticos</th>
                    <th>Vacunas</th>
                    <th>Desparasitaciones</th>
                    <th nowrap>Productos y servicios aplicados</th>
                    <th>Indicaciones</th>
                    <th>Archivos adjuntos</th>
                    <th>Anamnesis</th>
                    <th>Receta veterinaria</th>
                    <th>Revisión por sistemas</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="consultation_purpose in consultation_purposes.data" :key="consultation_purpose.id">
                    <td nowrap>
                      {{ consultation_purpose.name }}
                    </td>
                    <td nowrap>
                      <input type="checkbox" :checked="consultation_purpose.reason_consultation">
                    </td>
                    <td nowrap>
                      <input type="checkbox" :checked="consultation_purpose.symptoms">
                    </td>
                    <td nowrap>
                      <input type="checkbox" :checked="consultation_purpose.records">
                    </td>
                    <td nowrap>
                      <input type="checkbox" :checked="consultation_purpose.physiological_constants">
                    </td>
                    <td nowrap>
                      <input type="checkbox" :checked="consultation_purpose.diagnoses">
                    </td>
                    <td nowrap>
                      <input type="checkbox" :checked="consultation_purpose.vaccines">
                    </td>
                    <td nowrap>
                      <input type="checkbox" :checked="consultation_purpose.dewormings">
                    </td>
                    <td nowrap>
                      <input type="checkbox" :checked="consultation_purpose.products_and_services_applied">
                    </td>
                    <td nowrap>
                      <input type="checkbox" :checked="consultation_purpose.indications">
                    </td>
                    <td nowrap>
                      <input type="checkbox" :checked="consultation_purpose.attachments">
                    </td>
                    <td nowrap>
                      <input type="checkbox" :checked="consultation_purpose.anamnesis">
                    </td>
                    <td nowrap>
                      <input type="checkbox" :checked="consultation_purpose.prescription">
                    </td>
                    <td nowrap>
                      <input type="checkbox" :checked="consultation_purpose.review_by_systems">
                    </td>
                    <td nowrap>
                      <button class="btn btn-primary btn-sm" 
                        :disabled="!hasPermission('consultation-purposes.update')"
                        @click="editConsultationPurposes(consultation_purpose.id)">
                        <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button class="btn btn-danger btn-sm" 
                        :disabled="!hasPermission('consultation-purposes.destroy')"
                        @click="deleteConsultationPurposes(consultation_purpose.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="consultation_purposes" @pagination-change-page="getConsultationPurposes">
              <span slot="prev-nav">&lt; Anterior</span>
              <span slot="next-nav">Siguiente &gt;</span>
            </pagination>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import hasPermission from '../_utilities/hasPermission'
    import Search from '../_components/Search'
    import { VueLoading } from 'vue-loading-template'
    export default {
      mixins: [hasPermission],
      components: {
        Search, VueLoading
      },
        created () {
            this.getConsultationPurposes()
        },
        data() {
            return {
                consultation_purposes: {},
                search: '',
                loading: true
            }
        },
        methods: {
          getConsultationPurposesFiltered (payload) {
            this.loading = true
            this.search = payload
            this.getConsultationPurposes(1)
          },
          getConsultationPurposes (page = 1) {
            this.$http.get('consultation-purposes?search=' + this.search + '&page=' + page).then( response => {
                this.consultation_purposes = response.data
                this.loading = false
            }).catch( () => {
              this.loading = false
            })
          },
          editConsultationPurposes (id) {
            this.$router.push({ name: 'consultation_purposes.edit', params: { id } })
          },
          deleteConsultationPurposes (id) {
            this.$http.delete(`consultation-purposes/${ id }`).then( response => {
                this.$toastr.success('Finalidad de consulta eliminada')
                this.getConsultationPurposes()
            }).catch( error => {
              if (error.response.status == 422 ){
                this.$toastr.error('El registro no se puede eliminar ya que tiene historias clínicas relacionadas')
              }
            })
          }
        },
    }
</script>

<style lang="scss" scoped>

</style>