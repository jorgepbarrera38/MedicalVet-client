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
            <h3 class="tile-title">Personalizar plantilla</h3>
            <div class="alert alert-danger" v-if="errors">
              <li v-for="(error, index) in errors" :key="index">
                {{ error[0] }}
              </li>
            </div>
            <div class="row">
                <div class="form-group col-md-4">
                    <label for="">Elemento</label>
                    <select class="form-control" v-model="element">
                        <option value="">Opciónes</option>
                        <option value="propietarioIdentificacion">Propietario identificación</option>
                        <option value="propietarioNombres">Propietario nombres</option>
                        <option value="propietarioUbicacion">Propietario ubicación</option>
                        <option value="propietarioDireccion">Propietario dirección</option>
                        <option value="mascotaNombre">Mascota nombre</option>
                        <option value="mascotaEspecie">Mascota especie</option>
                        <option value="mascotaRaza">Mascota Raza</option>
                        <option value="mascotaSexo">Mascota sexo</option>
                        <option value="procedimiento">Procedimiento</option>
                        <option value="riesgos">Riesgos, consecuentas y efectos colaterales</option>
                        <option value="usuarioNombres">Usuario nombres</option>
                        <option value="usuarioMatriculaProfesional">Usuario matrícula profesional</option>
                        
                    </select>
                </div>
                <div class="col-md-12">
                        <div id="toolbar-container"></div>

                    <div id="editor"></div>
                </div>
                <div class="col-md-12 mt-2">
                    <vue-loading v-if="saving" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                    <div v-else>
                        <button @click="saveTemplate" class="btn btn-primary">
                        <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar
                        </button>
                        &nbsp;&nbsp;&nbsp;
                        <router-link :to="{ name: 'informed_consent_template.index' }" class="btn btn-danger">
                        <i class="fa fa-fw fa-lg fa fa-times-circle"></i>Cancelar
                        </router-link>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    export default {
        components: {
          VueLoading
        },
        created () {
            this.getTemplate()
        },
        mounted () {
            DecoupledEditor
                .create( document.querySelector( '#editor' ), { language: 'es' } )
                .then(editor => {
                    this.editor = editor
                    const toolbarContainer = document.querySelector( '#toolbar-container' )
                    toolbarContainer.appendChild( editor.ui.view.toolbar.element );
                })
                .catch( error => {
                    console.error( error );
                })
        },
        data() {
            return {
                element: '',
                template: '',
                errors: null,
                saving: false,
                editor: '',
            }
        },
        methods: {
            getTemplate () {
                this.$http.get(`informed-consent-templates/${ this.$route.params.id }`).then( response => {
                    this.editor.setData(response.data.template)
                })
            },
            saveTemplate () {
                this.saving = true
                this.$http.post(`informed-consent-templates/${ this.$route.params.id }/customize`, { template: this.editor.getData() }).then( response => {
                    this.$toastr.success('Plantilla actualizada')
                    this.saving = false
                    this.errors = null
                    //this.$router.push({ name: 'informed_consent_template.index' })
                }).catch( error => {
                this.saving = false
                if (error.response.status == 422) {
                    this.errors = error.response.data.errors
                }
                })
            },
        },
        watch: {
            element(newValue, oldValue) {
                if (this.element) {
                    this.editor.model.change(writer => {
                            writer.insertText(`{${ newValue }}`, { bold: true }, this.editor.model.document.selection.getFirstPosition())
                    })
                    this.element = ''
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>