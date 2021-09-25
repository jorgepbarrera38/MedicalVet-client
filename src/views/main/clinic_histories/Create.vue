<template>
    <div>
        <div class="app-title">
            <div>
              <h1><i class="fa fa-file-text"></i> Historia clínica</h1>
            </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="tile">
              <h3 class="tile-title">Registro de historia clínica</h3>
              <SearchOwnersAndPets 
                @owner-selected="setOwnerSelected"
                @pet-selected="petOwnerSelected"
                @searching="setStateFromLoading"
                :disableFields="!buttonThatOpenFolio"
                :clearData="buttonThatOpenFolio">
              </SearchOwnersAndPets>
              <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                      <label for="">Finalidad de la consulta (*)</label>
                      <select class="form-control" :disabled="!buttonThatOpenFolio" v-model="consultation_purposesSelected">
                        <option :value="{ id: null,
                                        symptoms: '',
                                        anamnesis: '',
                                        indications: '',
                                        records: '',
                                        physiological_constants: '',
                                        diagnoses: '',
                                        vaccines: '',
                                        dewormings: '',
                                        attachments: '',
                                        products_and_services_applied: '' }">Seleccione finalidad</option>
                        <option :value="consultationPurpose" v-for="consultationPurpose in consultationPurposes" :key="'cp-' + consultationPurpose.id">{{ consultationPurpose.name }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="">Cita</label>
                      <select class="form-control" :disabled="!buttonThatOpenFolio" v-model="clinicHistory.appointment_id">
                        <option value="">Seleccione cita pendiente</option>
                        <option :value="appointment.id" v-for="appointment in appointmentsPendingFromPet" :key="'appintment-' + appointment.id">
                          {{ formatDateWithHour(appointment.date_time_start) + ' - ' + appointment.consultingroom.name + ' - ' + appointment.activity.name }}
                        </option>
                      </select>
                    </div>
                  </div>
              </div>
              <div>
                <button :disabled="!buttonThatOpenFolio || !ownerSelected || !clinicHistory.pet_id || !consultation_purposesSelected.id || folioOpen" class="btn btn-primary" @click="openFolio">
                  <i  class="fa fa-fw fa-lg fa fa-folder-open"></i>Abrir folio
                </button>
                &nbsp;&nbsp;&nbsp;
                <button :disabled="!ownerSelected || !clinicHistory.pet_id || !consultation_purposesSelected.id || !folioOpen" class="btn btn-danger" @click="undoFolio">
                  <i  class="fa fa-fw fa-lg fa fa-undo"></i>Deshacer
                </button>
                <!--<router-link :to="{ name: 'races.index' }" class="btn btn-danger">Cancelar</router-link>-->
              </div>
            </div>
          </div>
          
        </div>
        <!--Info from pacient-->
        <div class="row" v-if="folioOpen">
          <div class="col-md-4">
            <div class="tile">
              <h3 class="tile-title">Información de la mascota</h3>
              <form class="form-horizontal" style="min-height:370px;max-height:370px;overflow:auto">
                <div class="form-group">
                  <div class="col-md-12">
                    <center>
                      <img style="border-radius:10%"
                            width="150" :src="infoFromPetAndOwner.photo ? $hostFiles + infoFromPetAndOwner.photo : avatarPet" alt="">
                    </center>
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-md-3">Nombre</label>
                  <div class="col-md-12">
                    <input class="form-control" type="text" disabled :value="infoFromPetAndOwner.name">
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-md-12">Especie</label>
                  <div class="col-md-12">
                    <input class="form-control " type="text" disabled :value="infoFromPetAndOwner.species.name">
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-md-12">Raza</label>
                  <div class="col-md-12">
                    <input class="form-control" type="text" disabled :value="infoFromPetAndOwner.race.name">
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-md-12">Fecha nacimiento</label>
                  <div class="col-md-12">
                    <input class="form-control " type="text" disabled :value="infoFromPetAndOwner.date_born">
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-md-12">Sexo</label>
                  <div class="col-md-12">
                    <input class="form-control " type="text" disabled :value="infoFromPetAndOwner.sex">
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-md-12">Tamaño</label>
                  <div class="col-md-12">
                    <input class="form-control " type="text" disabled :value="infoFromPetAndOwner.size">
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-md-12">Color</label>
                  <div class="col-md-12">
                    <input class="form-control " type="text" disabled :value="infoFromPetAndOwner.color">
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-md-12">Observaciónes</label>
                  <div class="col-md-12">
                    <textarea class="form-control" rows="6" disabled :value="infoFromPetAndOwner.observations"></textarea>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="col-md-4">
            <div class="tile">
              <h3 class="tile-title">Antecedentes recientes</h3>
              <div class="table-responsive" style="min-height:370px;max-height:370px;overflow:auto">
                <table class="table table-hover table-sm">
                  <thead>
                    <tr>
                      <th>Antecedente</th>
                      <th>Fecha</th>
                      <th>Folio</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="record in recordsFromPet" :key="'recordFromPet' + record.id">
                      <td nowrap>{{ record.description }}</td>
                      <td nowrap>{{ formatDate(clinicHistory.created_at) }}</td>
                      <td>{{ record.clinic_history.number_folio }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="tile" style="min-height:459px;max-height:459px">
              <h3 class="tile-title">Diagnósticos recientes</h3>
              <div class="table-responsive" style="min-height:370px;max-height:370px;overflow:auto">
                <table class="table table-hover table-sm">
                  <thead>
                    <tr>
                      <th>Diagnóstico</th>
                      <th>Tipo</th>
                      <th>Fecha</th>
                      <th>Folio</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="diagnosis in diagnosesFromPet" :key="'hcFromPet' + diagnosis.id">
                      <td nowrap>{{ diagnosis.diagnosis.name }}</td>
                      <td nowrap>{{ diagnosis.type }}</td>
                      <td nowrap>{{ formatDate(diagnosis.clinic_history.created_at) }}</td>
                      <td nowrap>{{ diagnosis.clinic_history.number_folio }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!--Fin info del paciente-->
        <div class="row" v-if="folioOpen">
          <div class="col-md-12">
            <!--Motivo y síntomas-->
            <div class="row">
              <div class="col-md-12">
                <div class="tile">
                  <!--<div class="tile-title"></div>-->
                    <div class="row" id="errors">
                    <!--Finalidad de la consulta-->
                      <div class="col-md-12">
                        <div class="form-group">
                          <label for="">Motivo (*)</label>
                          <textarea rows="3" :class="{ 
                                                      'form-control': true, 
                                                      'is-invalid': errors && errors['reason_consultation']
                                                      }" maxlength="800" v-model="clinicHistory.reason_consultation"></textarea>
                          <span v-if="errors && errors['reason_consultation']" class="text-danger">
                            {{ errors['reason_consultation'][0] }}
                          </span>
                        </div>
                      </div>
                      <div class="col-md-12" v-if="consultation_purposesSelected.symptoms">
                        <div class="form-group">
                          <label for="">Síntomas (*)</label>
                          <textarea rows="3" :class="{ 
                                                      'form-control': true, 
                                                      'is-invalid': errors && errors['symptoms']
                                                      }" maxlength="800" v-model="clinicHistory.symptoms"></textarea>
                          <span v-if="errors && errors['symptoms']" class="text-danger">
                            {{ errors['symptoms'][0] }}
                          </span>                                                      
                        </div>
                      </div>
                      <div class="col-md-12" v-if="consultation_purposesSelected.anamnesis">
                        <div class="form-group">
                          <label for="">Anamnesis (*)</label>
                          <textarea rows="3" :class="{ 
                                                      'form-control': true, 
                                                      'is-invalid': errors && errors['anamnesis']
                                                      }" maxlength="800" v-model="clinicHistory.anamnesis"></textarea>
                          <span v-if="errors && errors['anamnesis']" class="text-danger">
                            {{ errors['anamnesis'][0] }}
                          </span>                                                         
                        </div>
                      </div>
                    </div>
                </div>
                
              </div>
            </div>
            <!--Fin motivo y síntomas-->
            <!--Inicio revisión por sistemas-->
            <div class="row">
              <div class="col-md-12">
                <div class="tile" v-if="consultation_purposesSelected.review_by_systems">
                  <h3 class="tile-title">Revisión por sistemas</h3>
                    
                    <div class="row">
                      <div class="col-md-6">
                        <div class="tile">

                          <div>
                            <div class="form-group">
                              <label class="control-label">Sistema respiratorio:</label>
                              <div>
                                <span v-if="errors && errors['reviewBySystems.respiratorySystem.state']" class="text-danger">
                                  {{ errors['reviewBySystems.respiratorySystem.state'][0] }}
                                </span>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Normal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.respiratorySystem.state">Normal
                                </label>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Anormal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.respiratorySystem.state">Anormal
                                </label>
                              </div>

                            </div>
                            <div class="form-group" v-show="clinicHistory.reviewBySystems.respiratorySystem.state == 'Anormal'">
                              <label for="">Observaciónes</label>
                              <textarea rows="3" :class="{ 
                                                          'form-control': true, 
                                                          'is-invalid': errors && errors['reviewBySystems.respiratorySystem.observations']
                                                          }" 
                                        v-model="clinicHistory.reviewBySystems.respiratorySystem.observations" 
                                        maxlength="1000"></textarea>
                              <span v-if="errors && errors['reviewBySystems.respiratorySystem.observations']" class="text-danger">
                                {{ errors['reviewBySystems.respiratorySystem.observations'][0] }}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div class="form-group">
                              <label class="control-label">Sistema tegumentario:</label>
                              <div>
                                <span v-if="errors && errors['reviewBySystems.tegumentarySystem.state']" class="text-danger">
                                  {{ errors['reviewBySystems.tegumentarySystem.state'][0] }}
                                </span>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Normal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.tegumentarySystem.state">Normal
                                </label>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Anormal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.tegumentarySystem.state">Anormal
                                </label>
                              </div>
                            </div>
                            <div class="form-group" v-show="clinicHistory.reviewBySystems.tegumentarySystem.state == 'Anormal'">
                              <label for="">Observaciónes</label>
                              <textarea rows="3" :class="{ 
                                                          'form-control': true, 
                                                          'is-invalid': errors && errors['reviewBySystems.tegumentarySystem.observations']
                                                          }" 
                                        v-model="clinicHistory.reviewBySystems.tegumentarySystem.observations" 
                                        maxlength="1000"></textarea>
                              <span v-if="errors && errors['reviewBySystems.tegumentarySystem.observations']" class="text-danger">
                                {{ errors['reviewBySystems.tegumentarySystem.observations'][0] }}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div class="form-group">
                              <label class="control-label">Sistema nervioso:</label>
                              <div>
                                <span v-if="errors && errors['reviewBySystems.nervousSystem.state']" class="text-danger">
                                  {{ errors['reviewBySystems.nervousSystem.state'][0] }}
                                </span>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Normal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.nervousSystem.state">Normal
                                </label>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Anormal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.nervousSystem.state">Anormal
                                </label>
                              </div>

                            </div>
                            <div class="form-group" v-show="clinicHistory.reviewBySystems.nervousSystem.state == 'Anormal'">
                              <label for="">Observaciónes</label>
                              <textarea rows="3" :class="{ 
                                                          'form-control': true, 
                                                          'is-invalid': errors && errors['reviewBySystems.nervousSystem.observations']
                                                          }" 
                                        v-model="clinicHistory.reviewBySystems.nervousSystem.observations" 
                                        maxlength="1000"></textarea>
                              <span v-if="errors && errors['reviewBySystems.nervousSystem.observations']" class="text-danger">
                                {{ errors['reviewBySystems.nervousSystem.observations'][0] }}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div class="form-group">
                              <label class="control-label">Sistema genitourinario:</label>
                              <div>
                                <span v-if="errors && errors['reviewBySystems.genitourinarySystem.state']" class="text-danger">
                                  {{ errors['reviewBySystems.genitourinarySystem.state'][0] }}
                                </span>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Normal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.genitourinarySystem.state">Normal
                                </label>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Anormal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.genitourinarySystem.state">Anormal
                                </label>
                              </div>

                            </div>
                            <div class="form-group" v-show="clinicHistory.reviewBySystems.genitourinarySystem.state == 'Anormal'">
                              <label for="">Observaciónes</label>
                              <textarea rows="3" :class="{ 
                                                          'form-control': true, 
                                                          'is-invalid': errors && errors['reviewBySystems.genitourinarySystem.observations']
                                                          }" 
                                        v-model="clinicHistory.reviewBySystems.genitourinarySystem.observations" 
                                        maxlength="1000"></textarea>
                              <span v-if="errors && errors['reviewBySystems.genitourinarySystem.observations']" class="text-danger">
                                {{ errors['reviewBySystems.genitourinarySystem.observations'][0] }}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div class="form-group">
                              <label class="control-label">Ganglios linfáticos:</label>
                              <div>
                                <span v-if="errors && errors['reviewBySystems.lymphNodes.state']" class="text-danger">
                                  {{ errors['reviewBySystems.lymphNodes.state'][0] }}
                                </span>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Normal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.lymphNodes.state">Normal
                                </label>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Anormal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.lymphNodes.state">Anormal
                                </label>
                              </div>

                            </div>
                            <div class="form-group" v-show="clinicHistory.reviewBySystems.lymphNodes.state == 'Anormal'">
                              <label for="">Observaciónes</label>
                              <textarea rows="3" :class="{ 
                                                          'form-control': true, 
                                                          'is-invalid': errors && errors['reviewBySystems.lymphNodes.observations']
                                                          }" 
                                        v-model="clinicHistory.reviewBySystems.lymphNodes.observations" 
                                        maxlength="1000"></textarea>
                              <span v-if="errors && errors['reviewBySystems.lymphNodes.observations']" class="text-danger">
                                {{ errors['reviewBySystems.lymphNodes.observations'][0] }}
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div class="col-md-6">
                        <div class="tile">

                          <div>
                            <div class="form-group">
                              <label class="control-label">Sistema musculoesquelético:</label>
                              <div>
                                <span v-if="errors && errors['reviewBySystems.musculoskeletalSystem.state']" class="text-danger">
                                  {{ errors['reviewBySystems.musculoskeletalSystem.state'][0] }}
                                </span>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Normal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.musculoskeletalSystem.state">Normal
                                </label>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Anormal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.musculoskeletalSystem.state">Anormal
                                </label>
                              </div>

                            </div>
                            <div class="form-group" v-show="clinicHistory.reviewBySystems.musculoskeletalSystem.state == 'Anormal'">
                              <label for="">Observaciónes</label>
                              <textarea rows="3" :class="{ 
                                                          'form-control': true, 
                                                          'is-invalid': errors && errors['reviewBySystems.musculoskeletalSystem.observations']
                                                          }" 
                                        v-model="clinicHistory.reviewBySystems.musculoskeletalSystem.observations" 
                                        maxlength="1000"></textarea>
                              <span v-if="errors && errors['reviewBySystems.musculoskeletalSystem.observations']" class="text-danger">
                                {{ errors['reviewBySystems.musculoskeletalSystem.observations'][0] }}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div class="form-group">
                              <label class="control-label">Sistema reproductivo:</label>
                              <div>
                                <span v-if="errors && errors['reviewBySystems.reproductiveSystem.state']" class="text-danger">
                                  {{ errors['reviewBySystems.reproductiveSystem.state'][0] }}
                                </span>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Normal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.reproductiveSystem.state">Normal
                                </label>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Anormal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.reproductiveSystem.state">Anormal
                                </label>
                              </div>

                            </div>
                            <div class="form-group" v-show="clinicHistory.reviewBySystems.reproductiveSystem.state == 'Anormal'">
                              <label for="">Observaciónes</label>
                              <textarea rows="3" :class="{ 
                                                          'form-control': true, 
                                                          'is-invalid': errors && errors['reviewBySystems.reproductiveSystem.observations']
                                                          }" 
                                        v-model="clinicHistory.reviewBySystems.reproductiveSystem.observations" 
                                        maxlength="1000"></textarea>
                              <span v-if="errors && errors['reviewBySystems.reproductiveSystem.observations']" class="text-danger">
                                {{ errors['reviewBySystems.reproductiveSystem.observations'][0] }}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div class="form-group">
                              <label class="control-label">Sistema digestivo:</label>
                              <div>
                                <span v-if="errors && errors['reviewBySystems.digestiveSystem.state']" class="text-danger">
                                  {{ errors['reviewBySystems.digestiveSystem.state'][0] }}
                                </span>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Normal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.digestiveSystem.state">Normal
                                </label>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Anormal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.digestiveSystem.state">Anormal
                                </label>
                              </div>

                            </div>
                            <div class="form-group" v-show="clinicHistory.reviewBySystems.digestiveSystem.state == 'Anormal'">
                              <label for="">Observaciónes</label>
                              <textarea rows="3" :class="{ 
                                                          'form-control': true, 
                                                          'is-invalid': errors && errors['reviewBySystems.digestiveSystem.observations']
                                                          }" 
                                        v-model="clinicHistory.reviewBySystems.digestiveSystem.observations" 
                                        maxlength="1000"></textarea>
                              <span v-if="errors && errors['reviewBySystems.digestiveSystem.observations']" class="text-danger">
                                {{ errors['reviewBySystems.digestiveSystem.observations'][0] }}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div class="form-group">
                              <label class="control-label">Cavidad oral:</label>
                              <div>
                                <span v-if="errors && errors['reviewBySystems.oralCavity.state']" class="text-danger">
                                  {{ errors['reviewBySystems.oralCavity.state'][0] }}
                                </span>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Normal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.oralCavity.state">Normal
                                </label>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input value="Anormal" class="form-check-input" type="radio" v-model="clinicHistory.reviewBySystems.oralCavity.state">Anormal
                                </label>
                              </div>

                            </div>
                            <div class="form-group" v-show="clinicHistory.reviewBySystems.oralCavity.state == 'Anormal'">
                              <label for="">Observaciónes</label>
                              <textarea rows="3" :class="{ 
                                                          'form-control': true, 
                                                          'is-invalid': errors && errors['reviewBySystems.oralCavity.observations']
                                                          }" 
                                        v-model="clinicHistory.reviewBySystems.oralCavity.observations" 
                                        maxlength="1000"></textarea>
                              <span v-if="errors && errors['reviewBySystems.oralCavity.observations']" class="text-danger">
                                {{ errors['reviewBySystems.oralCavity.observations'][0] }}
                              </span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                    
                    
               
                </div>
              </div>
            </div>
            <!--Fin revision por sistemas-->
            <!--Inicio constantes fisiológicas-->
            <div class="row">
              <div class="col-md-12">
                <div class="tile" v-if="consultation_purposesSelected.physiological_constants">
                  <h3 class="tile-title">Constantes fisiológicas</h3>
                  <div class="row">
                    <div class="col-md-12">
                      <!--Constantes fisiológicas-->
                      <div class="row">
                        <div class="col-md-3">
                          <div class="form-group">
                            <label for="">Peso KG (*)</label>
                            <input type="number" :class="{ 
                                                      'form-control': true, 
                                                      'is-invalid': errors && errors['physiologicalConstants.weight']
                                                      }" v-model="clinicHistory.physiologicalConstants.weight">
                            <span v-if="errors && errors['physiologicalConstants.weight']" class="text-danger">
                              {{ errors['physiologicalConstants.weight'][0] }}
                            </span>                                                      
                          </div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-group">
                            <label for="">Temperatura °C (*)</label>
                            <input type="number" :class="{ 
                                                      'form-control': true, 
                                                      'is-invalid': errors && errors['physiologicalConstants.temperature']
                                                      }" v-model="clinicHistory.physiologicalConstants.temperature">
                            <span v-if="errors && errors['physiologicalConstants.temperature']" class="text-danger">
                              {{ errors['physiologicalConstants.temperature'][0] }}
                            </span>                                                      
                          </div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-group">
                            <label for="">Frecuencia cardíaca (*)</label>
                            <input type="number" :class="{ 
                                                      'form-control': true, 
                                                      'is-invalid': errors && errors['physiologicalConstants.heart_rate']
                                                      }" v-model="clinicHistory.physiologicalConstants.heart_rate">
                            <span v-if="errors && errors['physiologicalConstants.heart_rate']" class="text-danger">
                              {{ errors['physiologicalConstants.heart_rate'][0] }}
                            </span>                                                      
                          </div>
                        </div>
                        <div class="col-md-3">
                          <div class="form-group">
                            <label for="">Frecuencia respiratoria (*)</label>
                            <input type="number" :class="{ 
                                                      'form-control': true, 
                                                      'is-invalid': errors && errors['physiologicalConstants.breathing_frequency']
                                                      }" v-model="clinicHistory.physiologicalConstants.breathing_frequency">
                            <span v-if="errors && errors['physiologicalConstants.breathing_frequency']" class="text-danger">
                              {{ errors['physiologicalConstants.breathing_frequency'][0] }}
                            </span>                                                      
                          </div>
                        </div>
                      </div>
                      <!--Fin constantes fisiológicas-->
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--Fin constantes fisiológicas-->
            <!--Tab de opciones-->
            <div class="row" v-if="consultation_purposesSelected.records || consultation_purposesSelected.diagnoses || consultation_purposesSelected.vaccines || consultation_purposesSelected.dewormings">
            <div class="col-md-12">
              <div class="tile">
                <!--<h3 class="tile-title">Diagnósticos</h3>-->
                <div class="row">
                  <div class="col-md-12">
                    <div class="bs-component">
                      <ul class="nav nav-tabs">
                        <li v-if="consultation_purposesSelected.records" class="nav-item">
                          <a :class="{
                                      'nav-link': true, 
                                      active: consultation_purposesSelected.records
                                      }" data-toggle="tab" href="#record">Antecedentes</a>
                        </li>
                        <li v-if="consultation_purposesSelected.diagnoses" class="nav-item">
                          <a :class="{
                                        'nav-link': true,
                                        active: consultation_purposesSelected.diagnoses && !consultation_purposesSelected.records
                                      }" data-toggle="tab" href="#diagnosis">Diagnósticos</a>
                          </li>
                        <li v-if="consultation_purposesSelected.vaccines" class="nav-item">
                          <a :class="{
                                        'nav-link': true,
                                        active: consultation_purposesSelected.vaccines && !consultation_purposesSelected.diagnoses && !consultation_purposesSelected.records
                                      }" data-toggle="tab" href="#vaccine">Vacunación</a>
                          </li>
                        <li v-if="consultation_purposesSelected.dewormings" class="nav-item">
                          <a :class="{
                                        'nav-link': true,
                                        active: consultation_purposesSelected.dewormings && !consultation_purposesSelected.vaccines && !consultation_purposesSelected.diagnoses && !consultation_purposesSelected.records
                                      }" data-toggle="tab" href="#deworming">Desparasitación</a>
                          </li>
                      </ul>
                      <div class="tab-content" id="myTabContent">

                        <div v-if="consultation_purposesSelected.records"
                            :class="{'tab-pane': true, 
                              fade:true, 
                              'p-2': true, 
                              active: consultation_purposesSelected.records, 
                              show: consultation_purposesSelected.records
                            }" id="record">
                          <!--Antecedentes-->
                          <div class="row">
                            <div class="col-md-12">
                              <div class="form-group">
                                <label for="">Descripción del antecedente (*)</label>
                                <input type="text" class="form-control" v-model="record" maxlength="100" @keyup.enter="addRecordToClinicHistory">
                              </div>
                            </div>
                            <div class="col-md-4">
                              <div class="form-group">
                                <label for=""></label>
                                <button class="btn btn-primary" @click="addRecordToClinicHistory">
                                  <i class="fa fa-plus"></i> Agregar
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-12">
                              <div class="table-responsive">
                                <table class="table table-hover table-sm">
                                  <thead>
                                    <tr>
                                      <th>Descripción</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(record, index) in clinicHistory.records" :key="'diagpet' + index">
                                      <td nowrap>{{ record.description }}</td>
                                      <td nowrap>
                                        <button class="btn btn-danger btn-sm" @click="deleteRegistry(clinicHistory.records, index)">
                                          <i class="fa fa-fw fa-lg fa fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          <!--Fin antecedentes-->
                        </div>

                        

                        <!--Diagnósticos-->
                        <div v-if="consultation_purposesSelected.diagnoses" 
                            :class="{'tab-pane': true, 
                                        fade:true, 
                                        'p-2': true,
                                        active: consultation_purposesSelected.diagnoses && !consultation_purposesSelected.records,
                                        show: consultation_purposesSelected.diagnoses && !consultation_purposesSelected.records
                                      }" id="diagnosis">
                          <div class="row">
                            <div class="col-md-4">
                              <div class="form-group">
                                <label for="">Diagnóstico (*)</label>
                                <v-select :options="diagnoses" label="name" v-model="diagnosisSelected"></v-select>
                              </div>
                            </div>
                            <div class="col-md-4">
                              <div class="form-group">
                                <label for="">Tipo (*)</label>
                                <select class="form-control" v-model="diagnosisType">
                                  <option value="">Seleccione tipo</option>
                                  <option value="Presuntivo">Presuntivo</option>
                                  <option value="Definitivo">Definitivo</option>
                                </select>
                              </div>
                            </div>
                            <div class="col-md-12">
                              <div class="form-group">
                                <label for=""></label>
                                <button class="btn btn-primary" @click="addDiagnosisToClinicHistory">
                                  <i class="fa fa-plus"></i> Agregar
                                </button>
                              </div>
                            </div>
                            </div>
                            <div class="row">
                              <div class="col-md-12">
                                <div class="table-responsive">
                                  <table class="table table-hover table-sm">
                                    <thead>
                                      <tr>
                                        <th>Nombre</th>
                                        <th>Tipo</th>
                                        <th></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr v-for="(diagnosis, index) in clinicHistory.diagnoses" :key="'diagpet' + index">
                                        <td nowrap>{{ diagnosis.name }}</td>
                                        <td nowrap>{{ diagnosis.type }}</td>
                                        <td nowrap>
                                          <button class="btn btn-danger btn-sm" @click="deleteRegistry(clinicHistory.diagnoses, index)">
                                            <i class="fa fa-fw fa-lg fa fa-trash"></i>
                                          </button>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                        </div>
                        <!--Fin diagnósticos-->

                        <!--Vacunación-->
                        <div v-if="consultation_purposesSelected.vaccines" 
                            :class="{'tab-pane': true, 
                                        fade:true, 
                                        'p-2': true,
                                        active: consultation_purposesSelected.vaccines && !consultation_purposesSelected.diagnoses && !consultation_purposesSelected.records,
                                        show: consultation_purposesSelected.vaccines && !consultation_purposesSelected.diagnoses && !consultation_purposesSelected.records
                                      }" id="vaccine">
                          <div class="row">
                            <div class="col-md-4">
                              <div class="form-group">
                                <label for="">Vacuna (*)</label>
                                <v-select :options="vaccines" label="name" v-model="vaccineSelected"></v-select>
                              </div>
                            </div>
                            <div class="col-md-4">
                              <div class="form-group">
                                <label for="">Próxima vacuna (*)</label>
                                <input type="date" class="form-control" v-model="nextVaccineDate">
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-12">
                              <div class="form-group">
                                <label for=""></label>
                                <button class="btn btn-primary" @click="addVaccineToClinicHistory">
                                  <i class="fa fa-plus"></i> Agregar
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-12">
                              <div class="table-responsive">
                                <table class="table table-hover table-sm">
                                  <thead>
                                    <tr>
                                      <th>Nombre</th>
                                      <th nowrap>Proxima vacuna</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(vaccine, index) in clinicHistory.vaccines" :key="'vacpet' + index">
                                      <td nowrap>{{ vaccine.name }}</td>
                                      <td nowrap>{{ vaccine.next_date }}</td>
                                      <td nowrap>
                                        <button class="btn btn-danger btn-sm" @click="deleteRegistry(clinicHistory.vaccines, index)">
                                          <i class="fa fa-fw fa-lg fa fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!--Fin vacunación-->

                        <!--Desparasitaciones-->
                        <div v-if="consultation_purposesSelected.dewormings" 
                            :class="{'tab-pane': true, 
                                        fade:true, 
                                        'p-2': true,
                                        active: consultation_purposesSelected.dewormings && !consultation_purposesSelected.vaccines && !consultation_purposesSelected.diagnoses && !consultation_purposesSelected.records,
                                        show: consultation_purposesSelected.dewormings && !consultation_purposesSelected.vaccines && !consultation_purposesSelected.diagnoses && !consultation_purposesSelected.records
                                      }" id="deworming">
                            <div class="row">
                            <div class="col-md-4">
                              <div class="form-group">
                                <label for="">Producto (*)</label>
                                <v-select :options="dewormings" label="name" v-model="dewormingSelected"></v-select>
                              </div>
                            </div>
                            <div class="col-md-2">
                              <div class="form-group">
                                <label for="">Dosis (*)</label>
                                <input type="number" class="form-control" v-model="doseDeworming">
                              </div>
                            </div>
                            <div class="col-md-2">
                              <div class="form-group">
                                <label for="">Unidad (*)</label>
                                <select v-model="unityDoseDeworming" class="form-control">
                                  <option value="">Seleccione unidad</option>
                                  <option :value="unity" v-for="unity in unities" :key="'unity' + unity.id">
                                    {{ unity.description }}
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div class="col-md-4">
                              <div class="form-group">
                                <label for="">Próxima desparasitación (*)</label>
                                <input type="date" class="form-control" v-model="nextDewormingDate">
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-12">
                              <div class="form-group">
                                <label for=""></label>
                                <button class="btn btn-primary" @click="addDewormingToClinicHistory">
                                  <i class="fa fa-plus"></i> Agregar
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-12">
                              <div class="table-responsive">
                                <table class="table table-hover table-sm">
                                  <thead>
                                    <tr>
                                      <th>Nombre</th>
                                      <th>Dosis</th>
                                      <th>Unidad</th>
                                      <th nowrap>Proxima desparasitación</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(deworming, index) in clinicHistory.dewormings" :key="'dewor' + index">
                                      <td nowrap>{{ deworming.name }}</td>
                                      <td nowrap>{{ deworming.dose }}</td>
                                      <td nowrap>{{ deworming.unity_description }}</td>
                                      <td nowrap>{{ deworming.next_date }}</td>
                                      <td nowrap>
                                        <button class="btn btn-danger btn-sm" @click="deleteRegistry(clinicHistory.dewormings, index)">
                                          <i class="fa fa-fw fa-lg fa fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                          <!--Fin Desparasitaciones-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            <!--Fin tab de opciones-->
            <!--Productos y servicios aplicados-->
            <div class="row" v-if="consultation_purposesSelected.products_and_services_applied">
            <div class="col-md-12">
              <div class="tile">
                <h3 class="tile-title">Productos y servicios aplicados</h3>
                <div class="row">
                  <div class="col-lg-12">
                    <div class="bs-component">
                      <ul class="nav nav-tabs">
                        <li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#products">Productos</a></li>
                        <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#services">Servicios</a></li>
                      </ul>
                      <div class="tab-content" id="myTabContent">
                        <!--Productos-->
                        <div class="tab-pane fade active p-2 show" id="products">
                          <div class="row">
                            <div class="col-md-4">
                              <div class="form-group">
                                <label for="">Producto (*)</label>
                                <v-select :options="products" label="name" v-model="productSelected"></v-select>
                              </div>
                            </div>
                            <div class="col-md-2">
                              <div class="form-group">
                                <label for="">Cantidad (*)</label>
                                <input type="number" class="form-control" v-model="quantityProductApplied">
                              </div>
                            </div>
                            <div class="col-md-2">
                              <div class="form-group">
                                <label for="">Unidad (*)</label>
                                <select v-model="unityQuantityProductApplied" class="form-control">
                                  <option value="">Seleccione unidad</option>
                                  <option :value="unity" v-for="unity in unities" :key="'unity' + unity.id">
                                    {{ unity.description }}
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div class="col-md-4">
                              <div class="form-group">
                                <label for="">Observaciónes</label>
                                <input type="text" class="form-control" v-model="observationsProductApplied" maxlength="100">
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-12">
                              <div class="form-group">
                                <label for=""></label>
                                <button class="btn btn-primary" @click="addProductAppliedToClinicHistory">
                                  <i class="fa fa-plus"></i> Agregar
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-12">
                              <div class="table-responsive">
                                <table class="table table-hover table-sm">
                                  <thead>
                                    <tr>
                                      <th>Producto</th>
                                      <th nowrap>Cantidad aplicada</th>
                                      <th nowrap>Unidad</th>
                                      <th>Observaciónes</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(product, index) in clinicHistory.products" :key="'prodpet' + index">
                                      <td nowrap>{{ product.name }}</td>
                                      <td nowrap>{{ product.quantity }}</td>
                                      <td nowrap>{{ product.unity.description }}</td>
                                      <td nowrap>{{ product.observations }}</td>
                                      <td nowrap>
                                        <button class="btn btn-danger btn-sm" @click="deleteRegistry(clinicHistory.products, index)">
                                          <i class="fa fa-fw fa-lg fa fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!--Servicios-->
                        <div class="tab-pane fade" id="services">
                          <div class="tab-pane fade active p-2 show" id="products">
                          <div class="row">
                            <div class="col-md-4">
                              <div class="form-group">
                                <label for="">Servicio (*)</label>
                                <v-select :options="services" label="name" v-model="serviceSelected"></v-select>
                              </div>
                            </div>
                            <div class="col-md-2">
                              <div class="form-group">
                                <label for="">Cantidad (*)</label>
                                <input type="number" class="form-control" v-model="quantityServiceApplied">
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="form-group">
                                <label for="">Observaciónes</label>
                                <input type="text" class="form-control" v-model="observationsServiceApplied" maxlength="1500">
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-12">
                              <div class="form-group">
                                <label for=""></label>
                                <button class="btn btn-primary" @click="addServiceAppliedToClinicHistory">
                                  <i class="fa fa-plus"></i> Agregar
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-12">
                              <div class="table-responsive">
                                <table class="table table-hover table-sm">
                                  <thead>
                                    <tr>
                                      <th>Servicio</th>
                                      <th>Cantidad</th>
                                      <th>Observaciónes</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(service, index) in clinicHistory.services" :key="'prodpet' + index">
                                      <td nowrap>{{ service.name }}</td>
                                      <td nowrap>{{ service.quantity }}</td>
                                      <td nowrap>{{ service.observations }}</td>
                                      <td nowrap>
                                        <button class="btn btn-danger btn-sm" @click="deleteRegistry(clinicHistory.services, index)">
                                          <i class="fa fa-fw fa-lg fa fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div class="row" v-if="consultation_purposesSelected.attachments">
              <div class="col-md-12">
                <div class="tile">
                  <h3 class="tile-title">Archivos adjuntos</h3>
                    <form @submit.prevent="addAttachmentToClinicHistory" class="row mb-3">
                      <div class="col-md-4">
                        <div class="form-group">
                          <label for="">Tipo de archivo</label>
                          <select class="form-control" v-model="attachment.attachment_type">
                            <option :value="{}">Seleccione tipo de archivo</option>
                            <option :value="attachmentType" 
                              v-for="attachmentType in attachmentTypes" :key="`attachmentType-${ attachmentType.id }`">
                              {{ attachmentType.name }}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group">
                          <label for="">Archivo</label>
                          <input id="attachmentButton" type="file" class="form-control" @change="setFileInAttachment">
                        </div>
                      </div>
                      <div class="col-md-12">
                        <button class="btn btn-primary" type="submit">
                          <i class="fa fa-plus"></i> Agregar
                        </button>
                      </div>
                    </form>
                  <div class="row">
                      <div class="col-md-12">
                        <div class="table-responsive">
                          <table class="table table-hover table-sm">
                            <thead>
                              <tr>
                                <th>Tipo de archivo</th>
                                <th>Archivo</th>
                                <th>Tamaño</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(attachment, index) in clinicHistory.attachments" :key="'attachments-' + index">
                                <td nowrap>{{ attachment.attachment_type.name }}</td>
                                <td nowrap>{{ attachment.fileName }}</td>
                                <td nowrap>{{ Math.floor(attachment.fileSize / 1024) }} KB</td>
                                <td nowrap>
                                  <button class="btn btn-danger btn-sm" @click="deleteAttachmentFromClinicHistory(index)">
                                    <i class="fa fa-fw fa-lg fa fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            <div class="row" v-if="consultation_purposesSelected.prescription">
              <div class="col-md-12">
                <div class="tile">
                  <h3 class="tile-title">Receta veterinaria</h3>
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label for="">Producto (*)</label>
                        <v-select :options="products" label="name" v-model="productToAddToPrescription.product"></v-select>
                      </div>
                      <div class="form-group">
                        <label for="">Cantidad (*)</label>
                        <input type="number" class="form-control" v-model="productToAddToPrescription.quantity">
                      </div>
                      <div class="form-group">
                        <label for="">Posología (*)</label>
                        <textarea rows="4" class="form-control" v-model="productToAddToPrescription.posology" maxlength="500"></textarea>
                      </div>
                      <div class="form-group">
                        <button class="btn btn-primary" @click="addProductToPrescription"><i class="fa fa-plus"></i> Agregar</button>
                      </div>
                    </div>
                    <div class="col-md-8">
                      <div class="table-responsive" style="min-height:300px;max-height:300px;overflow:auto">
                        <table class="table table-hover table-sm">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Posología</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(product, index) in clinicHistory.prescription.products" :key="'productsFromPrescription-' + index">
                              <td>{{ product.product_name }}</td>
                              <td nowrap>{{ product.quantity }}</td>
                              <td>{{ product.posology }}</td>
                              
                              <td nowrap>
                                <button class="btn btn-danger btn-sm" @click="deleteProductFromPrescription(index)">
                                  <i class="fa fa-fw fa-lg fa fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group">
                        <label for="">Observaciónes</label>
                        <textarea rows="4" :class="{ 
                                                      'form-control': true, 
                                                      'is-invalid': errors && errors['observations_from_prescription']
                                                      }" v-model="observationsFromPrescription" maxlength="800"></textarea>
                        <span v-if="errors && errors['observations_from_prescription']" class="text-danger">
                          {{ errors['observations_from_prescription'][0] }}
                        </span>                                                      
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" v-if="consultation_purposesSelected.indications">
              <div class="col-md-12">
                <div class="tile">
                    <div class="form-group">
                      <label for="">Indicaciones (*)</label>
                      <textarea rows="3" maxlength="800" :class="{ 
                                                      'form-control': true, 
                                                      'is-invalid': errors && errors['indications']
                                                      }" v-model="clinicHistory.indications"></textarea>
                      <span v-if="errors && errors['indications']" class="text-danger">
                        {{ errors['indications'][0] }}
                      </span>
                    </div>
                </div>
              </div>
            </div>
            <!--Fin Productos y servicios aplicados-->
            <!--Grabar folio-->
            <div class="row">
            <div class="col-md-12">
              <div class="tile">
                <!--<h3 class="tile-title">Productos y servicios aplicados</h3>-->
                <div class="row">
                  <div class="col-lg-12">
                    <button :disabled="saving" class="btn btn-primary float-right" @click="preSaveClinicHistory">
                      <i class="fa fa-fw fa-lg fa fa-save"></i>Grabar folio <span v-if="saving" class="spinner-border spinner-border-sm ml-1"></span>
                      </button>
                  </div>
                </div>
              </div>
            </div>
            </div>
            <!--Fin Grabar folio-->
          </div>
        </div>
        <vue-loading v-if="loadingResults" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
        <!--inicio modal antes de guardar folio-->
        <div class="modal fade" id="beforeSaveModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Resumen</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                  <p>Hay información opcional del tipo de finalidad de consulta que no se ha diligenciado, ¿desea continuar?</p>

                  <p v-if="this.consultation_purposesSelected.records && this.clinicHistory.records.length == 0">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i> Antecedentes
                  </p>
                  <p v-if="this.consultation_purposesSelected.diagnoses && this.clinicHistory.diagnoses.length == 0">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i> Diagnósticos
                  </p>
                  <p v-if="this.consultation_purposesSelected.vaccines && this.clinicHistory.vaccines.length == 0">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i> Vacunas
                  </p>
                  <p v-if="this.consultation_purposesSelected.dewormings && this.clinicHistory.dewormings.length == 0">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i> Desparasitaciones
                  </p>
                  <p v-if="this.consultation_purposesSelected.products_and_services_applied && this.clinicHistory.products.length == 0">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i> Productos aplicados
                  </p>
                  <p v-if="this.consultation_purposesSelected.products_and_services_applied && this.clinicHistory.services.length == 0">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i> Servicios aplicados
                  </p>
                  <p v-if="this.consultation_purposesSelected.attachments && this.clinicHistory.attachments.length == 0">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i> Archivos adjuntos
                  </p>
                  <p v-if="this.consultation_purposesSelected.prescription && this.clinicHistory.prescription.products.length == 0 && !this.observationsFromPrescription">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i> Receta veterinaria
                  </p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="saveClinicHistory()" :disabled="saving">
                  <i class="fa fa-save"></i> Grabar el folio de todas formas <span v-if="saving" class="spinner-border spinner-border-sm ml-1"></span>
                </button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
        <!--Fin modal antes de guardar folio-->
        <!--inicio modal imprimir folio-->
        <div class="modal fade" id="questionPrintFolioCreated" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Abrir folio</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                  ¿Desea abrir el folio generado?
              </div>
              <div class="modal-footer">
                <button :disabled="printingFolio" type="button" class="btn btn-primary" @click="printFolioCreated">
                  <i class="fa fa-fw fa-lg fa fa-check"></i>
                  Aceptar
                  <span v-if="printingFolio" class="spinner-border spinner-border-sm ml-1"></span>
                </button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
        <!--Fin modal imprimir folio-->
    </div>
</template>

<script>
    import SearchOwnersAndPets from './../_components/SearchOwnersAndPets'
    import { VueLoading } from 'vue-loading-template'
    import moment from 'moment'
    import AnimateScroll from 'js-animate-scroll'
    moment.locale('es')
    export default {
        name: 'clinic_history.create',
        components: {
          VueLoading, SearchOwnersAndPets
        },
        created () {
          this.getConsultationPurposes()
        },
        data() {
            return {
                loadingResults: false,
                clinicHistory: {
                  appointment_id: '',
                  pet_id: '',
                  consultation_purposes_id: '',
                  reason_consultation: '',
                  indications: '',
                  symptoms: '',
                  anamnesis: '',
                  records: [],
                  physiologicalConstants: {
                    weight: null,
                    temperature: null,
                    heart_rate: null,
                    breathing_frequency: null
                  },
                  diagnoses: [],
                  vaccines: [],
                  dewormings: [],
                  products: [],
                  services: [],
                  attachments:[],
                  prescription: {
                    products: [],
                    observations: ''
                  },
                  reviewBySystems: {
                    respiratorySystem: {
                      state: '',
                      observations: '',
                    },
                    tegumentarySystem: {
                      state: '',
                      observations: '',
                    },
                    nervousSystem: {
                      state: '',
                      observations: '',
                    },
                    genitourinarySystem: {
                      state: '',
                      observations: '',
                    },
                    lymphNodes: {
                      state: '',
                      observations: '',
                    },
                    musculoskeletalSystem: {
                      state: '',
                      observations: '',
                    },
                    reproductiveSystem: {
                      state: '',
                      observations: '',
                    },
                    digestiveSystem: {
                      state: '',
                      observations: '',
                    },
                    oralCavity: {
                      state: '',
                      observations: '',
                    },
                  },
                },
                consultation_purposesSelected: {
                  id: null,
                  symptoms: '',
                  anamnesis: '',
                  records: '',
                  physiological_constants: '',
                  diagnoses: '',
                  vaccines: '',
                  dewormings: '',
                  products_and_services_applied: '',
                  attachments: '',
                  indications: '',
                },
                attachment: {
                  attachment_type: {},
                  file: '',
                  fileName: '',
                  fileSize: '',
                },
                owners: [],
                consultationPurposes: [],
                attachmentTypes: [],
                petsFromOwner: '',
                ownerSelected: '',
                record: null,
                diagnosisSelected: null,
                diagnosisType: '',
                vaccineSelected: null,
                nextVaccineDate: null,
                productSelected: null,
                quantityProductApplied: null,
                unityQuantityProductApplied: '',
                observationsProductApplied: '',
                serviceSelected: null,
                quantityServiceApplied: null,
                observationsServiceApplied: '',
                dewormingSelected: null,
                nextDewormingDate: null,
                doseDeworming: null,
                unityDoseDeworming: '',
                diagnoses: [],
                vaccines: [],
                products: [],
                services: [],
                dewormings: [],
                unities: [],
                errors: null,
                folioOpen: false,
                lookingPet: false,
                avatarPet: require('../../../assets/avatar_pet.jpg'),
                infoFromPetAndOwner: {
                  id: '', 
                  name: '', 
                  photo: '', 
                  owner_id: '', 
                  species_id: '', 
                  race_id: '',
                  date_born: '', 
                  sex: '', 
                  color: '', 
                  size: '', 
                  observation: '',
                  owner: {
                    id: '',
                    identification: '',
                    names: '',
                    surnames: '',
                    address: '',
                    phonenumber: '',
                    email: ''
                  },
                  species: {
                    id: '',
                    name: ''
                  },
                  race: {
                    id: '',
                    name: ''
                  }
                },
                diagnosesFromPet: [],
                recordsFromPet: [],
                productToAddToPrescription: {
                  product: {},
                  quantity: '',
                  posology: ''
                },
                observationsFromPrescription: '',
                buttonThatOpenFolio: true,
                pet_id_to_print_folio: '',
                printingFolio: false,
                appointmentsPendingFromPet: [],
                saving: false,
                options: {
                  duration: 200,
                  easing: 'easeInOutQuint',
                  padding: 80,
                  align: 'top',
                  onFinish: function () {}
                }
            }
        },
        methods: {
          preSaveClinicHistory () {
          
            if (
                (this.consultation_purposesSelected.records && this.clinicHistory.records.length == 0 ) || 
                (this.consultation_purposesSelected.diagnoses && this.clinicHistory.diagnoses.length == 0 ) || 
                (this.consultation_purposesSelected.vaccines && this.clinicHistory.vaccines.length == 0 ) || 
                (this.consultation_purposesSelected.dewormings && this.clinicHistory.dewormings.length == 0 ) || 
                (this.consultation_purposesSelected.products_and_services_applied && 
                  (this.clinicHistory.products.length == 0 ||  this.clinicHistory.services.length  == 0)
                ) ||
                (this.consultation_purposesSelected.attachments && this.clinicHistory.attachments.length == 0 ) || 
                (this.consultation_purposesSelected.prescription && this.clinicHistory.prescription.products.length == 0 && !this.observationsFromPrescription)
                ) {

                  return $('#beforeSaveModal').modal('show')
            }

            this.saveClinicHistory()
            
          },
          saveClinicHistory () {
            this.saving = true

            let data = new FormData

            data.append('appointment_id', this.clinicHistory.appointment_id)
            data.append('pet_id', this.clinicHistory.pet_id)
            data.append('consultation_purposes_id', this.clinicHistory.consultation_purposes_id)
            data.append('reason_consultation', this.clinicHistory.reason_consultation)
            data.append('indications', this.clinicHistory.indications)
            data.append('symptoms', this.clinicHistory.symptoms)
            data.append('anamnesis', this.clinicHistory.anamnesis)
            
            this.clinicHistory.records.forEach((record, index) => {
              data.append(`records[${index}][description]`, record.description)
            })

            data.append('physiologicalConstants[weight]', this.clinicHistory.physiologicalConstants.weight ? this.clinicHistory.physiologicalConstants.weight : '') 
            data.append('physiologicalConstants[temperature]', this.clinicHistory.physiologicalConstants.temperature ? this.clinicHistory.physiologicalConstants.temperature : '') 
            data.append('physiologicalConstants[heart_rate]', this.clinicHistory.physiologicalConstants.heart_rate ? this.clinicHistory.physiologicalConstants.heart_rate : '') 
            data.append('physiologicalConstants[breathing_frequency]', this.clinicHistory.physiologicalConstants.breathing_frequency ? this.clinicHistory.physiologicalConstants.breathing_frequency : '') 

            data.append('reviewBySystems[respiratorySystem][state]', this.clinicHistory.reviewBySystems.respiratorySystem.state ? this.clinicHistory.reviewBySystems.respiratorySystem.state : '')
            data.append('reviewBySystems[respiratorySystem][observations]', this.clinicHistory.reviewBySystems.respiratorySystem.observations ? this.clinicHistory.reviewBySystems.respiratorySystem.observations : '')

            data.append('reviewBySystems[tegumentarySystem][state]', this.clinicHistory.reviewBySystems.tegumentarySystem.state ? this.clinicHistory.reviewBySystems.tegumentarySystem.state : '')
            data.append('reviewBySystems[tegumentarySystem][observations]', this.clinicHistory.reviewBySystems.tegumentarySystem.observations ? this.clinicHistory.reviewBySystems.tegumentarySystem.observations : '')
            
            data.append('reviewBySystems[nervousSystem][state]', this.clinicHistory.reviewBySystems.nervousSystem.state ? this.clinicHistory.reviewBySystems.nervousSystem.state : '')
            data.append('reviewBySystems[nervousSystem][observations]', this.clinicHistory.reviewBySystems.nervousSystem.observations ? this.clinicHistory.reviewBySystems.nervousSystem.observations : '')
            
            data.append('reviewBySystems[genitourinarySystem][state]', this.clinicHistory.reviewBySystems.genitourinarySystem.state ? this.clinicHistory.reviewBySystems.genitourinarySystem.state : '')
            data.append('reviewBySystems[genitourinarySystem][observations]', this.clinicHistory.reviewBySystems.genitourinarySystem.observations ? this.clinicHistory.reviewBySystems.genitourinarySystem.observations : '')
            
            data.append('reviewBySystems[lymphNodes][state]', this.clinicHistory.reviewBySystems.lymphNodes.state ? this.clinicHistory.reviewBySystems.lymphNodes.state : '')
            data.append('reviewBySystems[lymphNodes][observations]', this.clinicHistory.reviewBySystems.lymphNodes.observations ? this.clinicHistory.reviewBySystems.lymphNodes.observations : '')
            
            data.append('reviewBySystems[musculoskeletalSystem][state]', this.clinicHistory.reviewBySystems.musculoskeletalSystem.state ? this.clinicHistory.reviewBySystems.musculoskeletalSystem.state : '')
            data.append('reviewBySystems[musculoskeletalSystem][observations]', this.clinicHistory.reviewBySystems.musculoskeletalSystem.observations ? this.clinicHistory.reviewBySystems.musculoskeletalSystem.observations : '')
            
            data.append('reviewBySystems[reproductiveSystem][state]', this.clinicHistory.reviewBySystems.reproductiveSystem.state ? this.clinicHistory.reviewBySystems.reproductiveSystem.state : '')
            data.append('reviewBySystems[reproductiveSystem][observations]', this.clinicHistory.reviewBySystems.reproductiveSystem.observations ? this.clinicHistory.reviewBySystems.reproductiveSystem.observations : '')
            
            data.append('reviewBySystems[digestiveSystem][state]', this.clinicHistory.reviewBySystems.digestiveSystem.state ? this.clinicHistory.reviewBySystems.digestiveSystem.state : '')
            data.append('reviewBySystems[digestiveSystem][observations]', this.clinicHistory.reviewBySystems.digestiveSystem.observations ? this.clinicHistory.reviewBySystems.digestiveSystem.observations : '')
            
            data.append('reviewBySystems[oralCavity][state]', this.clinicHistory.reviewBySystems.oralCavity.state ? this.clinicHistory.reviewBySystems.oralCavity.state : '')
            data.append('reviewBySystems[oralCavity][observations]', this.clinicHistory.reviewBySystems.oralCavity.observations ? this.clinicHistory.reviewBySystems.oralCavity.observations : '')



            this.clinicHistory.diagnoses.forEach((diagnosis, index) => {
              data.append(`diagnoses[${index}][diagnosis_id]`, diagnosis.diagnosis_id)
              data.append(`diagnoses[${index}][type]`, diagnosis.type)
            })

            this.clinicHistory.vaccines.forEach((vaccine, index) => {
              data.append(`vaccines[${index}][product_id]`, vaccine.product_id)
              data.append(`vaccines[${index}][next_date]`, vaccine.next_date)
            })

            this.clinicHistory.dewormings.forEach((deworming, index) => {
              data.append(`dewormings[${index}][product_id]`, deworming.product_id)
              data.append(`dewormings[${index}][dose]`, deworming.dose)
              data.append(`dewormings[${index}][next_date]`, deworming.next_date)
              data.append(`dewormings[${index}][unity_id]`, deworming.unity_id)
            })

            this.clinicHistory.products.forEach((product, index) => {
              data.append(`products[${index}][product_id]`, product.product_id)
              data.append(`products[${index}][quantity]`, product.quantity)
              data.append(`products[${index}][unity_id]`, product.unity.id)
              data.append(`products[${index}][observations]`, product.observations ? product.observations : '')
            })

            this.clinicHistory.services.forEach((service, index) => {
              data.append(`services[${index}][service_id]`, service.service_id)
              data.append(`services[${index}][quantity]`, service.quantity)
              data.append(`services[${index}][observations]`, service.observations ? service.observations : '')
            })

            this.clinicHistory.attachments.forEach((attachment, index) => {
              data.append(`attachments[${index}][attachment_type_id]`, attachment.attachment_type.id)
              data.append(`attachments[${index}][file]`, attachment.file, 'orueu')
            })

            this.clinicHistory.prescription.products.forEach((productFromPrescription, index) => {
              data.append(`products_from_prescription[${index}][product_id]`, productFromPrescription.product_id)
              data.append(`products_from_prescription[${index}][quantity]`, productFromPrescription.quantity)
              data.append(`products_from_prescription[${index}][posology]`, productFromPrescription.posology ? productFromPrescription.posology : '')
            })

            data.append('observations_from_prescription', this.observationsFromPrescription ? this.observationsFromPrescription : '')

            this.$http.post('clinic-histories', data).then( response => {
              this.saving = false
              //return console.log(response.data);
              this.pet_id_to_print_folio = this.clinicHistory.pet_id
              this.cleanAllData()
              $('#beforeSaveModal').modal('hide')
              $('#questionPrintFolioCreated').modal('show')
              this.$toastr.success('Folio grabado exitosamente')
              this.getConsultationPurposes()
            }).catch( error => {
              $('#beforeSaveModal').modal('hide')
              this.saving = false
              if (error.response.status == 422) {
                this.errors = error.response.data.errors
                this.$toastr.error('Verifique los errores de validación')
                new AnimateScroll('#errors', this.options);
              }
              
              if (error.response.status == 402) {
                this.$toastr.error('El usuario no está registrado como veterinario')
              }
            })
          },
          printFolioCreated () {
            this.printingFolio = true
            this.$http.get(`reports/clinic-history/${ this.pet_id_to_print_folio }`, { params: { folios: ['latest'] }, responseType: 'blob' }).then( response => {
              let urlPdf = URL.createObjectURL(response.data)
              window.open(urlPdf, '_blank')
              $('#questionPrintFolioCreated').modal('hide')
              this.printingFolio = false
            }).catch(() => {
              this.printingFolio = false
            })
          },
          getConsultationPurposes () {
            this.$http.get('clinic-histories/get-consultation-purposes-and-attachment-types').then( response => {
              this.consultationPurposes = response.data.consultationPurposes
              this.attachmentTypes = response.data.attachmentTypes
            })
          },
          getPetsFromOwner (owner) {
            this.lookingPet = true
            this.$http.get(`clinic-histories/${ owner }/get-pet-from-owner`).then( response => {
              this.lookingPet = false
              this.petsFromOwner = response.data
            }).catch( err => {
              this.lookingPet = false
            })
          },
          openFolio () {
            this.loadingResults = true
            this.getDataForCreateFolio()
            this.buttonThatOpenFolio = false
          },
          undoFolio () {
            this.getConsultationPurposes()
            this.cleanAllData()
            this.folioOpen = false
            this.buttonThatOpenFolio = true
          },
          getDataForCreateFolio () {
            this.$http.get(`clinic-histories/get-data-for-create-folio/${ this.clinicHistory.pet_id }`).then( response => {
              //Datos del paciente
              this.infoFromPetAndOwner = response.data.infoFromPetAndOwner
              this.diagnosesFromPet = response.data.diagnosesFromPet
              this.recordsFromPet = response.data.recordsFromPet

              //Datos para diligenciar la historia clínica
              this.diagnoses = response.data.diagnoses
              this.vaccines = response.data.vaccines
              this.products = response.data.products
              this.services = response.data.services
              this.dewormings = response.data.dewormings
              this.unities = response.data.unities
              this.folioOpen = true
              this.loadingResults = false
            }).catch( error => {
              this.loadingResults = false
              if (error.response.status == 402) {
                this.$toastr.error('El usuario no está registrado como veterinario')
              }
            })
          },
          addDiagnosisToClinicHistory () {
            if (!this.diagnosisSelected) {
              return this.$toastr.error('Seleccione un diagnóstico')
            }

            if (!this.diagnosisType) {
              return this.$toastr.error('Seleccione el tipo de diagnóstico')
            }

            let data = {
              diagnosis_id: this.diagnosisSelected.id,
              name: this.diagnosisSelected.name,
              type: this.diagnosisType
            }

            this.clinicHistory.diagnoses.push(data)
            this.diagnosisSelected = null
            this.diagnosisType = ''
          },
          addVaccineToClinicHistory () {
            if (!this.vaccineSelected || !this.nextVaccineDate) {
              return this.$toastr.error('Diligencie los datos de la vacuna')
            }
          
            let dateVaccineIsBeforeOfNow = moment(this.nextVaccineDate).isSameOrAfter(Date.now(), 'day')

            if (!dateVaccineIsBeforeOfNow) {
              return this.$toastr.error('La fecha de la próxima vacuna debe ser posterior o igual a la fecha actual')
            }

            let data = {
              product_id: this.vaccineSelected.id,
              name: this.vaccineSelected.name,
              next_date: this.nextVaccineDate
            }
            this.clinicHistory.vaccines.push(data)
            this.vaccineSelected = null
            this.nextVaccineDate = null
          },
          addProductAppliedToClinicHistory () {
            if (!this.productSelected || !this.quantityProductApplied) {
              return this.$toastr.error('Diligencie los datos del producto')
            }

            if (this.quantityProductApplied <= 0 || this.quantityProductApplied > 1000) {
              return this.$toastr.error('La cantidad debe ser estar entre 0.0001 y 1000')
            }

            if (!this.unityQuantityProductApplied) {
              return this.$toastr.error('Seleccione la unidad')
            }

            let data = {
              product_id: this.productSelected.id,
              name: this.productSelected.name,
              quantity: this.quantityProductApplied,
              unity: this.unityQuantityProductApplied,
              observations: this.observationsProductApplied
            }

            this.clinicHistory.products.push(data)
            this.productSelected = null
            this.quantityProductApplied = null
            this.unityQuantityProductApplied = ''
            this.observationsProductApplied = null
          },
          addServiceAppliedToClinicHistory () {
            if (!this.serviceSelected || !this.quantityServiceApplied) {
              return this.$toastr.error('Diligencie los datos del servicio')
            }

            if (this.quantityServiceApplied <= 0 || this.quantityServiceApplied > 1000) {
              return this.$toastr.error('La cantidad debe ser estar entre 1 y 1000')
            }

            let data = {
              service_id: this.serviceSelected.id,
              name: this.serviceSelected.name,
              quantity: this.quantityServiceApplied,
              observations: this.observationsServiceApplied
            }
            this.clinicHistory.services.push(data)
            this.serviceSelected = null
            this.quantityServiceApplied = null
            this.observationsServiceApplied = null
          },
          addDewormingToClinicHistory () {
            if (!this.dewormingSelected || !this.doseDeworming || !this.unityDoseDeworming || !this.nextDewormingDate) {
              return this.$toastr.error('Diligencie los datos de la desparasitación')
            }

            if (isNaN(this.doseDeworming)) {
              return this.$toastr.error('La dosis debe ser un número')
            }

            if (this.doseDeworming <= 0 || this.doseDeworming > 1000) {
              return this.$toastr.error('La dosis debe ser estar entre 0.0001 y 1000')
            }

            let dateDewormingIsBeforeOfNow = moment(this.nextDewormingDate).isSameOrAfter(Date.now(), 'day')

            if (!dateDewormingIsBeforeOfNow) {
              return this.$toastr.error('La fecha de la próxima desparasitación debe ser posterior o igual a la fecha actual')
            }

            let data = {
              product_id: this.dewormingSelected.id,
              name: this.dewormingSelected.name,
              dose: this.doseDeworming,
              unity_id: this.unityDoseDeworming.id,
              unity_description: this.unityDoseDeworming.description,
              next_date: this.nextDewormingDate
            }
            this.clinicHistory.dewormings.push(data)
            this.dewormingSelected = null
            this.doseDeworming = null
            this.nextDewormingDate = null
            this.unityDoseDeworming = ''
          },
          addRecordToClinicHistory () {
            if (!this.record) {
              return this.$toastr.error('Describa el antecedente')
            }

            let data = {
              description: this.record
            }

            this.clinicHistory.records.push(data)
            this.record = null
          },
          deleteRegistry (model, index) {
            model.splice(index, 1)
          },
          formatDate (date) {
            return moment(date).format('LL')
          },
          formatDateWithHour (date) {
            return moment(date).format('DD-MMM-Y, h:mm a')
          },
          cleanAllData () {
                this.clinicHistory = {
                  appointment_id: '',
                  pet_id: '',
                  consultation_purposes_id: '',
                  reason_consultation: '',
                  symptoms: '',
                  anamnesis: '',
                  indications: '',
                  records: [],
                  physiologicalConstants: {
                    weight: null,
                    temperature: null,
                    heart_rate: null,
                    breathing_frequency: null
                  },
                  diagnoses: [],
                  vaccines: [],
                  dewormings: [],
                  products: [],
                  services: [],
                  attachments: [],
                  prescription: {
                    products: [],
                    observations: ''
                  },
                  reviewBySystems: {
                    respiratorySystem: {
                      state: '',
                      observations: '',
                    },
                    tegumentarySystem: {
                      state: '',
                      observations: '',
                    },
                    nervousSystem: {
                      state: '',
                      observations: '',
                    },
                    genitourinarySystem: {
                      state: '',
                      observations: '',
                    },
                    lymphNodes: {
                      state: '',
                      observations: '',
                    },
                    musculoskeletalSystem: {
                      state: '',
                      observations: '',
                    },
                    reproductiveSystem: {
                      state: '',
                      observations: '',
                    },
                    digestiveSystem: {
                      state: '',
                      observations: '',
                    },
                    oralCavity: {
                      state: '',
                      observations: '',
                    },
                  },
                }
                this.consultation_purposesSelected = {
                  id: null,
                  symptoms: '',
                  anamnesis: '',
                  indications: '',
                  records: '',
                  physiological_constants: '',
                  diagnoses: '',
                  vaccines: '',
                  dewormings: '',
                  products_and_services_applied: '',
                  attachments: '',
                }
                this.owners = []
                //this.consultationPurposes = []
                this.petsFromOwner = ''
                this.ownerSelected = ''
                this.record = null
                this.diagnosisSelected = null
                this.diagnosisType = ''
                this.vaccineSelected = null
                this.nextVaccineDate = null
                this.productSelected = null
                this.quantityProductApplied = null
                this.observationsProductApplied = ''
                this.serviceSelected = null
                this.quantityServiceApplied = null
                this.observationsServiceApplied = ''
                this.dewormingSelected = null
                this.nextDewormingDate = null
                this.doseDeworming = null
                this.unityDoseDeworming = ''
                this.diagnoses = []
                this.vaccines = []
                this.products = []
                this.services = []
                this.dewormings = []
                this.unities = []
                this.errors = null
                this.folioOpen = false
                this.lookingPet = false
                this.infoFromPetAndOwner = {
                  id: '', 
                  name: '', 
                  photo: '', 
                  owner_id: '', 
                  species_id: '', 
                  race_id: '',
                  date_born: '', 
                  sex: '', 
                  color: '', 
                  size: '', 
                  observation: '',
                  owner: {
                    id: '',
                    identification: '',
                    names: '',
                    surnames: '',
                    address: '',
                    phonenumber: '',
                    email: ''
                  },
                  species: {
                    id: '',
                    name: ''
                  },
                  race: {
                    id: '',
                    name: ''
                  }
                },
                this.diagnosesFromPet = []
                this.recordsFromPet = []
                this.buttonThatOpenFolio = true
                this.appointmentsPendingFromPet = [],
                this.productToAddToPrescription = {
                  product: {},
                  quantity: '',
                  posology: ''
                },
                this.observationsFromPrescription = ''
          },
          setOwnerSelected (payload) {
            this.ownerSelected = payload
          },
          petOwnerSelected(payload) {
            this.appointmentsPendingFromPet = []
            if (payload) {
              this.loadingResults = true
              this.$http.get(`clinic-histories/${payload}/get-appointments-from-pet`).then( response => {
                this.appointmentsPendingFromPet = response.data
                this.loadingResults = false
              }).catch(() => {
                this.loadingResults = false
              })
            }
            this.clinicHistory.pet_id = payload
          },
          setStateFromLoading (payload) {
            //this.loadingResults = payload
          },
          setFileInAttachment (e) {
            if (e.target.files[0].type != 'application/pdf') {
              return this.$toastr.error('Los archivos adjuntos deben ser de tipo PDF')
            }

            let sizeFile = e.target.files[0].size / 1024
            if (sizeFile > 10000) {
              let attachmentButton = document.getElementById('attachmentButton')
              attachmentButton.value = ''
              return this.$toastr.error('El archivo no debe pesar más de 10MB')
            }
            this.attachment.file = e.target.files[0]
            this.attachment.fileName = e.target.files[0].name
            this.attachment.fileSize = e.target.files[0].size
          },
          addAttachmentToClinicHistory () {
            if (this.attachment.attachment_type.id == '' || !this.attachment.attachment_type.id) {
              return this.$toastr.error('Seleccione el tipo de archivo')
            }

            if (this.attachment.file instanceof Blob) {
                this.clinicHistory.attachments.push(this.attachment)
                this.attachment = {
                  attachment_type: {},
                  file: ''
                }
    
                let attachmentButton = document.getElementById('attachmentButton')
                attachmentButton.value = ''

            } else {
              return this.$toastr.error('Adjunte el archivo')
            }
          },
          deleteAttachmentFromClinicHistory (index) {
            this.clinicHistory.attachments.splice(index, 1)
          },
          addProductToPrescription () {
            if (!this.productToAddToPrescription.product || !Object.keys(this.productToAddToPrescription.product).length) {
              return this.$toastr.error('Seleccione el producto')
            }

            if (!this.productToAddToPrescription.quantity) {
              return this.$toastr.error('Digite la cantidad')
            }

            if (this.productToAddToPrescription.quantity < 1 || this.productToAddToPrescription.quantity > 500 ) {
              return this.$toastr.error('La cantidad debe estar en 1 y 500')
            }

            if (!this.productToAddToPrescription.posology) {
              return this.$toastr.error('Diligencie la posología')
            }

            let data = { 
                  product_id: this.productToAddToPrescription.product.id,
                  product_name: this.productToAddToPrescription.product.name,
                  quantity: this.productToAddToPrescription.quantity,
                  posology: this.productToAddToPrescription.posology,
            }

            this.clinicHistory.prescription.products.push(data)
            this.productToAddToPrescription = {
                  product: {},
                  quantity: '',
                  posology: ''
            }
          },
          deleteProductFromPrescription (index) {
            this.clinicHistory.prescription.products.splice(index, 1)
          }
        },
        watch: {
          consultation_purposesSelected (newValue, oldValue) {
            this.clinicHistory.consultation_purposes_id = newValue.id
          }
        },
    }
</script>