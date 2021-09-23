<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-cog"></i> Parámetros</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="title">Parámetros</h3>
            </div>
            <div class="alert alert-danger" v-if="errors">
                <li v-for="(error, index) in errors" :key="index">
                    {{ error[0] }}
                </li>
            </div>
            <form @submit.prevent="saveOrUpdateParameters">
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="">Horas para actualización de productos y servicios aplicados (*)</label>
                            <input type="number" class="form-control" 
                                v-model="parameters.hours_products_and_services_applied">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="">Días para alertar vacunas (*)</label>
                            <input type="number" class="form-control" 
                                v-model="parameters.days_alert_vaccines">
                        </div>
                    </div>
                </div>
                <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                <div v-else>
                    <button type="submit" class="btn btn-primary">
                        <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar
                    </button>
                </div>
            </form>
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
          this.getParameters()
      },
      data() {
          return {
              parameters: {
                hours_products_and_services_applied: '',
                days_alert_vaccines: '',
              },
              errors: null,
              loading: true
          }
      },
      methods: {
        getParameters () {
          this.$http.get('parameters').then( response => {
              if (response.data) {
                  this.parameters = response.data
              }
              this.loading = false
          }).catch(() => {
              this.loading = false
          })
        },
        saveOrUpdateParameters () {
            this.loading = true

            this.$http.put('parameters', this.parameters).then( response => {
                this.loading = false
                this.errors = null
                this.$toastr.success('Datos actualizados exitosamente')
            }).catch(error => {
                this.loading = false
                if (error.response.status == 422) {
                    this.errors = error.response.data.errors
                }
            })
        }
      }
    }
</script>