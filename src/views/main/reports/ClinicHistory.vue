<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-file-text"></i> Historia clínica</h1>
            </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="row">
                <div class="col-md-12">
                  <div class="tile">
                    <h3 class="tile-title">Consulta de historia clínica</h3>
                    <SearchOwnersAndPets
                      @owner-and-pet-selected="ownerAndPetSelected"
                      :sizeFromColumnField="12">
                    </SearchOwnersAndPets>
                    <vue-loading v-if="gettingFoliosFromThePetSelected" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>  
                    <div class="table-responsive" style="max-height:250px;overflow-y:auto">
                      <table class="table table-sm table-hover" v-if="folios.length > 0">
                        <thead>
                          <th nowrap>
                            <button class="btn btn-default btn-sm" @click="selectAllFolios">
                              T
                            </button>
                            <button class="btn btn-default btn-sm" @click="unSelectAllFolios">
                              N
                            </button>
                          </th>
                          <th nowrap>Fecha folio</th>
                          <th nowrap>Finalidad de consulta</th>
                          <th>Usuario</th>
                        </thead>
                        <tbody>
                          <tr v-for="folio in folios" :key="'folio-' + folio.id">
                            <td nowrap><input type="checkbox" :value="folio" v-model="foliosSelected"> Folio {{ folio.number_folio }}</td>
                            <td nowrap>{{ formatDate(folio.created_at) }}</td>
                            <td nowrap>{{ folio.consultation_purposes.name }}</td>
                            <td nowrap>{{ folio.user.names + ' ' + folio.user.surnames }}</td>
                          </tr>
                        </tbody>
                      </table>
                      
                    </div>
                    <div class="mt-2">
                      <button :disabled="!petSelectedId || loadingResults || foliosSelected.length == 0" class="btn btn-primary btn-sm mb-1" @click="getClinicHistoryFromPet">
                        <i class="fa fa-fw fa-lg fa-search"></i> Consultar
                        <span v-if="loadingResults" class="spinner-border spinner-border-sm ml-1"></span>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button :disabled="!petSelectedId || foliosSelected.length == 0" class="btn btn-primary btn-sm mb-1" @click="showModalWithAttachments">
                        <i class="fa fa-fw fa-lg fa-file-archive-o"></i> Archivos adjuntos
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button :disabled="!petSelectedId || sendingClinicHistoryForEmail || foliosSelected.length == 0" class="btn btn-primary btn-sm mb-1" @click="sendClinicHistoryFromPetForEmail">
                        <i class="fa fa-fw fa-lg fa-envelope"></i> Enviar por email
                        <span v-if="sendingClinicHistoryForEmail" class="spinner-border spinner-border-sm ml-1"></span>
                      </button>
                    </div>
                    <!--Motivo-->
                  </div>
                </div>
            </div>
          </div>
          <div class="col-md-8">
              <div class="tile" style="height:80vh">
                  <vue-pdf-app :pdf="clinicHistoryPdf" :config="configViewerPdf"></vue-pdf-app>
                  <!--<iframe :src="clinicHistoryPdf" style="border:none"
                      width="100%" height="100%" >
                  </iframe>-->
                  
              </div>
          </div>
           <!--inicio modal archivos adjuntos-->
          <div class="modal fade" id="modalWithAttachments" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Archivos adjuntos</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="table-responsive" style="max-height:250px;overflow-y:auto">
                    <table class="table table-sm table-hover">
                      <thead>
                        <th>Folio</th>
                        <th nowrap>Archivo</th>
                      </thead>
                      <tbody>
                        <tr v-for="folio in foliosSelectedFiltered" :key="'folioAttachment-' + folio.id">
                          <td nowrap>{{ folio.number_folio }}</td>
                          <td nowrap>
                            <li v-for="attachment in folio.clinic_history_attachments" :key="`attach-${ attachment.id }`">
                              <a :href="$APP_URL + attachment.file" target="_blank">
                                {{ attachment.attachment_type.name }}
                              </a>
                            </li>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
    import SearchOwnersAndPets from './../_components/SearchOwnersAndPets'
    import { VueLoading } from 'vue-loading-template'
    import moment from 'moment'
    import VuePdfApp from "vue-pdf-app"
    import "vue-pdf-app/dist/icons/main.css"
    moment.locale('es')
    export default {
        components: {
          VueLoading, SearchOwnersAndPets, VuePdfApp
        },
        mounted () {
          document.getElementsByClassName('toolbar')[0].style.setProperty('z-index', 0)
        },
        data() {
            return {
                petSelectedId: '',
                clinicHistoryPdf: '',
                gettingFoliosFromThePetSelected: false,
                folios: [],
                foliosSelected: [],
                loadingResults: false,
                sendingClinicHistoryForEmail: false,
                configViewerPdf: {
                  //toolbar: true,
                  sidebar: {
                    viewThumbnail: true,
                    viewOutline: false,
                    viewAttachments: false,
                  },
                  secondaryToolbar: {
                    secondaryPresentationMode: false,
                    secondaryOpenFile: false,
                    secondaryPrint: true,
                    secondaryDownload: true,
                    secondaryViewBookmark: false,
                    firstPage: false,
                    lastPage: false,
                    pageRotateCw: false,
                    pageRotateCcw: false,
                    cursorSelectTool: false,
                    cursorHandTool: false,
                    scrollVertical: false,
                    scrollHorizontal: false,
                    scrollWrapped: false,
                    spreadNone: false,
                    spreadOdd: false,
                    spreadEven: false,
                    documentProperties: false,
                  },
                  toolbar: {
                    toolbarViewerLeft: {
                      findbar: true,
                      previous: true,
                      next: true,
                      pageNumber: true,
                    },
                    toolbarViewerRight: {
                      presentationMode: true,
                      openFile: false,
                      print: true,
                      download: true,
                      viewBookmark: false,
                    },
                    toolbarViewerMiddle: {
                      zoomOut: true,
                      zoomIn: true,
                      scaleSelectContainer: true,
                    },
                  },
                  errorWrapper: true,
                }
            }
        },
        methods: {
          ownerAndPetSelected(petSelectedId) {
            this.petSelectedId = petSelectedId
            this.clinicHistoryPdf = ''
            this.folios = []
            this.foliosSelected = []
            if (petSelectedId) {
              this.gettingFoliosFromThePetSelected = true
              this.$http.get(`reports/clinic-history-folios/${ petSelectedId }`).then( response => {
                this.folios = response.data
                this.gettingFoliosFromThePetSelected = false
                if (this.folios.length == 0) {
                  this.$toastr.info('La mascota no tiene registros de historia clínica')
                }
              }).catch(() => {
                this.gettingFoliosFromThePetSelected = false
              })
            }
          },
          getClinicHistoryFromPet () {
            if (this.foliosSelected.length == 0) return this.$toastr.error('Seleccione los folios que desea consultar')
            
            this.loadingResults = true
            this.clinicHistoryPdf = ''
            let folios = this.foliosSelected.map(folio => {
              return folio.number_folio
            })
            this.$http.get(`reports/clinic-history/${ this.petSelectedId }`, { responseType: 'blob', params: { folios }}).then(response => {
              this.loadingResults = false
              this.clinicHistoryPdf  = URL.createObjectURL(response.data)
            }).catch( error => {
              this.loadingResults = false
              if (error.response.status == 422) {
                this.$toastr.info('La mascota no tiene registros de historia clínica')
              }
            })
          },
          sendClinicHistoryFromPetForEmail () {
            if (this.$limitedVersion) {
              return this.$toastr.error('Esta funcionalidad no está disponible en la versión limitada')
            }

            if (this.foliosSelected.length == 0) return this.$toastr.error('Seleccione los folios que desea enviar')
            
            this.sendingClinicHistoryForEmail = true
            let folios = this.foliosSelected.map(folio => {
              return folio.number_folio
            })
            this.$http.get(`clinic-histories/${ this.petSelectedId }/send-for-email`, { params: { folios }}).then(response => {
              this.sendingClinicHistoryForEmail = false
              this.$toastr.success('El correo se envió con éxito')
            }).catch( error => {
              this.sendingClinicHistoryForEmail = false
              if (error.response.status == 422) {
                return this.$toastr.info(error.response.data.message)
              }
              this.$toastr.error('El correo no se pudo enviar')
            })
          },
          selectAllFolios () {
            this.foliosSelected = this.folios
          },
          unSelectAllFolios () {
            this.foliosSelected = []
          },
          formatDate (date) {
            return moment(date).format('LLL')
          },
          showModalWithAttachments () {
            $('#modalWithAttachments').modal('show')
          }
        },
        computed: {
          foliosSelectedFiltered() {
            return this.foliosSelected.filter(folio => folio.clinic_history_attachments.length)
          }
        },
    }
</script>
