<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Servicios</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Editar servicio</h3>
            <div class="alert alert-danger" v-if="errors">
              <li v-for="(error, index) in errors" :key="index">
                {{ error[0] }}
              </li>
            </div>
            <form @submit.prevent="saveService()">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="">Nombre (*)</label>
                    <input type="text" class="form-control" v-model="service.name" maxlength="100">
                  </div>
                </div>
              </div>
              <vue-loading v-if="saving" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
              <div v-else>
                <button type="submit" class="btn btn-primary">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar
                </button>
                &nbsp;&nbsp;&nbsp;
                <router-link :to="{ name: 'services.index' }" class="btn btn-danger">
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
          this.getService()
        },
        data() {
            return {
                service: {
                  name: '',
                },
                errors: null,
                saving: false,
            }
        },
        methods: {
          getService () {
            this.$http.get(`services/${ this.$route.params.id }`).then( response => {
              this.service = response.data
            })
          },
          saveService () {
            this.saving = true
            this.$http.put(`services/${ this.$route.params.id }`, this.service).then( response => {
              this.$toastr.success('Servicio actualizado')
              this.$router.push({ name: 'services.index' })
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

<style lang="scss" scoped>

</style>