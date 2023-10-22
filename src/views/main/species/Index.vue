<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Especies</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="tile-title">Listado de especies</h3>
              <button :disabled="!hasPermission('species.store')"
                @click="$router.push({ name: 'species.create' })"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
            </div>
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <Search @data-search="getSpeciesFiltered" label="Nombre de la especie"/>
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
                  <tr v-for="data in species.data" :key="data.id">
                    <td nowrap>{{ data.name }}</td>
                    <td nowrap>
                      <button class="btn btn-primary btn-sm" 
                        :disabled="!hasPermission('species.update')"
                        @click="editSpecies(data.id)">
                        <i class="fa fa-fw fa-lg fa-pencil"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button class="btn btn-danger btn-sm" 
                        :disabled="!hasPermission('species.destroy')"
                        @click="deleteSpecies(data.id)">
                        <i class="fa fa-fw fa-lg fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="species" @pagination-change-page="getSpecies">
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
          this.getSpecies()
      },
      data() {
          return {
              species: {},
              search: '',
              loading: true
          }
      },
      methods: {
        getSpeciesFiltered (payload) {
          this.loading = true
          this.search = payload
          this.getSpecies(1)
        },
        getSpecies (page = 1) {
          this.$http.get('species?search=' + this.search + '&page=' + page).then( response => {
              this.species = response.data
              this.loading = false
          }).catch( () => {
            this.loading = false
          })
        },
        editSpecies (id) {
          this.$router.push({ name: 'species.edit', params: { id } })
        },
        deleteSpecies (id) {
          this.$http.delete(`species/${ id }`).then( response => {
              this.getSpecies()
              this.$toastr.success('Especie eliminada')
          }).catch( errors => {
            if (errors.response.status == 422) {
              this.$toastr.error('La especie no se puede eliminar ya que tiene mascotas relacionadas')
            }
          })
        }
      },
    }
</script>