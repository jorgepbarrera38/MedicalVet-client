<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Consultorios</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="title">Listado de consultorios</h3>
              <button :disabled="!hasPermission('consultingrooms.store')"
                @click="$router.push({ name: 'consultingrooms.create' })"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
            </div>    
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <Search @data-search="getConsultingroomsFiltered" label="Nombre consultorio"/>
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
                  <tr v-for="consultingroom in consultingrooms.data" :key="consultingroom.id">
                    <td nowrap>{{ consultingroom.name }}</td>
                    <td nowrap>
                        <!--:disabled="!hasPermission('consultingrooms.update')"-->
                      <button :disabled="!hasPermission('consultingrooms.update')"
                        class="btn btn-primary btn-sm" 
                        @click="editConsultingroom(consultingroom.id)">
                        <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                        <!--:disabled="!hasPermission('consultingrooms.destroy')"-->
                      <button :disabled="!hasPermission('consultingrooms.destroy')"
                        class="btn btn-danger btn-sm" 
                        @click="deleteConsultingroom(consultingroom.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="consultingrooms" @pagination-change-page="getConsultingrooms">
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
          this.getConsultingrooms()
      },
      data() {
          return {
              consultingrooms: {},
              search: '',
              loading: true
          }
      },
      methods: {
        getConsultingroomsFiltered (payload) {
          this.loading = true
          this.search = payload
          this.getConsultingrooms(1)
        },
        getConsultingrooms (page = 1) {
          this.$http.get('consultingrooms?search=' + this.search + '&page=' + page).then( response => {
              this.consultingrooms = response.data
              this.loading = false
          })
        },
        editConsultingroom (id) {
          this.$router.push({ name: 'consultingrooms.edit', params: { id } })
        },
        deleteConsultingroom (id) {
          this.$http.delete(`consultingrooms/${ id }`).then( response => {
              this.getConsultingrooms()
              this.$toastr.success('Consultorio eliminado')
          }).catch( errors => {
            if (errors.response.status == 422) {
              this.$toastr.error('El consultorio no se puede eliminar ya que tiene registros relacionadas')
            }
          })
        }
      }
    }
</script>