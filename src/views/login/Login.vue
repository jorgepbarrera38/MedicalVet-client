<template>
    <div>
        <section class="material-half-bg">
      <div class="cover"></div>
    </section>
    <section class="login-content">
      <div class="logo">
        <h1>Medical Vet</h1>
      </div>
      <div class="login-box" style="min-height:490px">
        <form class="login-form" @submit.prevent="login" style="padding-top: 20px;">
          <div class="text-center mb-3">
            <img :src="$APP_URL + $APP_LOGO" alt="" width="150px">
          </div>
          <h3 class="login-head"><i class="fa fa-lg fa-fw fa-user"></i>Iniciar sesión</h3>
          <div class="form-group">
            <label class="control-label">NOMBRE DE USUARIO</label>
            <input class="form-control" type="text" placeholder="Usuario" autofocus v-model="user.username">
          </div>
          <div class="form-group">
            <label class="control-label">CONTRASEÑA</label>
            <input class="form-control" type="password" placeholder="Contraseña" v-model="user.password">
          </div>
          <div class="form-group btn-container">
            <vue-loading v-if="logining" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
            <button v-else type="submit" class="btn btn-primary btn-block"><i class="fa fa-sign-in fa-lg fa-fw"></i>Ingresar</button>
          </div>
        </form>
      </div>
    </section>
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
                user: {
                    username: '',
                    password: ''
                },
                logining: false
            }
        },
        methods: {
            login () {
                this.logining = true
                this.$http.post('auth/login', this.user).then(response => {
                    localStorage.setItem('access_token', response.data.access_token)
                    localStorage.setItem('names_user', response.data.user.names)
                    localStorage.setItem('name_user', response.data.user.username)
                    localStorage.setItem('permissions', JSON.stringify(response.data.user.permissions))
                    this.$http.defaults.headers.common['authorization'] = 'bearer ' + response.data.access_token
                    this.$router.push({ name: 'dashboard.index' })
                }).catch( error => {
                    this.logining = false
                    if (error.response.status == 401) {
                        this.$toastr.error('Usuario o contraseña no válido')
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>