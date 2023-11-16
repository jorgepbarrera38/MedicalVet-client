<template>
  <div>
      <div class="app-title">
          <div>
            <h1><i class="fa fa-file-text"></i> Hsitoria clínica</h1>
          </div>
      </div>
      <div class="row">
      <div class="col-md-12">
        <div class="tile">
          <div class="tile-title-w-btn">
            <h3 class="tile-title">Consentimientos informados</h3>
            <button @click="$router.push({ name: 'informed_consent.create' })"
              class="btn btn-success btn-sm">
              <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
            </button>
          </div>
          <div class="row">
            <div class="col-md-4 col-sm-6">
              <Search @data-search="getProductsFiltered" label="Identificación o nombres del propietario"/>
            </div>
          </div>
          <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
          <div class="table-responsive" v-else>
            <table class="table table-hover table-sm">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Propietario</th>
                  <th>Mascota</th>
                  <th>Procedimiento</th>
                  <th>Riesgos</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="informedConsent in informedConsents.data" :key="informedConsent.id">
                  <td nowrap>{{ formatDate(informedConsent.registration_date) }}</td>
                  <td nowrap>{{ informedConsent.pet.owner.identification + ' - ' + informedConsent.pet.owner.names + ' ' + informedConsent.pet.owner.surnames }}</td>
                  <td nowrap>{{ informedConsent.pet.name }}</td>
                  <td nowrap>{{ informedConsent.procedure.substring(0, 60) }}</td>
                  <td nowrap>{{ informedConsent.risks.substring(0, 60) }}</td>
                  <td nowrap>
                    <button class="btn btn-primary btn-sm" 
                      :disabled="informedConsent.printing"
                      @click="printInformedConsent(informedConsent)">
                      <i class="fa fa-fw fa-lg fa fa-print"></i>
                    </button>
                    &nbsp;&nbsp;&nbsp;
                    <button class="btn btn-danger btn-sm" 
                      :disabled="informedConsent.deleting"
                      @click="deleteInformedConsent(informedConsent)">
                      <i class="fa fa-fw fa-lg fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <pagination class="my-2" align="right" :limit="-1" :data="informedConsents" @pagination-change-page="getInformedConsents">
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
  import moment, { relativeTimeThreshold } from 'moment'
  export default {
    mixins: [ hasPermission ],
    components: {
      VueLoading, Search
    },
    created () {
        this.getInformedConsents()
    },
    data() {
        return {
            informedConsents: {},
            search: '',
            loading: true
        }
    },
    methods: {
      getProductsFiltered (payload) {
        this.loading = true
        this.search = payload
        this.getInformedConsents(1)
      },
      getInformedConsents (page = 1) {
        this.$http.get('clinic-histories/informed-consents?search=' + this.search + '&page=' + page).then( response => {
            this.informedConsents = response.data
            this.informedConsents.data.forEach(informedConsent => {
              this.$set(informedConsent, 'printing', false)
              this.$set(informedConsent, 'deleting', false)
            });

            this.loading = false
        }).catch( () => {
          this.loading = false
        })
      },
      printInformedConsent (informedConsent) {
        informedConsent.printing = true
        this.$http.get(`clinic-histories/informed-consents/${ informedConsent.id }/print`, { responseType: 'blob' }).then( response => {
          
          let urlInformedConsent = URL.createObjectURL(response.data)
          window.open(urlInformedConsent, '_blank')

          informedConsent.printing = false
          
        }).catch(() => {
          this.$toastr.error('El consentimiento informado no se pudo imprimir')
          informedConsent.printing = false
        })
      },
      deleteInformedConsent (informedConsent) {
        informedConsent.deleting = true
        this.$http.delete(`clinic-histories/informed-consents/${ informedConsent.id }`).then( response => {
            this.getInformedConsents()
            this.$toastr.success('Consentimiento informado eliminado')
        }).catch( errors => {
            this.$toastr.error('El consentimiento informado no se pudo eliminar')
        })
      },
      formatDate (date) {
            return moment(date).format('DD-MMM-Y, h:mm a')
        },
    },
  }
</script>

<style lang="scss" scoped>

</style>