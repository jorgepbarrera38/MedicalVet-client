import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/Login.vue'
import Main from '../views/main/Main.vue'
import Dashboard from '../views/main/dashboard/Index.vue'
import OwnersIndex from '../views/main/owners/Index.vue'
import OwnersCreate from '../views/main/owners/Create.vue'
import OwnersEdit from '../views/main/owners/Edit.vue'
import SpeciesIndex from '../views/main/species/Index.vue'
import SpeciesCreate from '../views/main/species/Create.vue'
import SpeciesEdit from '../views/main/species/Edit.vue'
import RacesIndex from '../views/main/races/Index.vue'
import RacesCreate from '../views/main/races/Create.vue'
import RacesEdit from '../views/main/races/Edit.vue'
import AppointmentsIndex from '../views/main/appointments/Index.vue'
import AppointmentsBoard from '../views/main/appointments/Board.vue'
import AppointmentsReportsAppointments from '../views/main/appointments/reports/Appointment.vue'
import ActivitiesIndex from '../views/main/activities/Index.vue'
import ActivitiesCreate from '../views/main/activities/Create.vue'
import ActivitiesEdit from '../views/main/activities/Edit.vue'
import ReasonCancellationsIndex from '../views/main/reason_cancellations/Index.vue'
import ReasonCancellationsCreate from '../views/main/reason_cancellations/Create.vue'
import ReasonCancellationsEdit from '../views/main/reason_cancellations/Edit.vue'
import ConsultingroomsIndex from '../views/main/consultingrooms/Index.vue'
import ConsultingroomsCreate from '../views/main/consultingrooms/Create.vue'
import ConsultingroomsEdit from '../views/main/consultingrooms/Edit.vue'
import UnitiesIndex from '../views/main/unities/Index.vue'
import UnitiesCreate from '../views/main/unities/Create.vue'
import UnitiesEdit from '../views/main/unities/Edit.vue'
import PetsIndex from '../views/main/pets/Index.vue'
import PetsShow from '../views/main/pets/Show.vue'
import PetsCreate from '../views/main/pets/Create.vue'
import PetsEdit from '../views/main/pets/Edit.vue'
import DiagnosesIndex from '../views/main/diagnoses/Index.vue'
import DiagnosesCreate from '../views/main/diagnoses/Create.vue'
import DiagnosesEdit from '../views/main/diagnoses/Edit.vue'
import ProductsIndex from '../views/main/products/Index.vue'
import ProductsCreate from '../views/main/products/Create.vue'
import ProductsEdit from '../views/main/products/Edit.vue'
import ServicesIndex from '../views/main/services/Index.vue'
import ServicesCreate from '../views/main/services/Create.vue'
import ServicesEdit from '../views/main/services/Edit.vue'

import StatesIndex from '../views/main/states/Index.vue'
import StatesCreate from '../views/main/states/Create.vue'
import StatesEdit from '../views/main/states/Edit.vue'

import CitiesIndex from '../views/main/cities/Index.vue'
import CitiesCreate from '../views/main/cities/Create.vue'
import CitiesEdit from '../views/main/cities/Edit.vue'

import Consultation_purposesIndex from '../views/main/consultation_purposes/Index.vue'
import Consultation_purposesCreate from '../views/main/consultation_purposes/Create.vue'
import Consultation_purposesEdit from '../views/main/consultation_purposes/Edit.vue'
import ClinicHistoriesCreate from '../views/main/clinic_histories/Create.vue'
import reportsPrescription from '../views/main/reports/Prescription.vue'
import reportsVaccine from '../views/main/clinic_histories/vaccines/Vaccine.vue'
import reportsClinicHistory from '../views/main/reports/ClinicHistory.vue'
import reportsProductAndServiceApplied from '../views/main/reports/ProductAndServiceApplied.vue'
import UsersIndex from '../views/main/users/Index.vue'
import UsersCreate from '../views/main/users/Create.vue'
import UsersEdit from '../views/main/users/Edit.vue'
import UsersPermission from '../views/main/users/Permission.vue'
import Company from '../views/main/company/Index.vue'
import Parameters from '../views/main/parameters/Index.vue'

import AttachmentTypesIndex from '../views/main/attachment_types/Index.vue'
import AttachmentTypesCreate from '../views/main/attachment_types/Create.vue'
import AttachmentTypesEdit from '../views/main/attachment_types/Edit.vue'

import reportsConsultation from '../views/main/reports/Consultation.vue'
import reportsServiceProvided from '../views/main/reports/ServiceProvided.vue'

import informedConsentTemplateIndex from '../views/main/informed_consent_templates/Index.vue'
import informedConsentTemplateCustomize from '../views/main/informed_consent_templates/Customize.vue'

import InformedConsentsIndex from '../views/main/informed_consents/Index.vue'
import InformedConsentsCreate from '../views/main/informed_consents/Create.vue'
import BillingPendingBilling from '../views/main/billing/PendingBilling.vue'
import BillingBillConsultation from '../views/main/billing/BillConsultation.vue'
import BillingBillReport from '../views/main/billing/BillReport.vue'
import BillingBillingAuthorization from '../views/main/billing/BillingAuthorization.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/iniciar-sesion',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    component: Main,
    children: [
      {
        path: '/',
        name: 'dashboard.index',
        component: Dashboard
      },
      {
        path: '/propietarios',
        name: 'owners.index',
        component: OwnersIndex
      },
      {
        path: '/propietarios/crear',
        name: 'owners.create',
        component: OwnersCreate
      },
      {
        path: '/propietarios/:id/editar',
        name: 'owners.edit',
        component: OwnersEdit
      },
      {
        path: '/especies',
        name: 'species.index',
        component: SpeciesIndex
      },
      {
        path: '/especies/crear',
        name: 'species.create',
        component: SpeciesCreate
      },
      {
        path: '/especies/:id/editar',
        name: 'species.edit',
        component: SpeciesEdit
      },
      {
        path: '/razas',
        name: 'races.index',
        component: RacesIndex
      },
      {
        path: '/razas/crear',
        name: 'races.create',
        component: RacesCreate
      },
      {
        path: '/razas/:id/editar',
        name: 'races.edit',
        component: RacesEdit
      },
      {
        path: '/departamentos',
        name: 'states.index',
        component: StatesIndex
      },
      {
        path: '/departamentos/crear',
        name: 'states.create',
        component: StatesCreate
      },
      {
        path: '/departamentos/:id/editar',
        name: 'states.edit',
        component: StatesEdit
      },
      {
        path: '/ciudades',
        name: 'cities.index',
        component: CitiesIndex
      },
      {
        path: '/ciudades/crear',
        name: 'cities.create',
        component: CitiesCreate
      },
      {
        path: '/ciudades/:id/editar',
        name: 'cities.edit',
        component: CitiesEdit
      },
      {
        path: '/citas',
        name: 'appointments.index',
        component: AppointmentsIndex
      },
      {
        path: '/citas/tablero-de-citas',
        name: 'appointments.board',
        component: AppointmentsBoard
      },
      {
        path: '/citas/reporte-de-citas',
        name: 'appointments.reports.appointments',
        component: AppointmentsReportsAppointments
      },
      {
        path: '/actividades',
        name: 'activities.index',
        component: ActivitiesIndex
      },
      {
        path: '/actividades/crear',
        name: 'activities.create',
        component: ActivitiesCreate
      },
      {
        path: '/actividades/:id/editar',
        name: 'activities.edit',
        component: ActivitiesEdit
      },
      {
        path: '/motivos-de-cancelacion',
        name: 'reasonCancellations.index',
        component: ReasonCancellationsIndex
      },
      {
        path: '/motivos-de-cancelacion/crear',
        name: 'reasonCancellations.create',
        component: ReasonCancellationsCreate
      },
      {
        path: '/motivos-de-cancelacion/:id/editar',
        name: 'reasonCancellations.edit',
        component: ReasonCancellationsEdit
      },
      {
        path: '/consultorios',
        name: 'consultingrooms.index',
        component: ConsultingroomsIndex
      },
      {
        path: '/consultorios/crear',
        name: 'consultingrooms.create',
        component: ConsultingroomsCreate
      },
      {
        path: '/consultorios/:id/editar',
        name: 'consultingrooms.edit',
        component: ConsultingroomsEdit
      },
      {
        path: '/unidades',
        name: 'unities.index',
        component: UnitiesIndex
      },
      {
        path: '/unidades/crear',
        name: 'unities.create',
        component: UnitiesCreate
      },
      {
        path: '/unidades/:id/editar',
        name: 'unities.edit',
        component: UnitiesEdit
      },
      {
        path: '/mascotas',
        name: 'pets.index',
        component: PetsIndex
      },
      {
        path: '/mascotas/crear',
        name: 'pets.create',
        component: PetsCreate
      },
      {
        path: '/mascotas/:id',
        name: 'pets.show',
        component: PetsShow
      },
      {
        path: '/mascotas/:id/editar',
        name: 'pets.edit',
        component: PetsEdit
      },
      {
        path: '/diagnosticos',
        name: 'diagnoses.index',
        component: DiagnosesIndex
      },
      {
        path: '/diagnosticos/crear',
        name: 'diagnoses.create',
        component: DiagnosesCreate
      },
      {
        path: '/diagnosticos/:id/editar',
        name: 'diagnoses.edit',
        component: DiagnosesEdit
      },
      {
        path: '/productos',
        name: 'products.index',
        component: ProductsIndex
      },
      {
        path: '/productos/crear',
        name: 'products.create',
        component: ProductsCreate
      },
      {
        path: '/productos/:id/editar',
        name: 'products.edit',
        component: ProductsEdit
      },
      {
        path: '/servicios',
        name: 'services.index',
        component: ServicesIndex
      },
      {
        path: '/servicios/crear',
        name: 'services.create',
        component: ServicesCreate
      },
      {
        path: '/servicios/:id/editar',
        name: 'services.edit',
        component: ServicesEdit
      },
      {
        path: '/finalidades-de-consulta',
        name: 'consultation_purposes.index',
        component: Consultation_purposesIndex
      },
      {
        path: '/finalidades-de-consulta/crear',
        name: 'consultation_purposes.create',
        component: Consultation_purposesCreate
      },
      {
        path: '/finalidades-de-consulta/:id/editar',
        name: 'consultation_purposes.edit',
        component: Consultation_purposesEdit
      },
      {
        path: '/historias-clinicas/crear',
        name: 'clinic_histories.create',
        component: ClinicHistoriesCreate
      },
      {
        path: '/informes/recetas-medicas',
        name: 'reports.prescription',
        component: reportsPrescription
      },
      {
        path: '/historias-clinicas/vacunacion-y-desparasitacion',
        name: 'clinic_histories.vaccine',
        component: reportsVaccine
      },
      {
        path: '/informes/historia-clinica',
        name: 'reports.clinicHistory',
        component: reportsClinicHistory
      },
      {
        path: '/informes/productos-y-servicios-aplicados',
        name: 'reports.reportsProductAndServiceApplied',
        component: reportsProductAndServiceApplied
      },
      {
        path: '/usuarios',
        name: 'users.index',
        component: UsersIndex
      },
      {
        path: '/usuarios/crear',
        name: 'users.create',
        component: UsersCreate
      },
      {
        path: '/usuarios/:id/editar',
        name: 'users.edit',
        component: UsersEdit
      },
      {
        path: '/usuarios/:id/permisos',
        name: 'users.permission',
        component: UsersPermission
      },
      {
        path: '/empresa',
        name: 'company',
        component: Company
      },
      {
        path: '/parametros',
        name: 'parameters',
        component: Parameters
      },
      {
        path: '/tipos-de-archivos-adjuntos',
        name: 'attachment_types.index',
        component: AttachmentTypesIndex
      },
      {
        path: '/tipos-de-archivos-adjuntos/crear',
        name: 'attachment_types.create',
        component: AttachmentTypesCreate
      },
      {
        path: '/tipos-de-archivos-adjuntos/:id/editar',
        name: 'attachment_types.edit',
        component: AttachmentTypesEdit
      },
      {
        path: '/reports/informe-de-atenciones',
        name: 'reports.consultations',
        component: reportsConsultation
      },
      {
        path: '/reports/informe-de-servicios-prestados',
        name: 'reports.services_provided',
        component: reportsServiceProvided
      },
      {
        path: '/plantillas-de-consentimiento-informado',
        name: 'informed_consent_template.index',
        component: informedConsentTemplateIndex
      },
      {
        path: '/plantillas-de-consentimiento-informado/:id/personalizar',
        name: 'informed_consent_template.customize',
        component: informedConsentTemplateCustomize
      },
      {
        path: '/consentimientos-informados',
        name: 'informed_consent.index',
        component: InformedConsentsIndex
      },
      {
        path: '/consentimientos-informados/nuevo',
        name: 'informed_consent.create',
        component: InformedConsentsCreate
      },
      {
        path: '/facturacion/autorizacion-de-facturacion',
        name: 'billing.billing_authorization',
        component: BillingBillingAuthorization
      },
      {
        path: '/facturacion/pendiente-por-facturar',
        name: 'billing.pending_billing',
        component: BillingPendingBilling
      },
      {
        path: '/facturacion/consulta-de-facturas',
        name: 'billing.bill_consultation',
        component: BillingBillConsultation
      },
      {
        path: '/facturacion/reporte-de-facturacion',
        name: 'billing.bill_report',
        component: BillingBillReport
      },
    ]
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !localStorage.getItem('access_token')) next({ name: 'login' })
  if (to.name == 'login' && localStorage.getItem('access_token')) next({ name: 'dashboard.index' })
  else next()
})

export default router
