<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Departamentos</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="tile-title">Listado de departamentos</h3>
              <button :disabled="!hasPermission('states.store')"
                @click="$router.push({ name: 'states.create' })"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
            </div>    
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <Search @data-search="getStatesFiltered" label="Nombre del departamento"/>
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
                  <tr v-for="state in states.data" :key="state.id">
                    <td nowrap>{{ state.name }}</td>
                    <td nowrap>
                      <button class="btn btn-primary btn-sm" 
                        :disabled="!hasPermission('states.update')"
                        @click="editState(state.id)">
                        <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button class="btn btn-danger btn-sm" 
                        :disabled="!hasPermission('states.destroy')"
                        @click="deleteState(state.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="states" @pagination-change-page="getStates">
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
          this.getStates()
      },
      data() {
          return {
              states: {},
              search: '',
              loading: true
          }
      },
      methods: {
        getStatesFiltered (payload) {
          this.loading = true
          this.search = payload
          this.getStates(1)
        },
        getStates (page = 1) {
          this.$http.get('states?search=' + this.search + '&page=' + page).then( response => {
              this.states = response.data
              this.loading = false
          }).catch( () => {
              this.loading = false
          })
        },
        editState (id) {
          this.$router.push({ name: 'states.edit', params: { id } })
        },
        deleteState (id) {
          this.$http.delete(`states/${ id }`).then( response => {
              this.getStates()
              this.$toastr.success('Departamento eliminado')
          }).catch( errors => {
            if (errors.response.status == 422) {
              this.$toastr.error('El departamento no se puede eliminar ya que tiene municipios relacionados')
            }
          })
        }
      }
    }
</script>

<style lang="scss" scoped>

</style>