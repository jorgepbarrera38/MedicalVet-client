<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Diagnósticos</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="title">Listado de diagnósticos</h3>
              <button :disabled="!hasPermission('diagnoses.store')"
                @click="$router.push({ name: 'diagnoses.create' })"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
            </div>
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <Search @data-search="getDiagnosesFiltered" label="Nombre del diagnóstico"/>
              </div>
            </div>
            <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <div class="table-responsive" v-else>        
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="diagnosis in diagnoses.data" :key="diagnosis.id">
                    <td nowrap>{{ diagnosis.name }}</td>
                    <td nowrap>
                      <button class="btn btn-primary btn-sm" 
                        :disabled="!hasPermission('diagnoses.update')"
                        @click="editDiagnosis(diagnosis.id)">
                        <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button class="btn btn-danger btn-sm" 
                        :disabled="!hasPermission('diagnoses.destroy')"
                        @click="deleteDiagnosis(diagnosis.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="diagnoses" @pagination-change-page="getDiagnoses">
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
   import { VueLoading } from 'vue-loading-template'
   import Search from '../_components/Search'
    export default {
      mixins: [hasPermission],
      components: {
        VueLoading, Search
      },
      created () {
          this.getDiagnoses()
      },
      data() {
          return {
              diagnoses: {},
              search: '',
              loading: true
          }
      },
      methods: {
        getDiagnosesFiltered (payload) {
          this.loading = true
          this.search = payload
          this.getDiagnoses(1)
        },
        getDiagnoses (page = 1) {
          this.$http.get('diagnoses?search=' + this.search + '&page=' + page).then( response => {
              this.diagnoses = response.data
              this.loading = false
          }).catch( () => {
            this.loading = false
          })
        },
        editDiagnosis (id) {
          this.$router.push({ name: 'diagnoses.edit', params: { id } })
        },
        deleteDiagnosis (id) {
          this.$http.delete(`diagnoses/${ id }`).then( response => {
              this.getDiagnoses()
              this.$toastr.success('Diagnóstico eliminado')
          }).catch( errors => {
            if (errors.response.status == 422) {
              this.$toastr.error('El diagnóstico no se puede eliminar ya que tiene historias clínicas relacionadas')
            }
          })
        }
      },
    }
</script>

<style lang="scss" scoped>

</style>