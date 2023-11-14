<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-building"></i> Empresa</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="tile">
                    <div class="tile-title-w-btn">
                        <h3 class="tile-title">Datos de la empresa</h3>
                        <div @click="saveOrUpdateCompany">
                            <button type="submit" class="btn btn-primary btn-sm" :disabled="loading">
                                <i  class="fa fa-fw fa-lg fa fa-save"></i>Guardar
                                <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                            </button>
                        </div>
                    </div>
                    <div class="alert alert-danger" v-if="errors">
                        <li v-for="(error, index) in errors" :key="index">
                            {{ error[0] }}
                        </li>
                    </div>
                    <form @submit.prevent="saveOrUpdateCompany">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="">Nombre (*)</label>
                                    <input type="text" class="form-control" v-model="company.name" maxlength="100">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="">Nit (*)</label>
                                    <input type="text" class="form-control" v-model="company.nit" maxlength="20">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="">Dirección (*)</label>
                                    <input type="text" class="form-control" v-model="company.address" maxlength="50">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="">Logo <span class="badge badge-warning" v-if="this.$limitedVersion">No disponible en la versión limitada</span></label>
                                    <input type="file" class="form-control" @change="setLogo">
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="form-group">
                                    <label for="">Eslogan (*)</label>
                                    <input type="text" class="form-control" v-model="company.slogan" maxlength="150">
                                </div>
                            </div>
                        </div>
                        <div class="row" v-if="company.logo">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <img :src="$APP_URL + company.logo" width="180">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="col-md-12">
                <div class="tile">
                    <div class="tile-title-w-btn">
                        <h3 class="tile-title">Mensajería</h3>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <div class="form-group">
                                    <label for="">Email</label>
                                    <input type="email" class="form-control" v-model="company.email" maxlength="90">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <div class="form-group">
                                    <label for="">Email contraseña</label>
                                    <input type="password" class="form-control" v-model="company.email_password" maxlength="50">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <div class="form-group">
                                    <label for="">Email host</label>
                                    <input type="email" class="form-control" v-model="company.email_host" maxlength="50">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <div class="form-group">
                                    <label for="">Email puerto</label>
                                    <input type="email" class="form-control" v-model="company.email_port" maxlength="50">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <div class="form-group">
                                    <label for="">Email encriptación</label>
                                    <input type="email" class="form-control" v-model="company.email_encryption" maxlength="50">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <div class="tile">
                    <div class="tile-title-w-btn">
                        <h3 class="tile-title">Copia de seguridad</h3>
                    </div>
                    <button type="submit" class="btn btn-primary" @click="downloadBackupFiles" :disabled="downloadingBackupFiles">
                        <i class="fa fa-fw fa-lg fa fa-download"></i>Copia de seguridad de archivos
                        <span v-if="downloadingBackupFiles" class="spinner-border spinner-border-sm"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import hasPermission from '../_utilities/hasPermission'
    import { VueLoading } from 'vue-loading-template'
    import Search from '../_components/Search'
    import download from 'downloadjs'
    export default {
      mixins: [hasPermission],
      components: {
        VueLoading, Search
      },
      created () {
          this.getCompany()
      },
      data() {
          return {
              company: {
                name: '',
                nit: '',
                slogan: '',
                logo: '',
                logoNew: '',
                address: '',

                email: '',
                email_host: '',
                email_port: '',
                email_password: '',
                email_encryption: ''
              },
              errors: null,
              loading: true,
              downloadingBackupFiles: false,
          }
      },
      methods: {
        getCompany () {
          this.$http.get('company').then( response => {
              if (response.data) {
                  this.company = response.data
              }
              this.loading = false
          }).catch(() => {
              this.loading = false
          })
        },
        saveOrUpdateCompany () {
            this.loading = true

            let data = new FormData
            data.append('_method', 'put')
            data.append('name', this.company.name)
            data.append('slogan', this.company.slogan)
            data.append('address', this.company.address)
            data.append('nit', this.company.nit)
            data.append('email', this.company.email ? this.company.email : '')
            data.append('email_host', this.company.email_host ? this.company.email_host : '')
            data.append('email_port', this.company.email_port ? this.company.email_port : '')
            data.append('email_password', this.company.email_password ? this.company.email_password : '')
            data.append('email_encryption', this.company.email_encryption ? this.company.email_encryption : '')

            if (this.company.logoNew && !this.$limitedVersion) {
                data.append('logo', this.company.logoNew)
            }

            this.$http.post('company', data).then( response => {
                this.loading = false
                this.errors = null
                this.$toastr.success('Datos actualizados exitosamente')
                this.getCompany()
            }).catch(error => {
                this.loading = false
                if (error.response.status == 422) {
                    this.errors = error.response.data.errors
                }
            })
        },
        setLogo (e) {
            this.company.logoNew = e.target.files[0]
        },
        downloadBackupFiles () {
            if (this.$limitedVersion) {
              return this.$toastr.error('Esta funcionalidad no está disponible en la versión limitada')
            }

            this.downloadingBackupFiles = true
            this.$http.get('company/download-backup-files', { responseType: 'blob' }).then( response => {
                download(response.data, 'backup-files.zip')
                this.$toastr.success('Copia generada con éxito')
                this.downloadingBackupFiles = false
            }).catch(error => {
                this.downloadingBackupFiles = false
                this.loading = false
                if (error.response.status == 422) {
                    this.$toastr.error('No hay datos para descargar')
                }
            })
        },
      }
    }
</script>