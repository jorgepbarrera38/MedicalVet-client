<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Motivos de cancelación</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="title">Listado de motivos de cancelación</h3>
              <!--:disabled="!hasPermission('reasonCancellations.store')"-->
              <button :disabled="!hasPermission('reason-cancellations.store')"
                @click="$router.push({ name: 'reasonCancellations.create' })"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
            </div>    
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <Search @data-search="getReasonCancellationsFiltered" label="Nombre motivo de cancelación"/>
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
                  <tr v-for="reasonCancellation in reasonCancellations.data" :key="reasonCancellation.id">
                    <td nowrap>{{ reasonCancellation.name }}</td>
                    <td nowrap>
                      <button :disabled="!hasPermission('reason-cancellations.update')"
                        class="btn btn-primary btn-sm" 
                        @click="editReasonCancellation(reasonCancellation.id)">
                        <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button :disabled="!hasPermission('reason-cancellations.destroy')"
                        class="btn btn-danger btn-sm" 
                        @click="deleteReasonCancellation(reasonCancellation.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="reasonCancellations" @pagination-change-page="getReasonCancellations">
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
import { error } from 'toastr'
    export default {
      mixins: [ hasPermission ],
      components: {
        VueLoading, Search
      },
      created () {
          this.getReasonCancellations()
      },
      data() {
          return {
              reasonCancellations: {},
              search: '',
              loading: true
          }
      },
      methods: {
        getReasonCancellationsFiltered (payload) {
          this.loading = true
          this.search = payload
          this.getReasonCancellations(1)
        },
        getReasonCancellations (page = 1) {
          this.$http.get('reason-cancellations?search=' + this.search + '&page=' + page).then( response => {
              this.reasonCancellations = response.data
              this.loading = false
          })
        },
        editReasonCancellation (id) {
          this.$router.push({ name: 'reasonCancellations.edit', params: { id } })
        },
        deleteReasonCancellation (id) {
          this.$http.delete(`reason-cancellations/${ id }`).then( response => {
              this.getReasonCancellations()
              this.$toastr.success('Motivo de cancelación eliminado')
          }).catch( errors => {
            if (errors.response.status == 422) {
              this.$toastr.error(errors.response.data.message)
            }
          })
        }
      }
    }
</script>