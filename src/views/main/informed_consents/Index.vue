<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-file-text"></i> Historia clínica</h1>
            </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="tile">
              <h3 class="tile-title">Consentimiento informado</h3>
              <SearchOwnersAndPets 
                @owner-selected="setOwnerSelected"
                @pet-selected="petOwnerSelected"
                @searching="setStateFromLoading"
                :identification="this.$route.query.identification"
                :pet_id="this.$route.query.pet"
                :sizeFromColumnField="12">
              </SearchOwnersAndPets>
              <div class="row">
                <div class="form-group col-md-12">
                  <label for="">Procedimiento</label>
                  <textarea rows="3" class="form-control" v-model="process" maxlength="400"></textarea>
                </div>
                <div class="form-group col-md-12">
                  <label for="">Riesgos, consecuentas y efectos colaterales</label>
                  <textarea rows="3" class="form-control" v-model="risks" maxlength="400"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label for="">Consentimiento informado</label>
                <select class="form-control" v-model="informedConsentTemplateSelected">
                  <option value="">Seleccione opción</option>
                  <option :value="informedConsentTemplate.id" v-for="informedConsentTemplate in informedConsentTemplates" 
                        :key="informedConsentTemplate.id">
                        {{ informedConsentTemplate.name }}
                  </option>
                </select>
              </div>
              <div>
                <button :disabled="!ownerSelected || !petSelected || !informedConsentTemplateSelected || loadingResults" class="btn btn-primary btn-sm mb-1" @click="getInformedConsentPdf">
                  <i class="fa fa-fw fa-lg fa-search"></i>Generar
                </button>
              </div>
              <!--Motivo-->
            </div>
            <vue-loading v-if="loadingResults" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
          </div>
          <div class="col-md-8">
            <div class="tile" style="height:80vh">
                <vue-pdf-app :pdf="informedConsentPdf" :title="true" :config="configViewerPdf"></vue-pdf-app>
                <!--<iframe :src="informedConsentPdf" style="border:none"
                    width="100%" height="100%" >
                </iframe>-->
            </div>
        </div>
      </div>
    </div>
</template>
<script>
    import SearchOwnersAndPets from './../_components/SearchOwnersAndPets'
    import { VueLoading } from 'vue-loading-template'
    import moment from 'moment'
    moment.locale('es')
    import VuePdfApp from "vue-pdf-app"
    export default {
        components: {
          VueLoading, SearchOwnersAndPets, VuePdfApp
        },
        created () {
          this.getInformedConsentTemplates()
        },
        mounted () {
          document.getElementsByClassName('toolbar')[0].style.setProperty('z-index', 0)
        },
        data() {
            return {
                owners: [],
                ownerSelected: '',
                petsFromOwner: '',
                petSelected: '',
                informedConsentTemplateSelected: '',
                process: '',
                risks: '',
                informedConsentPdf: undefined,
                informedConsentTemplates: [],
                loadingResults: false,
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
          getInformedConsentTemplates () {
            this.$http.get(`informed-consents/get-informed-consents-templates`).then(response => {
              this.informedConsentTemplates = response.data
            })
          },
          getInformedConsentPdf () {

            this.loadingResults = true
            this.informedConsentPdf = ''

            this.$http.get(`informed-consents/${ this.petSelected }/${ this.informedConsentTemplateSelected }`, 
                        { responseType: 'blob', params: { process: this.process, risks: this.risks }}).then(response => {
              this.loadingResults = false
              //this.informedConsentPdf  = URL.createObjectURL(response.data)
              var reader = new FileReader();
              let _this = this
              reader.readAsDataURL(response.data); 
              reader.onloadend = function() {
                  var base64data = reader.result;                
                  _this.informedConsentPdf = base64data
              }
            }).catch( error => {
              this.loadingResults = false
              if(error.response.status == 422) {
                error.response.data.text().then(message => this.$toastr.error(JSON.parse(message).message))
              }
            })
          },
          setOwnerSelected (payload) {
            this.ownerSelected = payload
          },
          petOwnerSelected(payload) {
            this.petSelected = payload
          },
          setStateFromLoading (payload) {
            this.loadingResults = payload
          },
          formatDate (date) {
            return moment(date).format('LLL')
          },
        },
    }
</script>