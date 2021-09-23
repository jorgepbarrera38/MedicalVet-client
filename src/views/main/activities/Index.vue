<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Actividades</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="title">Listado de actividades</h3>
              <!--:disabled="!hasPermission('activities.store')"-->
              <button :disabled="!hasPermission('activities.store')"
                @click="$router.push({ name: 'activities.create' })"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
            </div>    
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <Search @data-search="getActivitiesFiltered" label="Nombre actividad"/>
              </div>
            </div>
            <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <div class="table-responsive" v-else>        
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th nowrap>Duración en minutos</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="activity in activities.data" :key="activity.id">
                    <td nowrap>{{ activity.name }}</td>
                    <td nowrap>{{ activity.duration }}</td>
                    <td nowrap>
                      <button :disabled="!hasPermission('activities.update')"
                        class="btn btn-primary btn-sm" 
                        @click="editActivity(activity.id)">
                        <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button :disabled="!hasPermission('activities.destroy')"
                        class="btn btn-danger btn-sm" 
                        @click="deleteActivity(activity.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="activities" @pagination-change-page="getActivities">
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
      mixins: [ hasPermission ],
      components: {
        VueLoading, Search
      },
      created () {
          this.getActivities()
      },
      data() {
          return {
              activities: {},
              search: '',
              loading: true
          }
      },
      methods: {
        getActivitiesFiltered (payload) {
          this.loading = true
          this.search = payload
          this.getActivities(1)
        },
        getActivities (page = 1) {
          this.$http.get('activities?search=' + this.search + '&page=' + page).then( response => {
              this.activities = response.data
              this.loading = false
          })
        },
        editActivity (id) {
          this.$router.push({ name: 'activities.edit', params: { id } })
        },
        deleteActivity (id) {
          this.$http.delete(`activities/${ id }`).then( response => {
              this.getActivities()
              this.$toastr.success('Actividad eliminada')
          }).catch( errors => {
            if (errors.response.status == 422) {
              this.$toastr.error('La actividad no se puede eliminar ya que tiene registros relacionadas')
            }
          })
        }
      }
    }
</script>

<style lang="scss" scoped>

</style>