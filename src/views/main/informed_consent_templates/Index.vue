<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Plantillas de consentimiento informado</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="title">Listado de plantillas</h3>
              <button :disabled="!hasPermission('informed-consent-templates.store')"
                @click="showModalToCreateTemplate"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
              <!--inicio modal crear plantillas-->
              <div class="modal fade" id="templateModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">{{ editTemplate ? 'Editar plantilla' : 'Nueva plantilla' }}</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <form @submit.prevent="editTemplate ? updateInformedConsentTemplates() : saveInformedConsentTemplates()">
                        <div class="alert alert-danger" v-if="Object.keys(errors).length">
                          <li v-for="(error, index) in errors" :key="index">
                            {{ error[0] }}
                          </li>
                        </div>
                        <div class="form-group">
                          <label for="">Nombre</label>
                          <input type="text" class="form-control" v-model="template.name" maxlength="80" ref="templateName">
                        </div>
                      </form>
                    </div>
                    <div class="modal-footer">
                      <vue-loading v-if="savingTemplate" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                      <div v-else>
                        <button type="submit" class="btn btn-primary mr-1" :disabled="editTemplate && !template.id"
                          @click="editTemplate ? updateInformedConsentTemplates() : saveInformedConsentTemplates()">
                          <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar
                        </button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--Fin modal crear plantillas-->
            </div>    
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <Search @data-search="getInformedConsentTemplatesFiltered" label="Nombre de la plantilla"/>
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
                  <tr v-for="template in informedConsentTemplates.data" :key="template.id">
                    <td nowrap>{{ template.name }}</td>
                    <td nowrap>
                      <button class="btn btn-primary btn-sm mr-1" @click="showModalToEditTemplate(template.id)"
                        :disabled="!hasPermission('informed-consent-templates.update')">
                        <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                      </button>
                      <button class="btn btn-danger btn-sm mr-1" 
                        :disabled="!hasPermission('informed-consent-templates.destroy')"
                        @click="deleteInformedConsentTemplates(template.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>
                      <button class="btn btn-info btn-sm" 
                        :disabled="!hasPermission('informed-consent-templates.customize')"
                        @click="$router.push({ name: 'informed_consent_template.customize', params: { id: template.id } })">
                        <i class="fa fa-fw fa-lg fa fa-book"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="informedConsentTemplates" @pagination-change-page="getInformedConsentTemplates">
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
          this.getInformedConsentTemplates()
      },
      data() {
          return {
              informedConsentTemplates: {},
              template: {
                id: '',
                name: '',
              },
              search: '',
              errors: {},
              loading: true,
              savingTemplate: false,
              editTemplate: false,
          }
      },
      methods: {
        getInformedConsentTemplatesFiltered (payload) {
          this.loading = true
          this.search = payload
          this.getInformedConsentTemplates(1)
        },
        getInformedConsentTemplates (page = 1) {
          this.$http.get('informed-consent-templates?search=' + this.search + '&page=' + page).then( response => {
              this.informedConsentTemplates = response.data
              this.loading = false
          })
        },
        deleteInformedConsentTemplates (id) {
          this.$http.delete(`informed-consent-templates/${ id }`).then( response => {
              this.getInformedConsentTemplates()
              console.log(response.data);
              this.$toastr.success('Plantilla eliminada')
          }).catch( errors => {
            if (errors.response.status == 422) {
              this.$toastr.error('La plantilla no se puede eliminar ya que tiene registros relacionadas')
            }
          })
        },
        showModalToCreateTemplate () {
          this.template.id = ''
          this.template.name = ''
          this.errors = {}
          this.editTemplate = false
          $('#templateModal').modal('show')
        },
        showModalToEditTemplate (id) {
          this.template.id = ''
          this.template.name = ''
          this.errors = {}
          this.editTemplate = false
          this.$http.get(`informed-consent-templates/${ id }`).then( response => {
            this.template = response.data
          })
          this.editTemplate = true
          $('#templateModal').modal('show')
        },
        saveInformedConsentTemplates () {
          this.savingTemplate = true
          this.$http.post(`informed-consent-templates`, this.template).then( response => {
              this.getInformedConsentTemplates()
              this.template.name = ''
              this.errors = {}
              this.savingTemplate = false
              this.$toastr.success('Plantilla registrada')
              this.$refs.templateName.focus()
          }).catch( errors => {
            this.savingTemplate = false
            if (errors.response.status == 422) {
              this.errors = errors.response.data.errors
            }
          })
        },
        updateInformedConsentTemplates () {
          this.savingTemplate = true
          this.$http.put(`informed-consent-templates/${ this.template.id }`, this.template).then( response => {
              this.getInformedConsentTemplates()
              this.template.id = ''
              this.template.name = ''
              this.errors = {}
              this.editTemplate = false
              this.savingTemplate = false
              $('#templateModal').modal('hide')
              this.$toastr.success('Plantilla actualiza')
          }).catch( errors => {
            this.savingTemplate = false
            if (errors.response.status == 422) {
              this.errors = errors.response.data.errors
            }
          })
        }
      }
    }
</script>