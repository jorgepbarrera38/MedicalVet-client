<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-user"></i> Usuarios</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Editar usuario</h3>
            <div class="alert alert-danger" v-if="errors">
              <li v-for="(error, index) in errors" :key="index">
                {{ error[0] }}
              </li>
            </div>
            <form @submit.prevent="updateUser()">
              <div class="row">
                <div class="col-md-3">
                  <div class="form-group">
                    <label for="">Nombre de usuario (*)</label>
                    <input type="text" class="form-control" v-model="user.username" maxlength="30">
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label for="">Identificación (*)</label>
                    <input type="text" class="form-control" v-model="user.identification" maxlength="15">
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label for="">Nombres (*)</label>
                    <input type="text" class="form-control" v-model="user.names" maxlength="50">
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label for="">Apellidos (*)</label>
                    <input type="text" class="form-control" v-model="user.surnames" maxlength="50">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-3">
                  <div class="form-group">
                    <label for="">Contraseña (*)</label>
                    <input type="text" class="form-control" v-model="user.password" maxlength="15">
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label for="">Firma</label>
                    <input type="file" class="form-control" @change="setImageFromSignature">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">Matrícula profesional</label>
                    <input type="text" class="form-control" v-model="user.professional_register" maxlength="40">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Usuario es veterinario</label>
                    <input type="checkbox" v-model="user.is_vet">
                  </div>
                </div>
              </div>
              <div class="row" v-if="user.signature">
                <div class="col-md-4">
                  <div class="form-group">
                    <img :src="$APP_URL + user.signature" width="190" alt="">
                  </div>
                </div>
              </div>
              <vue-loading v-if="saving" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
              <div v-else>
                <button type="submit" class="btn btn-primary btn-sm mr-1">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar
                </button>
                <router-link :to="{ name: 'users.index' }" class="btn btn-danger btn-sm">
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
          this.getUser()
        },
        data() {
            return {
                user: {
                  username: '',
                  identification: '',
                  names: '',
                  surnames: '',
                  password: '',
                  signature: '',
                  signatureNew: '',
                  is_vet: false,
                  professional_register: '',
                },
                errors: null,
                saving: false,
            }
        },
        methods: {
          getUser () {
            this.$http.get(`users/${ this.$route.params.id }`).then( response => {
              this.user = response.data
            })
          },
          updateUser () {
            this.saving = true

            let data = new FormData
            data.append('_method', 'put')
            data.append('username', this.user.username)
            data.append('identification', this.user.identification)
            data.append('names', this.user.names)
            data.append('surnames', this.user.surnames)
            if (this.user.password) {
              data.append('password', this.user.password)
            }
            if (this.user.signatureNew) {
              data.append('signature', this.user.signatureNew)
            }
            data.append('is_vet', this.user.is_vet ? 1 : 0)
            data.append('professional_register', this.user.professional_register ? this.user.professional_register : '')

            this.$http.post(`users/${ this.$route.params.id }`, data).then( response => {
              this.$toastr.success('Usuario actualizado')
              this.$router.push({ name: 'users.index' })
            }).catch( error => {
              this.saving = false
              if (error.response.status == 422) {
                this.errors = error.response.data.errors
              }
            })
          },
          setImageFromSignature (e) {
            this.user.signatureNew = e.target.files[0]
          }
        },
    }
</script>

<style lang="scss" scoped>

</style>