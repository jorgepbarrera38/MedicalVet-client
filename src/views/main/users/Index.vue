<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-user"></i> Usuarios</h1>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12">
          <div class="tile">
            <div class="tile-title-w-btn">
              <h3 class="tile-title">Listado de usuarios</h3>
              <button :disabled="!hasPermission('users.store')"
                @click="$router.push({ name: 'users.create' })"
                class="btn btn-success btn-sm">
                <i class="fa fa-fw fa-lg fa-plus"></i>Nuevo
              </button>
            </div> 
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <Search @data-search="getUsersFiltered" label="Nombre de usuario"/>
              </div>
            </div>   
            <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <div class="table-responsive" v-else>        
              <table class="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Identificación</th>
                    <th>Nombres</th>
                    <th>Veterinario</th>
                    <th>

                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users.data" :key="user.id">
                    <td nowrap>{{ user.username }}</td>
                    <td nowrap>{{ user.identification }}</td>
                    <td nowrap>{{ user.names + ' ' + user.surnames }}</td>
                    <td nowrap>
                      <span :class="{ badge: true, 'badge-success': user.is_vet, 'badge-danger': !user.is_vet}">
                        <i :class="{ fa: true, 'fa-check': user.is_vet,'fa-times': !user.is_vet }"></i>
                      </span>
                    </td>
                    <td nowrap>
                      <button class="btn btn-info btn-sm" 
                        :disabled="!hasPermission('users.permission')"
                        @click="permissionUser(user.id)">
                        <i class="fa fa-fw fa-lg fa fa-list-alt"></i>
                        Permisos
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button class="btn btn-primary btn-sm" 
                        :disabled="!hasPermission('users.update')"
                        @click="editUser(user.id)">
                        <i class="fa fa-fw fa-lg fa fa-pencil"></i>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button class="btn btn-danger btn-sm" 
                        :disabled="!hasPermission('users.destroy')"
                        @click="deleteUser(user.id)">
                        <i class="fa fa-fw fa-lg fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pagination class="my-2" align="right" :limit="-1" :data="users" @pagination-change-page="getUsers">
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
          this.getUsers()
      },
      data() {
          return {
              users: {},
              search: '',
              loading: true
          }
      },
      methods: {
        getUsersFiltered (payload) {
          this.loading = true
          this.search = payload
          this.getUsers(1)
        },
        getUsers (page = 1) {
          this.$http.get('users?search=' + this.search + '&page=' + page).then( response => {
            this.users = response.data
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        },
        editUser (id) {
          this.$router.push({ name: 'users.edit', params: { id } })
        },
        permissionUser (id) {
          this.$router.push({ name: 'users.permission', params: { id } })
        },
        deleteUser (id) {
          this.$http.delete(`users/${ id }`).then( response => {
              this.getUsers()
              this.$toastr.success('Usuario eliminado')
          }).catch( error => {
              if (error.response.status == 402) {
                this.$toastr.error('El usuario no se puede eliminar por integridad referencial')
              }
          })
        }
      }
    }
</script>

<style lang="scss" scoped>

</style>