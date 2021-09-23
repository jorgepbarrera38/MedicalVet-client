<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Razas</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Editar raza</h3>
            <div class="alert alert-danger" v-if="errors">
              <li v-for="(error, index) in errors" :key="index">
                {{ error[0] }}
              </li>
            </div>
            <form @submit.prevent="saveRace()">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="">Nombre (*)</label>
                    <input type="text" class="form-control" v-model="race.name" maxlength="40">
                  </div>
                </div>
              </div>
              <vue-loading v-if="saving" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
              <div v-else>
                <button type="submit" class="btn btn-primary">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar
                </button>
                &nbsp;&nbsp;&nbsp;
                <router-link :to="{ name: 'races.index' }" class="btn btn-danger">
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
          this.getRace()
        },
        data() {
            return {
                race: {
                  name: '',
                },
                errors: null,
                saving: false,
            }
        },
        methods: {
          getRace () {
            this.$http.get(`races/${ this.$route.params.id }`).then( response => {
              this.race = response.data
            })
          },
          saveRace () {
            this.saving = true
            this.$http.put(`races/${ this.$route.params.id }`, this.race).then( response => {
              this.$toastr.success('Raza actualizada')
              this.$router.push({ name: 'races.index' })
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