<template>
    <div class="tile">
        <div class="tile-title-w-btn">
            <h3 class="tile-title">Recetas veterinarias</h3>
        </div>
        <!---->

        <div class="table-responsive" style="max-height: 220px;">
            <table class="table table-sm table-hover">
                <thead>
                    <th>Id</th>
                    <th>Fecha</th>
                    <th>Observaciones</th>
                    <th></th>
                </thead>
                <tbody>
                <tr v-for="prescription in prescriptions" :key="'prescriptionFromPet' + prescription.id">
                    <td nowrap>{{ prescription.id }}</td>
                    <td nowrap>{{ formatDate(prescription.created_at) }}</td>
                    <td nowrap>{{ prescription.observations }}</td>
                    <td>
                        <button class="btn btn-info btn-sm mr-1" @click="showPrescriptionInModal(prescription)">
                            <i class="fa fa-fw fa-lg fa fa-eye"></i>
                        </button>
                        <button class="btn btn-primary btn-sm" @click="exportPrescriptionInPdf(prescription)" :disabled="prescription.exportingPrescriptionInPdf">
                            <span v-if="prescription.exportingPrescriptionInPdf" class="spinner-border spinner-border-sm ml-1"></span>
                            <i class="fa fa-fw fa-lg fa fa-print" v-else></i>
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <!---->

        <!--Modal show  prescription-->
        <div class="modal fade" id="prescriptionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Información de la receta</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <div class="table-responsive">
                      <table class="table table-hover table-sm">
                        <thead>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Posología</th>
                        </thead>
                        <tbody>
                            <tr v-for="prescription in prescriptionSelected.clinic_history_prescription_details">
                                <td>{{ prescription.product.code + ' - ' + prescription.product.name }}</td>
                                <td>{{ prescription.quantity }}</td>
                                <td>{{ prescription.posology }}</td>
                            </tr>
                        </tbody>
                      </table>
                    </div>
                    <p><b>Observaciones: </b>{{ prescriptionSelected.observations }}</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
        <!--Modal show  prescription-->
        
    </div>
</template>
<script>
import moment from 'moment'
moment.locale('es')
    export default {
        props: [ 'prescriptions' ],
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