<template>
  <div>
      <!--inicio modal vacunas-->
      <div class="modal fade bd-example-modal-lg" id="modalProductsApplied" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
              <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Producto aplicado</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
              </div>
              <div class="modal-body">
                  <div class="alert alert-danger" v-if="errors">
                      <li v-for="(error, index) in errors" :key="index">
                          {{ error[0] }}
                      </li>
                  </div>
                  <!---->

                  <div class="row">
                    <div class="col-md-8">
                      <div class="form-group">
                        <label for="">Producto (*)</label>
                        <v-select :options="productsDB" label="codeAndName" v-model="productSelected"></v-select>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label for="">Cantidad (*)</label>
                        <input type="number" class="form-control" v-model="quantityproductApplied">
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group">
                        <label for="">Observaciónes</label>
                        <input type="text" class="form-control" v-model="observationsproductApplied" maxlength="1500">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label for=""></label>
                        <button class="btn btn-primary btn-sm" @click="addproductApplied">
                          <i class="fa fa-plus"></i> Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="table-responsive">
                        <table class="table table-hover table-sm">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Observaciónes</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(product, index) in products" :key="'prodpet' + index">
                              <td nowrap>{{ product.name }}</td>
                              <td nowrap>{{ product.quantity }}</td>
                              <td nowrap>{{ product.observations }}</td>
                              <td nowrap>
                                <button class="btn btn-danger btn-sm" @click="deleteRegistry(index)">
                                  <i class="fa fa-fw fa-lg fa fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <!---->
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-primary btn-sm mr-1" @click="registerProductsApplied" :disabled="saving">
                      <i  class="fa fa-fw fa-lg fa fa-save"></i> Registrar <span v-if="saving" class="spinner-border spinner-border-sm ml-1"></span>
                  </button>
                  <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
              </div>
          </div>
          </div>
      </div>
      <!--Fin modal vacunas-->
  </div>
</template>
<script>
import { VueLoading } from 'vue-loading-template'
export default {
  components: {
      VueLoading
  },
  props: [ 'pet_id' ],
  created() {
      this.getDataToRegisterProductsAndServicesApplied()
  },
  data() {
      return {
        productSelected: null,
        quantityproductApplied: null,
        observationsproductApplied: null,
        products: [],
        productsDB: [],
        errors: null,
        saving: false,
      }
  },
  methods: {
    getDataToRegisterProductsAndServicesApplied () {
      this.$http.get(`reports/get-data-to-register-products-and-services-applied`).then( response => {
    
        this.productsDB = response.data.products
        this.productsDB.forEach(productDB => {
          this.$set(productDB, 'codeAndName', productDB.code + ' - ' + productDB.name)
        });

      })
    },
    registerProductsApplied () {
        if (!this.pet_id) {
          return this.$toastr.info('Seleccione mascota')
        }

        this.saving = true

        let data = new FormData()
        this.products.forEach((product, index) => {
          data.append(`products[${index}][product_id]`, product.product_id)
          data.append(`products[${index}][quantity]`, product.quantity)
          data.append(`products[${index}][observations]`, product.observations ? product.observations : '')
        })

        this.$http.post(`reports/register-products-applied/${this.pet_id}`, data ).then( response => {

            this.productSelected = null
            this.quantityproductApplied = null
            this.observationsproductApplied = null
            this.products = []
            this.errors = null
            this.saving = false
            this.$toastr.success('Productos aplicados registrados')
            this.$emit('productAppliedRegistered')

        }).catch( error => {
          this.saving = false
            if (error.response.status == 422) {
              this.errors = error.response.data.errors
            } else {
              this.$toastr.error('Error al guardar')
            }
          })

    },
    addproductApplied () {
        if (!this.productSelected || !this.quantityproductApplied) {
          return this.$toastr.error('Diligencie los datos del producto')
        }

        if (this.quantityproductApplied <= 0 || this.quantityproductApplied > 1000) {
          return this.$toastr.error('La cantidad debe ser estar entre 1 y 1000')
        }

        let data = {
          product_id: this.productSelected.id,
          name: this.productSelected.name,
          quantity: this.quantityproductApplied,
          observations: this.observationsproductApplied
        }
        this.products.push(data)
        this.productSelected = null
        this.quantityproductApplied = null
        this.observationsproductApplied = null
      },
      deleteRegistry (index) {
        this.products.splice(index, 1)
      },
  },
}
</script>