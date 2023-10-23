<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Actividades</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Nueva actividad</h3>
            <div class="alert alert-danger" v-if="errors">
              <li v-for="(error, index) in errors" :key="index">
                {{ error[0] }}
              </li>
            </div>
            <form @submit.prevent="saveActivity()">
              <div class="row">
                <div class="col-md-8">
                  <div class="form-group">
                    <label for="">Nombre (*)</label>
                    <input type="text" class="form-control" v-model="activity.name" maxlength="80">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Duración en minutos (*)</label>
                    <input type="number" class="form-control" v-model="activity.duration">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Servicio (*)</label>
                    <v-select :options="services" label="codeAndName" :reduce="service => service.id" v-model="activity.service_id"></v-select>
                  </div>
                </div>
              </div>
              <vue-loading v-if="saving" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
              <div v-else>
                <button type="submit" class="btn btn-primary btn-sm">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar  
                </button>
                &nbsp;&nbsp;&nbsp;
                <router-link :to="{ name: 'activities.index' }" class="btn btn-danger btn-sm">
                  <i class="fa fa-fw fa-lg fa fa-times-circle"></i>Cancelar
                </router-link>
              </div>
            </form>
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
          this.getServices()
        },
        data() {
            return {
                activity: {
                  name: '',
                  duration: '',
                  service_id: '',
                },
                services: [],
                errors: null,
                saving: false,
            }
        },
        methods: {
          getServices () {
            this.$http.get('activities/get-services').then( response => {
              console.log(response.data);
              this.services = response.data
              this.services.forEach(service => {
                  this.$set(service, 'codeAndName', service.code + ' - ' + service.name)
              })
            })
          },
          saveActivity () {
            this.saving = true
            this.$http.post('activities', this.activity).then( response => {
              this.$toastr.success('Actividad registrada')
              this.saving = false
              this.errors = null
              this.activity = {
                  name: '',
                  duration: '',
                  service_id: '',
              }
            }).catch( error => {
              this.saving = false
              if (error.response.status == 422) {
                this.errors = error.response.data.errors
              }
            })
          }
        },
    }
</script>