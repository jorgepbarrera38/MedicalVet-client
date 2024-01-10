<template>
    <div class="tile">

        <!--Productos aplicados-->

        <div class="tile-title-w-btn">
            <h3 class="tile-title"><i class="fa fa-heartbeat"></i> Productos y servicios aplicados</h3>
        </div>

        <div class="table-responsive" style="max-height: 220px;">
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
                    <td nowrap>{{ formatDate(product_applied.created_at) }}</td>
                </tr>
                </tbody>
            </table>
        </div>

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
        
    </div>
</template>
<script>
import moment from 'moment'
moment.locale('es')
    export default {
        props: [ 'products_applied', 'services_applied'],
        data() {
            return {
                prescriptionSelected: {},
                exportingPrescriptionInPdf: false,
            }
        },
        methods: {
            formatDate (date) {
            //return date;
            return moment(date).format('DD-MMM-Y, h:mm a')
          },
          showPrescriptionInModal (prescription) {
            this.prescriptionSelected = prescription
            $('#prescriptionModal').modal('show')
          },
          exportPrescriptionInPdf (prescription) {
            prescription.exportingPrescriptionInPdf = true
            this.$http.get(`reports/prescriptions/${ prescription.id }/export-prescription-in-pdf`, { responseType: 'blob'}).then(response => {
              this.exportingPrescriptionInPdf = false
                window.open(URL.createObjectURL(response.data), '_blank')
                prescription.exportingPrescriptionInPdf = false
            }).catch( error => {
              this.$toastr.info('Ocurrió un error')
              this.exportingPrescriptionInPdf = false
            })
          },
        }
    }
</script>