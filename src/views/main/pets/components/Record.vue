<template>
    <div class="tile">
        <div class="tile-title-w-btn">
            <h3 class="tile-title"><i class="fa fa-history"></i> Antecedentes</h3>
        </div>
        <!---->

        <div class="table-responsive" style="max-height: 220px;">
            <table class="table table-sm table-hover">
                <thead>
                    <th>Antecedente</th>
                    <th>Fecha</th>
                </thead>
                <tbody>
                <tr v-for="record in records" :key="'recordsFromPet' + record.id">
                    <td nowrap>{{ record.description }}</td>
                    <td nowrap>{{ formatDate(record.created_at) }}</td>
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
        props: [ 'records' ],
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