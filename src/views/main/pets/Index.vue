<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-paw"></i> Mascotas</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="tile-title">Listado de mascotas</h3>
              <button :disabled="!hasPermission('pets.store')"
                @click="$router.push({ name: 'pets.create' })"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
            </div>

            <div class="row">
              <div class="col-md-12">

                <form class="form-inline" @submit.prevent="loading = true; getPets()">
                  <!--<label class="sr-only" for="inlineFormInputName2">Name</label>-->
                  <input type="text" class="form-control mb-3 mr-sm-2" style="min-width: 280px;" id="inlineFormInputName2" placeholder="Identificación o nombres propietario" v-model="search.ownerIdOrName">
                  
                  <!--<label class="sr-only" for="inlineFormInputGroupUsername2">Username</label>-->
                  <input type="text" class="form-control mb-3 mr-sm-2" style="min-width: 220px;"  id="inlineFormInputName2" placeholder="Nombre de la mascota" v-model="search.petName">

                  <button type="submit" class="btn btn-primary mb-3">
                    <i class="fa fa-search"></i>
                  </button>
                </form>
                
              </div>
            </div>

            <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <div class="table-responsive" v-if="!loading">
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Nombre</th>
                    <th>Propietario</th>
                    <th>Fecha nacimiento</th>
                    <th>Edad</th>
                    <th>Especie</th>
                    <th>Raza</th>
                    <th nowrap>Folios HC</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="pet in pets.data" :key="pet.id">
                    <td nowrap>
                      <img style="border-radius:10%"
                          width="50" :src="pet.photo ? $APP_URL + pet.photo : avatarPet" alt="">
                          
                    </td>
                    <td nowrap>{{ pet.name }}</td>
                    <td>{{ pet.owner.identification + ' - ' + pet.owner.names + ' ' + pet.owner.surnames }}</td>
                    <td nowrap>{{ pet.date_born }}</td>
                    <td nowrap>{{ getAge(pet.date_born) }}</td>
                    <td nowrap>{{ pet.species.name }}</td>
                    <td nowrap>{{ pet.race.name }}</td>
                    <td nowrap>
                      <span>{{ pet.clinic_histories_count }}</span>
                      <!--<a href="" v-if="pet.clinic_histories_count"
                        @click.prevent="$router.push({ name: 'reports.clinicHistory', 
                                                      query: { 
                                                              identification: pet.owner.identification, 
                                                              pet: pet.id } })">
                        {{ pet.clinic_histories_count }}
                      </a>
                      <span v-else>{{ pet.clinic_histories_count }}</span>-->
                    </td>
                    <td nowrap>
                      <button class="btn btn-info btn-sm" 
                        @click="showPet(pet)">
                        <i class="fa fa-fw fa-lg fa fa-eye"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button class="btn btn-primary btn-sm" 
                        :disabled="!hasPermission('pets.update')"
                        @click="editPet(pet.id)">
                        <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button class="btn btn-danger btn-sm" 
                        :disabled="!hasPermission('pets.destroy')"
                        @click="deletePet(pet.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="pets" @pagination-change-page="getPets">
              <span slot="prev-nav">&lt; Anterior</span>
              <span slot="next-nav">Siguiente &gt;</span>
            </pagination>
            <!--inicio modal buscar propietarios-->
            <div class="modal fade" id="petModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">{{ petSelected.name }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                      <center>
                        <img style="border-radius:10%" class="mb-3"
                          width="150" :src="petSelected.photo ? $APP_URL + petSelected.photo : avatarPet" alt="">
                      </center>
                      <table class="table table-hover table-sm">
                        <tr>
                          <th>Propietario:</th>
                          <td colspan="3">{{ petSelected.owner.identification + ' - ' + petSelected.owner.names + ' ' + petSelected.owner.surnames }}</td>
                        </tr>
                        <tr>
                          <th>Especie:</th>
                          <td>{{ petSelected.species.name }}</td>
                          <th>Raza:</th>
                          <td>{{ petSelected.race.name }}</td>
                        </tr>
                        <tr>
                          <th>Fecha nac:</th>
                          <td>{{ petSelected.date_born }}</td>
                          <th>Sexo:</th>
                          <td>{{ petSelected.sex }}</td>
                        </tr>
                        <tr>
                          <th>Color:</th>
                          <td>{{ petSelected.color }}</td>
                          <th>Tamaño:</th>
                          <td>{{ petSelected.size }}</td>
                        </tr>
                        <tr>
                          <th>Observaciónes: </th>
                          <td colspan="3" class="text-justify">{{ petSelected.observations }}</td>
                        </tr>
                      </table>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
            <!--Fin modal buscar mascotas-->
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import hasPermission from '../_utilities/hasPermission'
    import { VueLoading } from 'vue-loading-template'
    import Search from '../_components/Search'
    import moment from 'moment'
    moment.locale('es')    
    export default {
      mixins: [ hasPermission ],
      components: {
        VueLoading, Search
      },
      created () {
          this.getPets()
      },
      data() {
          return {
              pets: {},
              loading: true,
              petSelected: {
                name: '',
                species: {},
                race: {},
                owner: {},
                date_born: '',
                sex: '',
                color: '',
                size: '',
                observations: ''
              },
              search: {
                petName: '',
                ownerIdOrName: '',
              },
              avatarPet: 'img/avatar_pet.jpg'
          }
      },
      methods: {
        /*getPetsFiltered (payload) {
          this.loading = true
          this.search = payload
          this.getPets(1)
        },*/
        getPets (page = 1) {
          this.$http.get('pets?ownerIdOrName=' + this.search.ownerIdOrName + ' &petName=' + this.search.petName + ' &page=' + page).then( response => {
            this.pets = response.data
            this.loading = false
          }).catch( () => {
            this.loading = false
          })
        },
        editPet (id) {
          this.$router.push({ name: 'pets.edit', params: { id } })
        },
        deletePet (id) {
          this.$http.delete(`pets/${ id }`).then( response => {
              this.getPets()
              this.$toastr.success('Mascota eliminada')
          }).catch( errors => {
            if (errors.response.status == 422) {
              this.$toastr.error(errors.response.data.message)
            }
          })
        },
        showPet (pet) {
          this.$router.push({ name: 'pets.show', params: { id: pet.id } })
          /*this.petSelected = pet
          $('#petModal').modal('show')*/
        },
        getAge (dateBorn) {
          let message = moment(dateBorn).fromNow();
          return message.replace('hace ', '')
        },
      },
    }
</script>

<style lang="scss" scoped>

</style>