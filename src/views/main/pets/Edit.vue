<template>
    <div>
        <div class="app-title" v-if="!idFromPet">
            <div>
              <h1><i class="fa fa-paw"></i> Mascotas</h1>
            </div>
        </div>
        <vue-loading v-if="idFromPet && dataPetIsLoading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
        <div class="row" v-if="idFromPet ? !dataPetIsLoading : true ">
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Editar mascota</h3>
            <div class="alert alert-danger" v-if="errors">
              <li v-for="(error, index) in errors" :key="index">
                {{ error[0] }}
              </li>
            </div>
            <form @submit.prevent="savePet()">
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Propietario (*)</label>
                    <select v-model="pet.owner_id" class="form-control">
                      <option value="">Seleccione propietario</option>
                      <option :value="owner.id" v-for="owner in owners" :key="'owner' + owner.id">
                        {{ owner.identification + ' - ' + owner.names + ' ' + owner.surnames}}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Nombre (*)</label>
                    <input type="text" class="form-control" v-model="pet.name" maxlength="40">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Fecha de nacimiento (*)</label>
                    <input type="date" class="form-control" v-model="pet.date_born">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Sexo (*)</label>
                    <select v-model="pet.sex" class="form-control">
                      <option value="">Seleccione sexo</option>
                      <option value="MACHO">Macho</option>
                      <option value="HEMBRA">Hembra</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Especie (*)</label>
                    <select v-model="pet.species_id" class="form-control">
                      <option value="">Seleccione especie</option>
                      <option :value="infospecies.id" v-for="infospecies in species" :key="'species' + infospecies.id">
                        {{ infospecies.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Raza (*)</label>
                    <select v-model="pet.race_id" class="form-control">
                      <option value="">Seleccione raza</option>
                      <option :value="race.id" v-for="race in races" :key="'race' + race.id">
                        {{ race.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Color (*)</label>
                    <input type="text" class="form-control" v-model="pet.color" maxlength="100">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="">Tamaño (*)</label>
                    <select v-model="pet.size" class="form-control">
                      <option value="">Seleccione tamaño</option>
                      <option value="PEQUEÑO">Pequeño</option>
                      <option value="MEDIANO">Mediano</option>
                      <option value="GRANDE">Grande</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="">Observaciónes</label>
                    <textarea rows="3" class="form-control" v-model="pet.observations" maxlength="200"></textarea>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="">Foto <span class="badge badge-warning" v-if="this.$limitedVersion">No disponible en la versión limitada</span></label>
                    <croppa 
                      placeholder="Seleccione imagen" 
                      :placeholder-font-size="16" 
                      :prevent-white-space="true"
                      v-model="photo">
                    </croppa>
                  </div>
                </div>
              </div>
              <vue-loading v-if="saving" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
              <div v-else>
                <button type="submit" class="btn btn-primary">
                  <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar
                </button>
                &nbsp;&nbsp;&nbsp;
                <a href="" class="btn btn-danger" @click.prevent="idFromPet ? $emit('petUpdated') : $router.push({ name: 'pets.index' })">
                  <i class="fa fa-fw fa-lg fa fa-times-circle"></i>Cancelar
                </a>
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
        props: ['idFromPet'],
        created () {
          this.getPet()
          this.getDataToCreatePet()
        },
        data() {
            return {
                pet: {
                  name: '',
                  species_id: '',
                  race_id: '',
                  owner_id: '',
                  date_born: '',
                  sex: '',
                  color: '',
                  size: '',
                  observations: '',
                  photo: ''
                },
                photo: {},
                owners: [],
                species: [],
                races: [],
                errors: null,
                saving: false,
                dataPetIsLoading: true,
            }
        },
        methods: {
          getPet () {
            this.$http.get(`pets/${ this.$route.params.id ? this.$route.params.id : this.idFromPet }`).then( response => {
              this.pet = response.data
              this.dataPetIsLoading = false
            })
          },
          savePet () {
            if (this.idFromPet && this.$limitedVersion) {
              return this.$toastr.error('Esta funcionalidad no está disponible en la versión limitada')
            }
            this.saving = true
            this.photo.generateBlob((blob) => {

              let data = new FormData
              data.append('name', this.pet.name)
              data.append('species_id', this.pet.species_id)
              data.append('race_id', this.pet.race_id)
              data.append('owner_id', this.pet.owner_id)
              data.append('date_born', this.pet.date_born)
              data.append('sex', this.pet.sex)
              data.append('color', this.pet.color)
              data.append('size', this.pet.size)
              data.append('observations', this.pet.observations ? this.pet.observations : '')
              data.append('_method', 'PUT')

              if (blob && !this.$limitedVersion) {
                data.append('photo', blob)
              }

              this.$http.post(`pets/${ this.$route.params.id ? this.$route.params.id : this.idFromPet }`, data).then( response => {
                this.$toastr.success('Mascota actualizada')
                if (this.idFromPet) {
                  return this.$emit('petUpdated', this.pet.owner_id)
                }
                this.$router.push({ name: 'pets.index' })
              }).catch( error => {
                this.saving = false
                if (error.response.status == 422) {
                  this.errors = error.response.data.errors
                }
              })
            })

          },
          getDataToCreatePet () {
            this.$http.get('pets/get-data-to-create-pet').then( response => {
              this.owners = response.data.owners
              this.species = response.data.species
              this.races = response.data.races
            })
          }
        },
    }
</script>

<style lang="scss" scoped>

</style>