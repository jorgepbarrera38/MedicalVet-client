<template>
    <div class="tile">
        <div class="tile-title-w-btn">
            <h3 class="tile-title"><i class="fa fa-paperclip"></i> Archivos adjuntos</h3>
        </div>
        <!---->

        <div class="table-responsive" style="max-height: 220px;">
            <table class="table table-sm table-hover">
                <thead>
                    <th>Archivo</th>
                    <th>Fecha</th>
                </thead>
                <tbody>
                <tr v-for="clinicHistoryAttachment in clinicHistoryAttachments" :key="'clinicHistoryAttachmentFromPet' + clinicHistoryAttachment.id">
                    <td nowrap>
                        <a :href="$APP_URL + clinicHistoryAttachment.file" target="_blank">
                                {{ clinicHistoryAttachment.attachment_type.name }}
                              </a>
                    </td>
                    <td nowrap>{{ formatDate(clinicHistoryAttachment.created_at) }}</td>
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
        props: [ 'clinicHistoryAttachments' ],
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