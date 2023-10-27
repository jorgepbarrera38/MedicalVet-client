<template>
    <span>
        <!--inicio modal buscar propietarios-->
    <div class="modal fade" id="productsAndServicesModal" tabindex="-1" role="dialog" aria-labelledby="productsAndServicesModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="productsAndServicesModalLabel">Productos y servicios</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">

                      <form @submit.prevent="searchingProductsAndServices=true;getProductsAndServices()" class="row">
                        <div class="form-group col-md-9">
                          <input type="text" class="form-control" v-model="searchProductAndService">
                        </div>
                        <div class="form-group col-md-3">
                          <button :disabled="searchingProductsAndServices" class="btn btn-primary" type="submit">
                            <i class="fa fa-search"></i> Buscar
                          </button>
                        </div>
                        <div v-if="searchingProductsAndServices" class="form-group col-md-12">
                          <vue-loading type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                        </div>
                      </form>
                      
                    <div class="table-responsive" v-if="!searchingProductsAndServices">
                      <table class="table table-hover table-sm">
                        <thead>
                          <th></th>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                        </thead>
                        <tbody>
                          <tr v-for="productOrService in productsAndServices.data" :key="productOrService.type + '-' + productOrService.id">
                            <th nowrap>
                              <button class="btn btn-info btn-sm" @click="selectProductAndService(productOrService)">
                                <i class="fa fa-fw fa fa-check"></i>
                              </button>
                            </th>
                            <td nowrap>{{ productOrService.code }}</td>
                            <td nowrap>{{ productOrService.name }}</td>
                            <td nowrap>${{ productOrService.price | convertMoney }}</td>
                            <td nowrap>
                                <input type="number" class="form-control" v-model="productOrService.quantity">
                            </td>
                            <td>${{ productOrService.price * productOrService.quantity | convertMoney }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <pagination class="my-2" align="right" :limit="-1" :data="productsAndServices" @pagination-change-page="getProductsAndServices">
                      <span slot="prev-nav">&lt; Anterior</span>
                      <span slot="next-nav">Siguiente &gt;</span>
                    </pagination>
                    <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
            <!--Fin modal buscar propietarios-->
            <button class="btn btn-success btn-sm" @click="openModalForSelectProductsAndServices()">
                <i class="fa fa-fw fa-lg fa-plus"></i>
            </button>
    </span>
</template>
<script>
    import { VueLoading } from 'vue-loading-template'
    export default {
        components: { VueLoading },
        created () {
            this.getProductsAndServices()
        },
        data () {
            return {
                searchProductAndService: '',
                productsAndServices: {},
                searchingProductsAndServices: true
            }
        },
        methods: {
            getProductsAndServices (page = 1) {
                this.$http.get(`billings/get-products-and-services?q=${ this.searchProductAndService }&page=${ page }`).then( response => {
                this.productsAndServices = response.data
                this.productsAndServices.data.forEach(productOrService => {
                    this.$set(productOrService, 'quantity', 1)
                });
                this.searchingProductsAndServices = false
              })
            },
            selectProductAndService (productOrService) {
                this.$emit('product-or-service-selected', productOrService)
            },
            openModalForSelectProductsAndServices () {
                $('#productsAndServicesModal').modal('show')
            }
        }
    }
</script>