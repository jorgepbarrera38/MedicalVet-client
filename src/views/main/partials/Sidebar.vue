<template>
    <aside class="app-sidebar">
      <div class="app-sidebar__user"><img class="app-sidebar__user-avatar" src="../../../assets/avatar.svg" 
            width="60px" height="60px" alt="User Image">
        <div>
          <p class="app-sidebar__user-name">{{ namesUser }}</p>
          <p class="app-sidebar__user-designation"></p>
        </div>
      </div>
      <ul class="app-menu">
        <li>
            <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'dashboard.index' })" :class="{ 'app-menu__item': true, active: $route.name == 'dashboard.index' }">
                <i class="app-menu__icon fa fa-dashboard"></i> <span class="app-menu__label">Dashboard</span>
            </a>
        </li>
        <li class="treeview" id="petsconfig">
            <a class="app-menu__item" href="#" data-toggle="treeview" @click.prevent="explodeOrImplode('petsconfig')">
                <i class="app-menu__icon fa fa-paw"></i>
                <span class="app-menu__label">Mascotas</span>
                <i class="treeview-indicator fa fa-angle-right"></i>
            </a>
            <ul class="treeview-menu">
                <li v-if="hasPermission('pets.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'pets.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Mascotas
                    </a>
                </li>
                <li v-if="hasPermission('owners.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'owners.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Propietarios
                    </a>
                </li>
                <li v-if="hasPermission('species.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'species.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Especies
                    </a>
                </li>
                <li v-if="hasPermission('races.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'races.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Razas
                    </a>
                </li>
                <li v-if="hasPermission('states.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'states.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Departamentos
                    </a>
                </li>
                <li v-if="hasPermission('cities.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'cities.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Ciudades
                    </a>
                </li>
            </ul>
        </li>

        <li class="treeview" id="appointment">
            <a class="app-menu__item" href="#" data-toggle="treeview" @click.prevent="explodeOrImplode('appointment')">
                <i class="app-menu__icon fa fa-stethoscope"></i>
                <span class="app-menu__label">Citas</span>
                <i class="treeview-indicator fa fa-angle-right"></i>
            </a>
            <ul class="treeview-menu">
                <li v-if="hasPermission('appointments.store')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'appointments.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Asignación de citas
                    </a>
                </li>
                <li v-if="hasPermission('appointments.board')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'appointments.board' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Tablero de citas
                    </a>
                </li>
                <li v-if="hasPermission('consultingrooms.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'consultingrooms.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Consultorios
                    </a>
                </li>
                <li v-if="hasPermission('activities.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'activities.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Actividades
                    </a>
                </li>
                <li v-if="hasPermission('reason-cancellations.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'reasonCancellations.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Motivos de cancelación
                    </a>
                </li>
                <li v-if="hasPermission('appointments.report-appointments')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'appointments.reports.appointments' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Reporte de citas
                    </a>
                </li>
            </ul>
        </li>

        <li class="treeview" id="clinichistory">
            <a class="app-menu__item" href="#" data-toggle="treeview" @click.prevent="explodeOrImplode('clinichistory')">
                <i class="app-menu__icon fa fa-file-text"></i>
                <span class="app-menu__label">Historias clínicas</span>
                <i class="treeview-indicator fa fa-angle-right"></i>
            </a>
            <ul class="treeview-menu">
                <li v-if="hasPermission('clinic-histories.store')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'clinic_histories.create' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Historia clínica
                    </a>
                </li>
                <li v-if="hasPermission('clinic-histories.show')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'reports.clinicHistory' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Consulta de historia clínica
                    </a>
                </li>
                <li v-if="hasPermission('clinic-histories.show-prescriptions')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'reports.prescription' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Recetas veterinarias
                    </a>
                </li>
                <li v-if="hasPermission('clinic-histories.show-vaccine')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'clinic_histories.vaccine' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Vacunación y desparasitación
                    </a>
                </li>
                <li v-if="hasPermission('clinic-histories.show-product-and-services-applied')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'reports.reportsProductAndServiceApplied' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Prod. y servicios aplicados
                    </a>
                </li>
                <li v-if="hasPermission('clinic-histories.show-product-and-services-applied')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'informed_consent.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Consentimiento informado
                    </a>
                </li>
            </ul>
        </li>


        <li class="treeview" id="generalconfig">
            <a class="app-menu__item" href="#" data-toggle="treeview" @click.prevent="explodeOrImplode('generalconfig')">
                <i class="app-menu__icon fa fa-folder"></i>
                <span class="app-menu__label">General</span>
                <i class="treeview-indicator fa fa-angle-right"></i>
            </a>
            <ul class="treeview-menu">
                <li v-if="hasPermission('consultation-purposes.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'consultation_purposes.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Finalidades de consulta
                    </a>
                </li>
                <li v-if="hasPermission('diagnoses.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'diagnoses.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Diagnósticos
                    </a>
                </li>
                <li v-if="hasPermission('products.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'products.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Productos
                    </a>
                </li>
                <li v-if="hasPermission('services.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'services.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Servicios
                    </a>
                </li>
                <li v-if="hasPermission('unities.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'unities.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Unidades
                    </a>
                </li>
                <li v-if="hasPermission('attachment-types.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'attachment_types.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Tipos de archivos adjuntos
                    </a>
                </li>
                <li v-if="hasPermission('informed-consent-templates.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'informed_consent_template.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Plantillas de consentimiento informado
                    </a>
                </li>
            </ul>
        </li>

        <!--<li class="treeview" id="generalconfig">
            <a class="app-menu__item" href="#" data-toggle="treeview" @click.prevent="explodeOrImplode('generalconfig')">
                <i class="app-menu__icon fa fa-folder"></i>
                <span class="app-menu__label">Inventarios</span>
                <i class="treeview-indicator fa fa-angle-right"></i>
            </a>
            <ul class="treeview-menu">
                <li v-if="hasPermission('consultation-purposes.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'consultation_purposes.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Finalidades de consulta
                    </a>
                </li>
                <li v-if="hasPermission('diagnoses.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'diagnoses.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Diagnósticos
                    </a>
                </li>
                <li v-if="hasPermission('products.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'products.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Productos
                    </a>
                </li>
                <li v-if="hasPermission('services.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'services.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Servicios
                    </a>
                </li>
                <li v-if="hasPermission('unities.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'unities.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Unidades
                    </a>
                </li>
                <li v-if="hasPermission('attachment-types.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'attachment_types.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Tipos de archivos adjuntos
                    </a>
                </li>
                <li v-if="hasPermission('informed-consent-templates.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'informed_consent_template.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Plantillas de consentimiento informado
                    </a>
                </li>
            </ul>
        </li>-->

        <li class="treeview" id="reports">
            <a class="app-menu__item" href="#" data-toggle="treeview" @click.prevent="explodeOrImplode('reports')">
                <i class="app-menu__icon fa fa-list-ul"></i>
                <span class="app-menu__label">Reportes</span>
                <i class="treeview-indicator fa fa-angle-right"></i>
            </a>
            <ul class="treeview-menu">
                <li v-if="hasPermission('reports.consultations')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'reports.consultations' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Informe de atenciónes
                    </a>
                </li>
                <li v-if="hasPermission('reports.services-provided')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'reports.services_provided' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Informe de servicios prestados
                    </a>
                </li>
            </ul>
        </li>

        <li class="treeview" id="billing">
            <a class="app-menu__item" href="#" data-toggle="treeview" @click.prevent="explodeOrImplode('billing')">
                <i class="app-menu__icon fa fa-list-alt"></i>
                <span class="app-menu__label">Facturación</span>
                <i class="treeview-indicator fa fa-angle-right"></i>
            </a>
            <ul class="treeview-menu">
                <!-- v-if="hasPermission('reports.consultations')"-->
                <li>
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'billing.pending_billing' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Pendiente por facturar
                    </a>
                </li>
                <li>
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'billing.bill_consultation' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Consulta de facturas
                    </a>
                </li>
            </ul>
        </li>

        <li class="treeview" id="system">
            <a class="app-menu__item" href="#" data-toggle="treeview" @click.prevent="explodeOrImplode('system')">
                <i class="app-menu__icon fa fa-cogs"></i>
                <span class="app-menu__label">Sistema</span>
                <i class="treeview-indicator fa fa-angle-right"></i>
            </a>
            <ul class="treeview-menu">
                <li v-if="hasPermission('users.index')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'users.index' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Usuarios
                    </a>
                </li>
                <li v-if="hasPermission('company.update')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'company' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Empresa
                    </a>
                </li>
                <li v-if="hasPermission('parameters.update')">
                    <a href="" @click.prevent="hideNavBarMovil();$router.push({ name: 'parameters' })" class="treeview-item">
                        <i class="icon fa fa-circle-o"></i> Parámetros
                    </a>
                </li>
            </ul>
        </li>
            <li>
                <a href="" @click.prevent="showAbout" class="app-menu__item">
                    <i class="app-menu__icon fa fa-info"></i> <span class="app-menu__label">Acerca de</span>
                </a>
            </li>
        </ul>
    </aside>
</template>

<script>
    import hasPermission from '../_utilities/hasPermission'
    export default {
        mixins: [hasPermission],
        created () {
            if (localStorage.getItem('names_user')) {
                this.namesUser = localStorage.getItem('names_user')
            } else {
                this.namesUser = 'Usuario'
            }
        },
        data() {
            return {
                namesUser: ''
            }
        },
        methods: {
            explodeOrImplode (element) {
                if (document.getElementById(element).classList.contains('is-expanded')) {
                    document.getElementById(element).classList.remove('is-expanded')
                } else {
                    document.getElementById(element).classList.add('is-expanded')
                }
            },
            hideNavBarMovil () {
                let body = document.getElementsByTagName('body')[0]

                if (body.classList.contains('sidenav-toggled')) {
                    document.getElementsByTagName('body')[0].classList.remove('sidenav-toggled')
                }
            },
            showAbout () {
                $('#aboutModal').modal('show')
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>