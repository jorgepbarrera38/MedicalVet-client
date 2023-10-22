<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Diagnósticos</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Editar diagnóstico</h3>
            <div class="alert alert-danger" v-if="errors">
              <li v-for="(error, index) in errors" :key="index">
                {{ error[0] }}
              </li>
            </div>
            <form @submit.prevent="saveDiagnosis()">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="">Nombre (*)</label>
                    <input type="text" class="form-control" v-model="diagnosis.name" maxlength="50">
                  </div>
                </div>
              </div>
              <vue-loading v-if="saving" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
              <div v-else>
                <button type="submit" class="btn btn-primary btn-sm mr-1">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar
                </button>
                <router-link :to="{ name: 'diagnoses.index' }" class="btn btn-danger btn-sm mr-1">
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
          this.getDiagnosis()
        },
        data() {
            return {
                diagnosis: {
                  name: '',
                },
                errors: null,
                saving: false,
            }
        },
        methods: {
          getDiagnosis () {
            this.$http.get(`diagnoses/${ this.$route.params.id }`).then( response => {
              this.diagnosis = response.data
            })
          },
          saveDiagnosis () {
            this.saving = true
            this.$http.put(`diagnoses/${ this.$route.params.id }`, this.diagnosis).then( response => {
              this.$toastr.success('Diagnóstico actualizado')
              this.$router.push({ name: 'diagnoses.index' })
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