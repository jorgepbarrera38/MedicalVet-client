<template>
    <div class="tile">
        <div class="tile-title-w-btn">
            <h3 class="tile-title"><i class="fa fa-search"></i> Diagnósticos</h3>
        </div>
        <!---->

        <div class="table-responsive" style="max-height: 220px;">
            <table class="table table-sm table-hover">
                <thead>
                    <th>Diagnóstico</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                </thead>
                <tbody>
                <tr v-for="diagnosis in diagnoses" :key="'diagnosesFromPet' + diagnosis.id">
                    <td nowrap>{{ diagnosis.diagnosis.name }}</td>
                    <td nowrap>{{ diagnosis.type }}</td>
                    <td nowrap>{{ formatDate(diagnosis.created_at) }}</td>
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
        props: [ 'diagnoses' ],
        data() {
            return {
                
            }
        },
        methods: {
            formatDate (date) {
            //return date;
            return moment(date).format('DD-MMM-Y, h:mm a')
          },
        }
    }
</script>