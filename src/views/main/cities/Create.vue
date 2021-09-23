<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Ciudades</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Nueva ciudad</h3>
            <div class="alert alert-danger" v-if="errors">
              <li v-for="(error, index) in errors" :key="index">
                {{ error[0] }}
              </li>
            </div>
            <form @submit.prevent="saveCity()">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="">Nombre (*)</label>
                    <input type="text" class="form-control" v-model="city.name" maxlength="40">
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="">Departamento (*)</label>
                    <select class="form-control" v-model="city.state_id">
                      <option value="">Seleccione departamento</option>
                      <option :value="state.id" v-for="state in states" :key="state.id">{{ state.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <vue-loading v-if="saving" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
              <div v-else>
                <button type="submit" class="btn btn-primary">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar
                </button>
                &nbsp;&nbsp;&nbsp;
                <router-link :to="{ name: 'cities.index' }" class="btn btn-danger">
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
          this.getStates()
        },
        data() {
            return {
                city: {
                  name: '',
                  state_id: ''
                },
                states: [],
                errors: null,
                saving: false,
            }
        },
        methods: {
          getStates () {
            this.$http.get('cities/get-states').then( response => {
              this.states = response.data
            })
          },
          saveCity () {
            this.saving = true
            this.$http.post('cities', this.city).then( response => {
              this.$toastr.success('Ciudad registrada')
              this.saving = false
              this.errors = null
              this.city.name = ''
              this.city.state_id = ''
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