<template>
<div class="row">
    <div :class="sizeFromColumnField ? 'col-md-' + sizeFromColumnField : 'col-md-4'">
        <label for="">Identificación propietario</label>
        <div class="input-group mb-3 form-group">
          <input type="text" class="form-control" 
            v-model="ownerSelected.identification" 
            @keyup.enter="getOwner"
            :disabled="disableFields">
          <div class="input-group-append">
            <button class="btn btn-primary" type="button" @click="getOwner" :disabled="disableFields || searchingOwnerByIdentification">
              <span v-if="searchingOwnerByIdentification" class="spinner-border spinner-border-sm"></span>
              <i class="fa fa-search" v-else></i>
            </button>
            <button class="btn btn-info" type="button" @click="showModalForSearchOwner" :disabled="disableFields">
              <i class="fa fa-list-alt"></i>
            </button>
            <button class="btn btn-success" type="button" @click="showModalForCreateOwnerAndPets" :disabled="disableFields">
              <i class="fa fa-plus"></i>
            </button>
            <!--inicio modal buscar propietarios-->
            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Propietarios</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                      <form @submit.prevent="searchingOwnerInModalTable=true;getOwners()" class="row">
                        <div class="form-group col-md-9">
                          <input type="text" class="form-control" v-model="search">
                        </div>
                        <div class="form-group col-md-3">
                          <button :disabled="searchingOwnerInModalTable" class="btn btn-primary" type="submit">
                            <i class="fa fa-search"></i>Buscar
                          </button>
                        </div>
                        <div v-if="searchingOwnerInModalTable" class="form-group col-md-12">
                          <vue-loading type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                        </div>
                      </form>
                    <div class="table-responsive" v-if="!searchingOwnerInModalTable">
                      <table class="table table-hover table-sm">
                        <thead>
                          <th></th>
                          <th>Identificación</th>
                          <th>Nombres</th>
                          <th>Apellidos</th>
                          <th>Mascotas</th>
                        </thead>
                        <tbody>
                          <tr v-for="owner in owners.data" :key="'ownerForSelect' + owner.id">
                            <th nowrap>
                              <button class="btn btn-info btn-sm" @click="selectOwner(owner)">
                                <i class="fa fa-fw fa fa-check"></i>
                              </button>
                            </th>
                            <td nowrap>{{ owner.identification }}</td>
                            <td nowrap>{{ owner.names }}</td>
                            <td nowrap>{{ owner.surnames }}</td>
                            <td nowrap>
                              <button class="btn btn-success btn-sm mr-1" v-for="pet in owner.pets" @click.stop="selectOwnerAndPet(owner, pet)">
                                <i class="fa fa-fw fa fa-paw"></i> {{ pet.name }}
                              </button>
                              <!--{{ owner.pets_count }}-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <pagination class="my-2" align="right" :limit="-1" :data="owners" @pagination-change-page="getOwners">
                      <span slot="prev-nav">&lt; Anterior</span>
                      <span slot="next-nav">Siguiente &gt;</span>
                    </pagination>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
            <!--Fin modal buscar propietarios-->
            <!--inicio modal crear propietarios y mascotas-->
            <div class="modal fade bd-example-modal-lg" id="modalForCreateOwnerAndPets" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Nuevo propietario y mascota</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                      <OwnerCreate :showAsComponent="true" @owner-registered="ownerRegistered"/>
                      <PetCreate 
                        @pet-registered="ownerRegistered"
                        :showAsComponent="true"
                        :updateListOwners="updateListOwnersFromPetCreateComponent"/>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
            <!--Fin modal buscar propietarios y mascotas-->
          </div>
        </div>
    </div>
    <div :class="sizeFromColumnField ? 'col-md-' + sizeFromColumnField : 'col-md-4'">
      <div class="form-group">
        <label for="">Nombres propietario</label>
        <input type="text" class="form-control" :value="ownerSelected.names + ' ' + ownerSelected.surnames" disabled>
      </div>
    </div>
    <div :class="sizeFromColumnField ? 'col-md-' + sizeFromColumnField : 'col-md-4'">
      <div class="form-group">
        <label for="">Mascota</label>
        <select class="form-control" v-model="petSelected" :disabled="disableFields || loadingResults">
          <option value="">Seleccione mascota</option>
          <option :value="petFromOwner.id" v-for="petFromOwner in petsFromOwner" :key="'pet-' + petFromOwner.id">{{ petFromOwner.name }}</option>
        </select>
      </div>
    </div>
</div>
</template>
<script>
    import { VueLoading } from 'vue-loading-template'
import LoginVue from '../../login/Login.vue'
    import OwnerCreate from '../owners/Create.vue'
    import PetCreate from '../pets/Create.vue'
    export default {
        components: {
            VueLoading, OwnerCreate, PetCreate
        },
        created () {
          this.getOwners()
        },
        props: {
          disableFields: {
            type: Boolean,
            default: false
          },
          loadingResults: {
            type: Boolean,
            default: false
          },
          /*identification: '',
          pet_id: '',*/
          clearData: {},
          sizeFromColumnField: ''
        },
        data() {
            return {
                owners: {},
                petSelected: '',
                ownerSelected: {
                  id: '',
                  identification: '',
                  names: '',
                  surnames: '',
                  pets_count: ''
                },
                searchingOwnerByIdentification: false,
                petsFromOwner: [],
                search: '',
                searchingOwnerInModalTable: true,
                updateListOwnersFromPetCreateComponent: false
            }
        },
        methods: {
            getOwner () {
                this.searchingOwnerByIdentification = true
                this.petSelected = ''
                this.petsFromOwner = []
                this.ownerSelected.id = ''
                this.ownerSelected.names = ''
                this.ownerSelected.surnames = ''
                this.ownerSelected.pets_count = ''
                
                if (!this.ownerSelected.identification) {
                  this.$toastr.error('Digite el documento del propietario')
                  return this.searchingOwnerByIdentification = false
                }
                
                this.$emit('searching', true)
                
                this.$http.get(`clinic-histories/get-owner?identification=${ this.ownerSelected.identification }`).then( response => {
                    this.ownerSelected = response.data
                    this.petsFromOwner = response.data.pets
                    
                    this.$emit('owner-selected', true)
                    this.$emit('searching', false)

                    if(!this.ownerSelected.pets_count) {
                        this.$toastr.info('El propietario no tiene mascotas relacionadas')
                    }

                    this.searchingOwnerByIdentification = false

                }).catch(error => {
                    this.searchingOwnerByIdentification = false
                    this.$emit('owner-selected', false)
                    this.$emit('searching', false)
                    if (error.response.status == 404) {
                        this.$toastr.error('No existe propietario con ese número de identificación')
                    }
                })
            },
            showModalForSearchOwner () {
                $('#exampleModal').modal('show')
            },
            showModalForCreateOwnerAndPets () {
                $('#modalForCreateOwnerAndPets').modal('show')
            },
            getOwners (page = 1) {
              
              this.$http.get(`clinic-histories/get-owners?q=${ this.search }&page=${ page }`).then( response => {
                this.owners = response.data
                this.searchingOwnerInModalTable = false
              })
            },
            selectOwner (owner) {
                this.$emit('searching', true)
                this.petSelected = ''
                this.petsFromOwner = []
                $('#exampleModal').modal('hide')
                this.ownerSelected = owner
                this.$emit('owner-selected', true)
                this.getPetsFromOwner()
            },
            selectOwnerAndPet (owner, pet) {
                this.petsFromOwner = []
                this.ownerSelected = owner
                this.getPetsFromOwner()
                this.$emit('searching', true)
                this.petSelected = pet.id
                
                this.$emit('owner-selected', true)
                $('#exampleModal').modal('hide')
                
            },
            getPetsFromOwner () {
                this.$http.get(`clinic-histories/${ this.ownerSelected.id }/get-pet-from-owner`).then( response => {
                    this.$emit('searching', false)
                    this.petsFromOwner = response.data
                if (response.data.length == 0) {
                    this.$toastr.info('El propietario no tiene mascotas relacionadas')
                }
                }).catch( err => {
                    this.$emit('searching', false)
                })
            },
            ownerRegistered () {
              this.getOwners()
              this.updateListOwnersFromPetCreateComponent = !this.updateListOwnersFromPetCreateComponent
            }
        },
        watch: {          
            petSelected(newValue, oldValue) {
                this.$emit('pet-selected', newValue)
            },
            clearData (newValue) {
              if (newValue) {
                this.petSelected = '',
                this.ownerSelected = {
                  id: '',
                  identification: '',
                  names: '',
                  surnames: '',
                  pets_count: ''
                }
                this.petsFromOwner = []
              }
            }
        },
    }
</script>