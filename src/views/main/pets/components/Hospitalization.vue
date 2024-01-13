<template>
    <div class="tile">
        <div class="tile-title-w-btn">
            <h3 class="tile-title"><i class="fa fa-hospital-o"></i> Hospitalizaciones</h3>
        </div>
        <!---->

        <div class="table-responsive" style="max-height: 220px;">
            <table class="table table-sm table-hover">
                <thead>
                    <th>Fecha ingreso</th>
                    <th>Fecha egreso</th>
                    <th>Servicio</th>
                    <th></th>
                </thead>
                <tbody>
                <tr v-for="hospitalization in hospitalizations" :key="'hospitalizationFromPet' + hospitalization.id">
                    <td nowrap>{{ formatDate(hospitalization.initial_date) }}</td>
                    <td nowrap>{{ formatDate(hospitalization.final_date) }}</td>
                    <td nowrap>{{ hospitalization.service.code + ' - ' + hospitalization.service.name }}</td>
                    <td>
                        <!--<button class="btn btn-danger btn-sm" @click="deleteHospitalization(hospitalization)">
                            <i class="fa fa-trash"></i>
                        </button>-->
                    </td>
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
        props: [ 'hospitalizations' ],
        data() {
            return {
                
            }
        },
        methods: {
            formatDate (date) {
            //return date;
            return moment(date).format('DD-MMM-Y, h:mm a')
          },
          deleteHospitalization (hospitalization) {
            this.$http.delete(`hospitalizations/${hospitalization.id}`).then( response => {
                this.$toastr.error('Registro de hospitalización eliminado')
                this.$emit('hospitalizationDeleted')
            }).catch(error => {
                this.$toastr.error('La hospitalización no se pudo eliminar')
            })
          }
        }
    }
</script>