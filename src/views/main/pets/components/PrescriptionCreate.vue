<template>
    <div>
      <button class="btn btn-primary btn-sm" @click="addPrescription()">
          <i class="fa fa-fw fa-lg fa fa-plus"></i> Nuevo
      </button>
      <div class="modal fade" id="addPrescriptionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Registra receta veterinaria</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                
                <div class="row">
                  <div class="col-md-12">
                    <div class="alert alert-danger" v-if="errors">
                      <li v-for="(error, index) in errors" :key="index">
                        {{ error[0] }}
                      </li>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="">Producto (*)</label>
                      <v-select :options="products" label="name" v-model="productToAddToPrescription.product"></v-select>
                    </div>
                    <div class="form-group">
                      <label for="">Cantidad (*)</label>
                      <input type="number" class="form-control" v-model="productToAddToPrescription.quantity">
                    </div>
                    <div class="form-group">
                      <label for="">Posología (*)</label>
                      <textarea rows="4" class="form-control" v-model="productToAddToPrescription.posology" maxlength="500"></textarea>
                    </div>
                    <div class="form-group">
                      <button class="btn btn-primary btn-sm" @click="addProductToPrescription"><i class="fa fa-plus"></i> Agregar</button>
                    </div>
                  </div>
                  <div class="col-md-8">
                    <div class="table-responsive" style="min-height:300px;max-height:300px;overflow:auto">
                      <table class="table table-hover table-sm">
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Posología</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(product, index) in newPrescription.products" :key="'productsFromPrescription-' + index">
                            <td>{{ product.product_name }}</td>
                            <td nowrap>{{ product.quantity }}</td>
                            <td>{{ product.posology }}</td>
                            
                            <td nowrap>
                              <button class="btn btn-danger btn-sm" @click="deleteProductFromPrescription(index)">
                                <i class="fa fa-fw fa-lg fa fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group">
                      <label for="">Observaciónes</label>
                      <textarea rows="4" class="form-control" v-model="newPrescription.observations" maxlength="800"></textarea>                                                    
                    </div>
                  </div>
                </div>
                
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary btn-sm mr-1" @click="savePrescription" :disabled="savingPrescription">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i> Guardar <span v-if="savingPrescription" class="spinner-border spinner-border-sm ml-1"></span>
              </button>
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
moment.locale('es')
    export default {
        props: ['pet_id'],
        created () {
          this.getProducts()
        },
        data() {
            return {
              productToAddToPrescription: {
                  product: {},
                  quantity: '',
                  posology: '',
              },
              products: [],
              newPrescription: {
                products: [],
                observations: '',
              },
              savingPrescription: false,
              errors: null
            }
        },
        methods: {
          getProducts () {
            this.$http.get('prescriptions/get-products').then( response => {
              
              this.products = response.data

            })
          },
          addPrescription () {
            $('#addPrescriptionModal').modal('show')
          },
          addProductToPrescription () {
            if (!this.productToAddToPrescription.product || !Object.keys(this.productToAddToPrescription.product).length) {
              return this.$toastr.error('Seleccione el producto')
            }

            if (!this.productToAddToPrescription.quantity) {
              return this.$toastr.error('Digite la cantidad')
            }

            if (this.productToAddToPrescription.quantity < 1 || this.productToAddToPrescription.quantity > 500 ) {
              return this.$toastr.error('La cantidad debe estar en 1 y 500')
            }

            if (!this.productToAddToPrescription.posology) {
              return this.$toastr.error('Diligencie la posología')
            }

            let data = { 
                  product_id: this.productToAddToPrescription.product.id,
                  product_name: this.productToAddToPrescription.product.name,
                  quantity: this.productToAddToPrescription.quantity,
                  posology: this.productToAddToPrescription.posology,
            }

            this.newPrescription.products.push(data)
            this.productToAddToPrescription = {
                  product: {},
                  quantity: '',
                  posology: ''
            }
          },
          savePrescription () {
            this.savingPrescription = true
            
            this.$http.post(`prescriptions/${ this.pet_id }`, {...this.newPrescription} ).then( response => {
              this.savingPrescription = false
                this.productToAddToPrescription = {
                  product: {},
                  quantity: '',
                  posology: '',
                }

                this.newPrescription = {
                  products: [],
                  observations: '',
                }

                this.errors = null
                this.$toastr.success('Prescripción registrada')
                this.$emit('prescriptionSaved')
            }).catch( error => {
                this.savingPrescription = false
                if (error.response.status == 422) {
                  this.errors = error.response.data.errors
                } else {
                  this.$toastr.error('La prescripción no pudo ser registrada')
                }
              })

          }
        }
    }
</script>