<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-users"></i> Propietarios</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="title">Listado de propietarios</h3>
              <button :disabled="!hasPermission('owners.store')"
                @click="$router.push({ name: 'owners.create' })"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
            </div>    
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <Search @data-search="getOwnersFiltered" label="Identificación o nombres del propietario"/>
              </div>
            </div>
            <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <div class="table-responsive" v-else>          
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Identificación</th>
                    <th>Nombres</th>
                    <th>Teléfono 1</th>
                    <th>Teléfono 2</th>
                    <th>Dirección</th>
                    <th>Email</th>
                    <th>Mascotas</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(owner, index) in owners.data" :key="owner.id">
                    <td nowrap>{{ owner.identification }}</td>
                    <td nowrap>{{ owner.names + ' ' + owner.surnames }}</td>
                    <td nowrap>{{ owner.phonenumber }}</td>
                    <td nowrap>{{ owner.phonenumber2 }}</td>
                    <td nowrap>{{ owner.address }}</td>
                    <td nowrap>{{ owner.email }}</td>
                    <td nowrap>
                      <button class="btn btn-info btn-sm" @click="showPetsFromOwner(index)">{{ owner.pets.length }}</button>
                    </td>
                    <td nowrap>
                      <button class="btn btn-primary btn-sm" 
                        :disabled="!hasPermission('owners.update')"
                        @click="editOwner(owner.id)">
                        <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button class="btn btn-danger btn-sm" 
                        :disabled="!hasPermission('owners.destroy')"
                        @click="deleteOwner(owner.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="owners" @pagination-change-page="getOwners">
              <span slot="prev-nav">&lt; Anterior</span>
              <span slot="next-nav">Siguiente &gt;</span>
            </pagination>
          </div>
        </div>
        <!--inicio modal mascotas del propietarios-->
            <div class="modal fade bd-example-modal-lg" id="petsModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Mascotas</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                      <div class="table-responsive">
                        <table class="table table-hover table-sm">
                          <thead>
                            <th>Foto</th>
                            <th>Nombre</th>
                            <th>Especie</th>
                            <th>Raza</th>
                            <th>Fecha de nac.</th>
                            <th></th>
                          </thead>
                          <tbody>
                            <tr v-for="(pet, index) in this.owners.data[this.indexOwnerToShowPets] ? this.owners.data[this.indexOwnerToShowPets].pets : []" 
                              :key="`pets-from-owner-${index}`">
                              <td nowrap>
                                <img style="border-radius:10%"
                                    width="50" :src="pet.photo ? $hostFiles + pet.photo : avatarPet" alt="">
                              </td>
                              <td>{{ pet.name }}</td>
                              <td>{{ pet.species.name }}</td>
                              <td>{{ pet.race.name }}</td>
                              <td>{{ formatDate(pet.date_born) }}</td>
                              <td>
                                <button class="btn btn-primary btn-sm" @click="editPet(pet)" :disabled="showComponentToEditPet || !hasPermission('pets.update')">
                                  <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <PetsEdit :idFromPet="idFromPetToEdit" v-if="showComponentToEditPet" @petUpdated="petUpdatedSinceComponent" />
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
            <!--Fin modal mascotas del propietarios-->
      </div>
    </div>
</template>

<script>
    import hasPermission from '../_utilities/hasPermission'
    import { VueLoading } from 'vue-loading-template'
    import Search from '../_components/Search'
    import moment from 'moment'
    import PetsEdit from '../pets/Edit'
    export default {
      mixins: [hasPermission],
      components: {
        VueLoading, Search, PetsEdit
      },
      created () {
          this.getOwners()
      },
      data() {
          return {
              owners: {
                data: []
              },
              indexOwnerToShowPets: [],
              loading: true,
              showComponentToEditPet: false,
              idFromPetToEdit: '',
              search: '',
              avatarPet: require('../../../assets/avatar_pet.jpg')
          }
      },
      methods: {
        getOwnersFiltered (payload) {
          this.loading = true
          this.search = payload
          this.getOwners(1)
        },
        getOwners (page = 1) {
          this.$http.get('owners?search=' + this.search + '&page=' + page).then( response => {
            this.owners = response.data
            this.loading = false
          }).catch( () => {
            this.loading = false
          })
        },
        editOwner (id) {
          this.$router.push({ name: 'owners.edit', params: { id } })
        },
        deleteOwner (id) {
          this.$http.delete(`owners/${ id }`).then( response => {
            this.getOwners()
              this.$toastr.success('Propietario eliminado')
          }).catch( errors => {
            if (errors.response.status == 422) {
              this.$toastr.error('El propietario no se puede eliminar ya que tiene mascotas relacionadas')
            }
          })
        },
        showPetsFromOwner (indexOwnerToShowPets) {
          this.indexOwnerToShowPets = indexOwnerToShowPets
          this.showComponentToEditPet = false
          this.idFromPetToEdit = ''
          $('#petsModal').modal('show')
        },
        editPet (pet) {
          this.idFromPetToEdit = pet.id
          this.showComponentToEditPet = true 
        },
        petUpdatedSinceComponent (ownerIdUpdated) {
          this.getPetsFromOwners(null)
          this.getPetsFromOwners(ownerIdUpdated)
          this.showComponentToEditPet = false 
          this.idFromPetToEdit = ''
        },
        getPetsFromOwners (ownerIdUpdated) {
          this.$http.get(`owners/${ ownerIdUpdated ? ownerIdUpdated : this.owners.data[this.indexOwnerToShowPets].id }/get-pets-from-owner`).then( response => {
            if (ownerIdUpdated) {
              let ownerUpdated = this.owners.data.find(owner => owner.id == ownerIdUpdated)
              if (ownerUpdated) {
                ownerUpdated.pets = response.data
              }
            } else {
              this.owners.data[this.indexOwnerToShowPets].pets = response.data
            }
          })
        },
        formatDate (date) {
            return moment(date).format('LL')
        },
      },
    }
</script>

<style lang="scss" scoped>

</style>