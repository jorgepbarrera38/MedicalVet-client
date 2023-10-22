<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Ciudades</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="tile-title">Listado de ciudades</h3>
              <button :disabled="!hasPermission('cities.store')"
                @click="$router.push({ name: 'cities.create' })"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
            </div>    
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <Search @data-search="getCitiesFiltered" label="Ciudad"/>
              </div>
            </div>
            <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <div class="table-responsive" v-else>        
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Departamento</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="city in cities.data" :key="city.id">
                    <td nowrap>{{ city.name }}</td>
                    <td nowrap>{{ city.state.name }}</td>
                    <td nowrap>
                      <button class="btn btn-primary btn-sm" 
                        :disabled="!hasPermission('cities.update')"
                        @click="editCity(city.id)">
                        <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button class="btn btn-danger btn-sm" 
                        :disabled="!hasPermission('cities.destroy')"
                        @click="deleteCity(city.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="cities" @pagination-change-page="getCities">
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
          this.getCities()
      },
      data() {
          return {
              cities: {},
              search: '',
              loading: true
          }
      },
      methods: {
        getCitiesFiltered (payload) {
          this.loading = true
          this.search = payload
          this.getCities(1)
        },
        getCities (page = 1) {
          this.$http.get('cities?search=' + this.search + '&page=' + page).then( response => {
              this.cities = response.data
              this.loading = false
          })
        },
        editCity (id) {
          this.$router.push({ name: 'cities.edit', params: { id } })
        },
        deleteCity (id) {
          this.$http.delete(`cities/${ id }`).then( response => {
              this.getCities()
              this.$toastr.success('Ciudad eliminada')
          }).catch( errors => {
            if (errors.response.status == 422) {
              this.$toastr.error('La ciudad no se puede eliminar ya que tiene propietarios relacionados')
            }
          })
        }
      }
    }
</script>

<style lang="scss" scoped>

</style>