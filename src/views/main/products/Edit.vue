<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-folder-open"></i> Productos</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Editar producto</h3>
            <div class="alert alert-danger" v-if="errors">
              <li v-for="(error, index) in errors" :key="index">
                {{ error[0] }}
              </li>
            </div>
            <form @submit.prevent="saveProduct()">
              <div class="row">
                <div class="col-md-3">
                  <div class="form-group">
                    <label for="">Código (*)</label>
                    <input type="text" class="form-control" v-model="product.code" maxlength="20">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="">Nombre (*)</label>
                    <input type="text" class="form-control" v-model="product.name" maxlength="90">
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label for="">Precio (*)</label>
                    <input type="number" class="form-control" v-model="product.price">
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="">Control de vacunas</label>
                    <input type="checkbox" v-model="product.vaccine">
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="">Control de desparasitación</label>
                    <input type="checkbox" v-model="product.deworming">
                  </div>
                </div>
              </div>
              <vue-loading v-if="saving" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
              <div v-else>
                <button type="submit" class="btn btn-primary btn-sm mr-1">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar
                </button>
                <router-link :to="{ name: 'products.index' }" class="btn btn-danger btn-sm">
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
          this.getProduct()
        },
        data() {
            return {
                product: {
                  code: '',
                  name: '',
                  price: '',
                  vaccine: false,
                  deworming: false
                },
                errors: null,
                saving: false,
            }
        },
        methods: {
          getProduct () {
            this.$http.get(`products/${ this.$route.params.id }`).then( response => {
              this.product = response.data
            })
          },
          saveProduct () {
            this.saving = true
            this.$http.put(`products/${ this.$route.params.id }`, this.product).then( response => {
              this.$toastr.success('Producto actualizado')
              this.$router.push({ name: 'products.index' })
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