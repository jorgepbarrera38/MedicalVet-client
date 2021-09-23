<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Unidades</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Editar unidad</h3>
            <div class="alert alert-danger" v-if="errors">
              <li v-for="(error, index) in errors" :key="index">
                {{ error[0] }}
              </li>
            </div>
            <form @submit.prevent="saveUnity()">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="">Descripción (*)</label>
                    <input type="text" class="form-control" v-model="unity.description" maxlength="40">
                  </div>
                </div>
              </div>
              <vue-loading v-if="saving" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
              <div v-else>
                <button type="submit" class="btn btn-primary">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar
                </button>
                &nbsp;&nbsp;&nbsp;
                <router-link :to="{ name: 'unities.index' }" class="btn btn-danger">
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
          this.getUnity()
        },
        data() {
            return {
                unity: {
                  description: '',
                },
                errors: null,
                saving: false,
            }
        },
        methods: {
          getUnity () {
            this.$http.get(`unities/${ this.$route.params.id }`).then( response => {
              this.unity = response.data
            })
          },
          saveUnity () {
            this.saving = true
            this.$http.put(`unities/${ this.$route.params.id }`, this.unity).then( response => {
              this.$toastr.success('Unidad actualizada')
              this.$router.push({ name: 'unities.index' })
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