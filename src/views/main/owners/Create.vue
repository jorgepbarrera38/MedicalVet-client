<template>
    <div>
        <div class="app-title" v-if="!showAsComponent">
            <div>
              <h1><i class="fa fa-users"></i> Propietarios</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Nuevo propietario</h3>
            <div class="alert alert-danger" v-if="errors">
              <li v-for="(error, index) in errors" :key="index">
                {{ error[0] }}
              </li>
            </div>
            <form @submit.prevent="saveOwner()">
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Identificación (*)</label>
                    <input type="text" class="form-control" v-model="owner.identification" maxlength="15">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Nombres (*)</label>
                    <input type="text" class="form-control" v-model="owner.names" maxlength="40">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Apellidos (*)</label>
                    <input type="text" class="form-control" v-model="owner.surnames" maxlength="40">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Ciudad (*)</label>
                    <select class="form-control" v-model="owner.city_id">
                      <option value="">Seleccione ciudad</option>
                      <option :value="city.id" v-for="city in cities" :key="city.id">
                        {{ city.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Dirección</label>
                    <input type="text" class="form-control" v-model="owner.address" maxlength="130">
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group">
                    <label for="">Teléfono 1</label>
                    <input type="text" class="form-control" v-model="owner.phonenumber" maxlength="12">
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group">
                    <label for="">Teléfono 2</label>
                    <input type="text" class="form-control" v-model="owner.phonenumber2" maxlength="12">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Correo electrónico</label>
                    <input type="email" class="form-control" v-model="owner.email" maxlength="40">
                  </div>
                </div>
              </div>
              <vue-loading v-if="saving" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
              <div v-else>
                <button type="submit" class="btn btn-primary">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar
                </button>
                &nbsp;&nbsp;&nbsp;
                <router-link :to="{ name: 'owners.index' }" class="btn btn-danger" v-if="!showAsComponent">
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
        props: {
          showAsComponent: {
            type: Boolean,
            default: false
          }
        },
        created () {
          this.getCities()
        },
        data() {
            return {
                owner: {
                  identification: '',
                  names: '',
                  surnames: '',
                  address: '',
                  phonenumber: '',
                  phonenumber2: '',
                  email: '',
                  city_id: ''
                },
                cities: [],
                errors: null,
                saving: false,
            }
        },
        methods: {
          getCities () {
            this.$http.get('owners/get-cities').then( response => {
              this.cities = response.data
            })
          },
          saveOwner () {
            if (this.showAsComponent && this.$limitedVersion) {
              return this.$toastr.error('Esta funcionalidad no está disponible en la versión limitada')
            }            
            this.saving = true
            this.$http.post('owners', this.owner).then( response => {
              this.$toastr.success('Propietario registrado')
              this.$emit('owner-registered')
              this.saving = false
              this.errors = null
              this.owner = {
                  identification: '',
                  names: '',
                  surnames: '',
                  address: '',
                  phonenumber: '',
                  email: ''
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

<style lang="scss" scoped>

</style>