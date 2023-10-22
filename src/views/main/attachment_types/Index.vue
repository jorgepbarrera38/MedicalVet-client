<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Tipos de archivos adjuntos</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="tile-title">Listado de tipos de archivos adjuntos</h3>
              <button :disabled="!hasPermission('attachment-types.store')"
                @click="$router.push({ name: 'attachment_types.create' })"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
            </div>    
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <Search @data-search="getAttachmentTypesFiltered" label="Nombre del tipo de archivo"/>
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
                  <tr v-for="attachmentType in attachmentTypes.data" :key="attachmentType.id">
                    <td nowrap>{{ attachmentType.name }}</td>
                    <td nowrap>
                      <button class="btn btn-primary btn-sm" 
                        :disabled="!hasPermission('attachment-types.update')"
                        @click="editAttachmentType(attachmentType.id)">
                        <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button class="btn btn-danger btn-sm" 
                        :disabled="!hasPermission('attachment-types.destroy')"
                        @click="deleteAttachmentType(attachmentType.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="attachmentTypes" @pagination-change-page="getAttachmentTypes">
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
          this.getAttachmentTypes()
      },
      data() {
          return {
              attachmentTypes: {},
              search: '',
              loading: true
          }
      },
      methods: {
        getAttachmentTypesFiltered (payload) {
          this.loading = true
          this.search = payload
          this.getAttachmentTypes(1)
        },
        getAttachmentTypes (page = 1) {
          this.$http.get('attachment-types?search=' + this.search + '&page=' + page).then( response => {
              this.attachmentTypes = response.data
              this.loading = false
          }).catch( () => {
              this.loading = false
          })
        },
        editAttachmentType (id) {
          this.$router.push({ name: 'attachment_types.edit', params: { id } })
        },
        deleteAttachmentType (id) {
          this.$http.delete(`attachment-types/${ id }`).then( response => {
              this.getAttachmentTypes()
              this.$toastr.success('Tipo de archivo eliminado')
          }).catch( errors => {
            if (errors.response.status == 422) {
              this.$toastr.error('El tipo de archivo no se puede eliminar ya que tiene historias clínicas relacionadas')
            }
          })
        }
      }
    }
</script>

<style lang="scss" scoped>

</style>