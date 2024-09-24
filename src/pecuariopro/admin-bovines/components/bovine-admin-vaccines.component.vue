<script>
import BovineViewVaccine from "./bovine-view-vaccine.component.vue";
import {VaccinesApiService} from "../../vaccines/services/vaccine-api.service.js";
import {useAuthenticationStore} from "../../../iam/services/authentication.store.js";


const defaultStyle = { width: '450px'};


export default {
  name: "bovine-admin-vaccines",
  components: { BovineViewVaccine},
  props:{
    visible: Boolean,
    bovineId:null
  },
  data(){
    return{
      vaccines:[],
      vaccine:{},
      isVisibleCard: false,
      isEdit: false,
      submitted: false,
      visibleForm:false
    }
  },
  created() {
    this.vaccineService= new VaccinesApiService();
    this.vaccineService.getAllByBovineId(this.bovineId).then((response) => {
      this.vaccines = response.data;
    })


  },
  methods:{
    notifySuccessfulAction(message){
      this.$toast.add({severity:"success",summary: "Success",detail: message, life: 3000});
    },
    getDialogStyle() {
      let dialogStyle = defaultStyle;
      dialogStyle = this.size === 'stand' ? {width: '1600px'}:defaultStyle;
      dialogStyle = this.size === 'l' ? { width: '900px'}:defaultStyle;
      dialogStyle = this.size === 'extra-large' ? {width: '1100px'}:defaultStyle;
      return dialogStyle;
    },
    addNewVaccine(){
      this.visibleForm=!this.visibleForm;
      this.vaccine={};
    },
    cancelAddVaccine(){
      this.visibleForm=!this.visibleForm;
      this.vaccine={};
    },
    saveVaccine(){
      const authenticationStore = useAuthenticationStore();
      this.submitted = true;
      this.visibleForm = false;
      this.vaccine.userId = authenticationStore.currentUserId;;
      this.vaccine.bovineId = this.bovineId;

      let fullDate = new Date(this.vaccine.date);
      this.vaccine.date=fullDate.toISOString().split('T')[0];

      console.log(this.vaccine);

      this.vaccineService.create(this.vaccine).then((response) => {

        this.vaccine = response.data;

        this.vaccines.push(response.data);

        this.notifySuccessfulAction("Vaccine Created");

      }) .catch((error) => {
        console.error("Error creating vaccine:", error);
      });

      this.vaccine={};
    }
  },
  watch: {
    bovineId(newVal) {
      if (newVal) {
        this.vaccineService.getAllByBovineId(newVal).then((response) => {
          this.vaccines = response.data;
        });
      }
    }
  }
}
</script>

<template>
  <pv-toast/>
  <pv-dialog v-bind:visible="visible" :modal="true" class="p-fluid" :style="getDialogStyle()">
    <pv-toolbar class="toolbar">
      <template #start>
        <p>Vaccination record</p>
      </template>
      <template #end>
        <pv-button icon="pi pi-plus" aria-label="Add" @click="addNewVaccine()"/>
      </template>
    </pv-toolbar>
    <div v-if="visibleForm" class="form-vaccine">

      <div class="form-1">

        <div class="form-row">
          <p>Name</p>
          <pv-input-text v-model="this.vaccine.name" class="form-input"></pv-input-text>
        </div>

        <div class="form-row">
          <p>Code</p>
          <pv-input-text v-model="this.vaccine.code" class="form-input"></pv-input-text>
        </div>

        <div class="form-row">
          <p>Date</p>
          <pv-calendar v-model="this.vaccine.date" showIcon iconDisplay="input" dateFormat="dd/mm/yy" class="form-input"></pv-calendar>
        </div>

        <div class="form-row">
          <p>Dose</p>
          <pv-input-number v-model="this.vaccine.dose" class="form-input"></pv-input-number>
        </div>
        <div class="form-row" >
          <p>Reason</p>
          <pv-textarea v-model="this.vaccine.reason" class="form-input area-input"></pv-textarea>
        </div>
      </div>



      <div class="container-buttons">

        <pv-button  class="btn-action" text label="Save" @click="saveVaccine"></pv-button>
        <pv-button  class="btn-action" text label="Cancel" severity="danger" @click="cancelAddVaccine"></pv-button>

      </div>
    </div>


    <div class="container-cards">


      <div v-for="vaccine in vaccines" :key="vaccine.id" class="card">
        <bovine-view-vaccine :vaccine="vaccine"></bovine-view-vaccine>
      </div>
    </div>
  </pv-dialog>
</template>

<style scoped>
.toolbar {
  margin-bottom: 13px;
  display: flex;
  justify-content: space-between;
}

.btn-action{
  width:100px;
}
.form-vaccine{
padding:10px;
}

.form-1{
  width:100%;
  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items:center;
}

.form-row{
  width:350px;
}


.container-buttons{
  width:100%;
  display:flex;
  justify-content: center;
  gap:10px;
  align-items:center;
  margin-top: 10px;
}

/*.form-vaccine {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); !* Sombras suaves *!
}

.form-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.form-input {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
}*/

.container-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .form-vaccine {
    flex-direction: row;
    flex-wrap: wrap;
  }


}
</style>