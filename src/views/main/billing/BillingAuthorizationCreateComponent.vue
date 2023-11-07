<template>
    <div>
        <div class="row">
          <div class="col-md-12">
            <div class="alert alert-danger" v-if="errors">
              <li v-for="(error, index) in errors" :key="index">
                {{ error[0] }}
              </li>
            </div>
            <div class="form-group">
              <label for="">Código</label>
              <input type="text" class="form-control" v-model="authorization.code">
            </div> 
            <div class="form-group">
              <label for="">Nombre</label>
              <input type="text" class="form-control" v-model="authorization.name">
            </div> 
            <div class="form-group">
              <label for="" class="mr-2">Maneja prefijo</label>
              <input type="checkbox" v-model="authorization.handles_prefix">
            </div> 
            <button type="submit" class="btn btn-primary btn-sm" @click="saveAuthorization" :disabled="saving">
                  <i  class="fa fa-fw fa-lg fa-save"></i>Guardar <span v-if="saving" class="spinner-border spinner-border-sm ml-1"></span>
                </button>
          </div>
      </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    
    export default {
      data() {
          return {
            authorization: {
              code: '',
              name: '',
              handles_prefix: false,
            },
            saving: false,
            errors: null
          }
      },
      methods: {
        openModalToRegisterAuthorization () {
            $('#modalForRegisterAuthorization').modal('show')
        },
        saveAuthorization () {
          this.saving = true

          this.$http.post('bill/billing-authorization', this.authorization).then( response => {
            this.$toastr.success('Autorización de facturación registrada')
            this.authorization = {
              code: '',
              name: '',
              handles_prefix: false,
            }
            this.errors = null
            this.saving = false
            this.$emit('authorization-saved')
          }).catch( error => {
              this.saving = false
              if (error.response.status == 422) {
                this.errors = error.response.data.errors
              }
            })
        }
      }
    }
</script>

<style lang="scss" scoped>

</style>