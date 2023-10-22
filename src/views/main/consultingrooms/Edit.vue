<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Consultorios</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Editar consultorio</h3>
            <div class="alert alert-danger" v-if="errors">
              <li v-for="(error, index) in errors" :key="index">
                {{ error[0] }}
              </li>
            </div>
            <form @submit.prevent="saveConsultingroom()">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="">Nombre (*)</label>
                    <input type="text" class="form-control" v-model="consultingroom.name" maxlength="80">
                  </div>
                </div>
              </div>
              <vue-loading v-if="saving" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
              <div v-else>
                <button type="submit" class="btn btn-primary btn-sm mr-1">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar
                </button>
                <router-link :to="{ name: 'consultingrooms.index' }" class="btn btn-danger btn-sm">
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
          this.getConsultingroom()
        },
        data() {
            return {
                consultingroom: {
                  name: ''
                },
                errors: null,
                saving: false,
            }
        },
        methods: {
          getConsultingroom () {
            this.$http.get(`consultingrooms/${ this.$route.params.id }`).then( response => {
              this.consultingroom = response.data
            })
          },
          saveConsultingroom () {
            this.saving = true
            this.$http.put(`consultingrooms/${ this.$route.params.id }`, this.consultingroom).then( response => {
              this.$toastr.success('Consultorio actualizado')
              this.$router.push({ name: 'consultingrooms.index' })
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