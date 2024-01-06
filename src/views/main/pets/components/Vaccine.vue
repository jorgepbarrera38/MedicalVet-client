<template>
    <div class="tile">
        <div class="tile-title-w-btn">
            <h3 class="tile-title"><i class="fa fa-medkit"></i> Vacunas y desparasitaciones</h3>
            <button class="btn btn-primary btn-sm" @click="exportVaccinesInPdf()" :disabled="exportingVaccinesInPdf">
                <span class="spinner-border spinner-border-sm ml-1" v-if="exportingVaccinesInPdf"></span>
                <i class="fa fa-fw fa-lg fa fa-print" v-else></i> Exportar
            </button>
        </div>
        <!---->

        <div class="table-responsive" style="max-height: 220px;">
            <table class="table table-sm table-hover">
                <thead>
                    <th>Vacuna</th>
                    <th nowrap>Fecha de registro</th>
                    <th nowrap>Fecha de aplicación	</th>
                    <th nowrap>Fecha de siguiente vacuna</th>
                </thead>
                <tbody>
                <tr v-for="vaccine in vaccines" :key="'vaccineFromPet' + vaccine.id">
                    <td nowrap>{{ vaccine.product.code + ' - ' + vaccine.product.name }}</td>
                    <td nowrap>{{ formatDate(vaccine.registration_date) }}</td>
                    <td nowrap>{{ formatDate(vaccine.application_date) }}</td>
                    <td nowrap>{{ formatDate(vaccine.next_date) }}</td>
                </tr>
                </tbody>
            </table>
        </div>   
        
        <!--Desparasitaciones-->

        <div class="table-responsive" style="max-height: 220px;">
            <table class="table table-sm table-hover">
                <thead>
                    <th>Desparasitante</th>
                    <th nowrap>Fecha de registro</th>
                    <th nowrap>Fecha de aplicación	</th>
                    <th nowrap>Fecha de siguiente desparasitación</th>
                </thead>
                <tbody>
                <tr v-for="vaccine in dewormings" :key="'vaccineFromPet' + vaccine.id">
                    <td nowrap>{{ vaccine.product.code + ' - ' + vaccine.product.name }}</td>
                    <td nowrap>{{ formatDate(vaccine.registration_date) }}</td>
                    <td nowrap>{{ formatDate(vaccine.application_date) }}</td>
                    <td nowrap>{{ formatDate(vaccine.next_date) }}</td>
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
        props: [ 'vaccines', 'dewormings' ],
        data() {
            return {
                exportingVaccinesInPdf: false,
            }
        },
        methods: {
            formatDate (date) {
              return moment(date).format('DD-MMM-Y')
          },
          exportVaccinesInPdf () {
            this.exportingVaccinesInPdf = true

            this.$http.get(`reports/vaccine/${ this.vaccines[0].pet_id }/export-pdf`, { responseType: 'blob'}).then(response => {
              this.exportingVaccinesInPdf = false
                window.open(URL.createObjectURL(response.data), '_blank')
            }).catch( error => {
              this.$toastr.info('Ocurrió un error')
              this.exportingVaccinesInPdf = false
            })
          },
        }
    }
</script>