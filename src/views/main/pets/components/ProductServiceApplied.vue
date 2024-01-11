<template>
    <div class="tile">

        
        <div class="tile-title-w-btn">
            <h3 class="tile-title"><i class="fa fa-heartbeat"></i> Productos y servicios aplicados</h3>
            <div class="btn-group">
                <button class="btn btn-primary btn-sm mr-1" @click="showModalForRegisterProductApplied">
                    <i class="fa fa-fw fa-lg fa fa-plus"></i> Producto
                </button>
                <button class="btn btn-primary btn-sm mr-1" @click="showModalForRegisterServiceApplied">
                    <i class="fa fa-fw fa-lg fa fa-plus"></i> Servicio
                </button>
                <!---->
                <button class="btn btn-primary btn-sm" @click="exportProductsAndServicesInPdf()" :disabled="exportingProductsAndServicesInPdf">
                    <span class="spinner-border spinner-border-sm ml-1" v-if="exportingProductsAndServicesInPdf"></span>
                    <i class="fa fa-fw fa-lg fa fa-print" v-else></i>
                </button>
            </div>
        </div>
        
        <!--Productos aplicados-->

        <div class="table-responsive mb-3" style="max-height: 220px;">
            <table class="table table-sm table-hover">
                <thead>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th nowrap>Fecha de aplicación</th>
                </thead>
                <tbody>
                <tr v-for="product_applied in products_applied" :key="'products_appliedFromPet' + product_applied.id">
                    <td nowrap>{{ product_applied.product.code + ' - ' + product_applied.product.name }}</td>
                    <td nowrap>{{ product_applied.quantity }}</td>
                    <td nowrap>{{ formatDate(product_applied.application_date) }}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <ProductAppliedCreateComponent :pet_id="pet_id" @productAppliedRegistered="$emit('productAppliedRegistered')" />

        <!--Servicios aplicados-->
        
        <div class="table-responsive" style="max-height: 220px;">
            <table class="table table-sm table-hover">
                <thead>
                    <th>Servicio</th>
                    <th>Cantidad</th>
                    <th nowrap>Fecha de aplicación</th>
                </thead>
                <tbody>
                <tr v-for="service_applied in services_applied" :key="'services_appliedFromPet' + service_applied.id">
                    <td nowrap>{{ service_applied.service.code + ' - ' + service_applied.service.name }}</td>
                    <td nowrap>{{ service_applied.quantity }}</td>
                    <td nowrap>{{ formatDate(service_applied.application_date) }}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <ServiceAppliedCreateComponent :pet_id="pet_id" @serviceAppliedRegistered="$emit('serviceAppliedRegistered')" />
        
    </div>
</template>
<script>
import moment from 'moment'
import ServiceAppliedCreateComponent from '../../reports/ServiceAppliedCreateComponent.vue'
import ProductAppliedCreateComponent from '../../reports/ProductAppliedCreateComponent.vue'
moment.locale('es')
    export default {
        props: [ 'pet_id', 'products_applied', 'services_applied'],
        components: {
            ServiceAppliedCreateComponent, ProductAppliedCreateComponent
        },
        data() {
            return {
                exportingProductsAndServicesInPdf: false,
            }
        },
        methods: {
            formatDate (date) {
            //return date;
            return moment(date).format('DD-MMM-Y, h:mm a')
          },
          showModalForRegisterServiceApplied () {
            $('#modalServicesApplied').modal('show')
          },
          showModalForRegisterProductApplied () {
            $('#modalProductsApplied').modal('show')
          },
          exportProductsAndServicesInPdf () {
            if (!this.products_applied.length && !this.services_applied.length) {
                return this.$toastr.info('No hay registros')
            }

            this.exportingProductsAndServicesInPdf = true

            this.$http.get(`reports/products-and-services-applied/${ this.pet_id }/export-pdf`, { params: {}, responseType: 'blob' }).then(response => {
              this.exportingProductsAndServicesInPdf = false
              window.open(URL.createObjectURL(response.data), '_blank')
            }).catch( error => {
              this.exportingProductsAndServicesInPdf = false
              if (error.response.status == 422) {
                return this.$toastr.info(error.response.data.message)
              }
              this.$toastr.error('El archivo no se pudo generar')
            })
          },
        }
    }
</script>