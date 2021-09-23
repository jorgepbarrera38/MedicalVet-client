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
            <div class="tile-title-w-btn">
              <h3 class="title">Listado de productos</h3>
              <button :disabled="!hasPermission('products.store')"
                @click="$router.push({ name: 'products.create' })"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
            </div>
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <Search @data-search="getProductsFiltered" label="Nombre del producto"/>
              </div>
            </div>
            <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <div class="table-responsive" v-else>
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th nowrap>Control de vacunas</th>
                    <th nowrap>Control de desparasitación</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in products.data" :key="product.id">
                    <td nowrap>{{ product.name }}</td>
                    <td nowrap>
                      <input type="checkbox" :checked="product.vaccine">
                    </td>
                    <td nowrap>
                      <input type="checkbox" :checked="product.deworming">
                    </td>
                    <td nowrap>
                      <button class="btn btn-primary btn-sm" 
                        :disabled="!hasPermission('products.update')"
                        @click="editProduct(product.id)">
                        <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button class="btn btn-danger btn-sm" 
                        :disabled="!hasPermission('products.destroy')"
                        @click="deleteProduct(product.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="products" @pagination-change-page="getProducts">
              <span slot="prev-nav">&lt; Anterior</span>
              <span slot="next-nav">Siguiente &gt;</span>
            </pagination>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import hasPermission from '../_utilities/hasPermission'
    import { VueLoading } from 'vue-loading-template'
    import Search from '../_components/Search'
    export default {
      mixins: [ hasPermission ],
      components: {
        VueLoading, Search
      },
      created () {
          this.getProducts()
      },
      data() {
          return {
              products: {},
              search: '',
              loading: true
          }
      },
      methods: {
        getProductsFiltered (payload) {
          this.loading = true
          this.search = payload
          this.getProducts(1)
        },
        getProducts (page = 1) {
          this.$http.get('products?search=' + this.search + '&page=' + page).then( response => {
              this.products = response.data
              this.loading = false
          }).catch( () => {
            this.loading = false
          })
        },
        editProduct (id) {
          this.$router.push({ name: 'products.edit', params: { id } })
        },
        deleteProduct (id) {
          this.$http.delete(`products/${ id }`).then( response => {
              this.getProducts()
              this.$toastr.success('Producto eliminado')
          }).catch( errors => {
            if (errors.response.status == 422) {
              this.$toastr.error('El producto no se puede eliminar ya que tiene historias clínicas relacionadas')
            }
          })
        }
      },
    }
</script>

<style lang="scss" scoped>

</style>