<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Servicios</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="tile-title">Listado de servicios</h3>
              <button :disabled="!hasPermission('services.store')"
                @click="$router.push({ name: 'services.create' })"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
            </div>   
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <Search @data-search="getServicesFiltered" label="Nombre del servicio"/>
              </div>
            </div>    
            <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <div class="table-responsive" v-else>     
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="service in services.data" :key="service.id">
                    <td nowrap>{{ service.code }}</td>
                    <td nowrap>{{ service.name }}</td>
                    <td nowrap>{{ service.price }}</td>
                    <td nowrap>
                      <button class="btn btn-primary btn-sm" 
                        :disabled="!hasPermission('services.update')"
                        @click="editService(service.id)">
                        <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button class="btn btn-danger btn-sm" 
                        :disabled="!hasPermission('services.destroy')"
                        @click="deleteService(service.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="services" @pagination-change-page="getServices">
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
          this.getServices()
      },
      data() {
          return {
              services: {},
              search: '',
              loading: true
          }
      },
      methods: {
        getServicesFiltered (payload) {
          this.loading = true
          this.search = payload
          this.getServices(1)
        },
        getServices (page = 1) {
          this.$http.get('services?search=' + this.search + '&page=' + page).then( response => {
              this.services = response.data
              this.loading = false
          })
        },
        editService (id) {
          this.$router.push({ name: 'services.edit', params: { id } })
        },
        deleteService (id) {
          this.$http.delete(`services/${ id }`).then( response => {
              this.getServices()
              this.$toastr.success('Servicio eliminado')
          }).catch( errors => {
            if (errors.response.status == 422) {
              this.$toastr.error('El servicio no se puede eliminar ya que tiene historias clínicas relacionadas')
            }
          })
        }
      }
    }
</script>

<style lang="scss" scoped>

</style>