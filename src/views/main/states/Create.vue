<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Departamentos</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Nuevo departamento</h3>
            <div class="alert alert-danger" v-if="errors">
              <li v-for="(error, index) in errors" :key="index">
                {{ error[0] }}
              </li>
            </div>
            <form @submit.prevent="saveState()">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="">Nombre (*)</label>
                    <input type="text" class="form-control" v-model="state.name" maxlength="40">
                  </div>
                </div>
              </div>
              <vue-loading v-if="saving" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
              <div v-else>
                <button type="submit" class="btn btn-primary">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar
                </button>
                &nbsp;&nbsp;&nbsp;
                <router-link :to="{ name: 'states.index' }" class="btn btn-danger">
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
        data() {
            return {
                state: {
                  name: '',
                },
                errors: null,
                saving: false,
            }
        },
        methods: {
          saveState () {
            this.saving = true
            this.$http.post('states', this.state).then( response => {
              this.$toastr.success('Departamento registrado')
              this.saving = false
              this.errors = null
              this.state.name = ''
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