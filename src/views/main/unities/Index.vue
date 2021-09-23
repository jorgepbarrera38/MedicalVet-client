<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Unidades</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="title">Listado de unidades</h3>
              <button :disabled="!hasPermission('unities.store')"
                @click="$router.push({ name: 'unities.create' })"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
            </div>    
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <Search @data-search="getUnitiesFiltered" label="Descripción de la unidad"/>
              </div>
            </div>
            <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <div class="table-responsive" v-else>        
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="unity in unities.data" :key="unity.id">
                    <td nowrap>{{ unity.description }}</td>
                    <td nowrap>
                      <button class="btn btn-primary btn-sm" 
                        :disabled="!hasPermission('unities.update')"
                        @click="editUnity(unity.id)">
                        <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button class="btn btn-danger btn-sm" 
                        :disabled="!hasPermission('unities.destroy')"
                        @click="deleteUnity(unity.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="unities" @pagination-change-page="getUnities">
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
          this.getUnities()
      },
      data() {
          return {
              unities: {},
               search: '',
              loading: true
          }
      },
      methods: {
        getUnitiesFiltered (payload) {
          this.loading = true
          this.search = payload
          this.getUnities(1)
        },
        getUnities (page = 1) {
          this.$http.get('unities?search=' + this.search + '&page=' + page).then( response => {
              this.unities = response.data
              this.loading = false
          })
        },
        editUnity (id) {
          this.$router.push({ name: 'unities.edit', params: { id } })
        },
        deleteUnity (id) {
          this.$http.delete(`unities/${ id }`).then( response => {
              this.getUnities()
              this.$toastr.success('Unidad eliminada')
          }).catch( errors => {
            if (errors.response.status == 422) {
              this.$toastr.error('La unidad no se puede eliminar ya que tiene registros relacionadas')
            }
          })
        }
      }
    }
</script>

<style lang="scss" scoped>

</style>