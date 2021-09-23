<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Razas</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="title">Listado de razas</h3>
              <button :disabled="!hasPermission('races.store')"
                @click="$router.push({ name: 'races.create' })"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
            </div>    
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <Search @data-search="getRacesFiltered" label="Nombre de la raza"/>
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
                  <tr v-for="race in races.data" :key="race.id">
                    <td nowrap>{{ race.name }}</td>
                    <td nowrap>
                      <button class="btn btn-primary btn-sm" 
                        :disabled="!hasPermission('races.update')"
                        @click="editRace(race.id)">
                        <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button class="btn btn-danger btn-sm" 
                        :disabled="!hasPermission('races.destroy')"
                        @click="deleteRace(race.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="races" @pagination-change-page="getRaces">
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
          this.getRaces()
      },
      data() {
          return {
              races: {},
              search: '',
              loading: true
          }
      },
      methods: {
        getRacesFiltered (payload) {
          this.loading = true
          this.search = payload
          this.getRaces(1)
        },
        getRaces (page = 1) {
          this.$http.get('races?search=' + this.search + '&page=' + page).then( response => {
              this.races = response.data
              this.loading = false
          })
        },
        editRace (id) {
          this.$router.push({ name: 'races.edit', params: { id } })
        },
        deleteRace (id) {
          this.$http.delete(`races/${ id }`).then( response => {
              this.getRaces()
              this.$toastr.success('Raza eliminada')
          }).catch( errors => {
            if (errors.response.status == 422) {
              this.$toastr.error('La raza no se puede eliminar ya que tiene mascotas relacionadas')
            }
          })
        }
      }
    }
</script>

<style lang="scss" scoped>

</style>