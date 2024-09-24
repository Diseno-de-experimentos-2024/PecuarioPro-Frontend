<script>
import DataManager from "../../../shared/components/data-manager.component.vue";
import BovineCreateAndEdit from "../components/bovine-create-and-edit.component.vue";
import {Bovine} from "../model/bovine.js";
import {BovinesApiService} from "../services/bovines-api.service.js";
import {Origin} from "../model/origin.entity.js";
import {BreedsApiService} from "../services/breeds-api.service.js";
import {DepartmentsApiService} from "../../../shared/services/origin/departments-api.service.js";
import {CitiesApiService} from "../../../shared/services/origin/cities-api.service.js";
import {DistrictsApiService} from "../../../shared/services/origin/districts-api.service.js";
import VaccineItemCreateAndEdit from "../../vaccines/components/vaccine-create-and-edit.component.vue";
import BovineAdminVaccines from "../components/bovine-admin-vaccines.component.vue";
// import RegisterAndUpdateBovineComponent from "../components/register-and-update-bovine.component.vue";
// import RegisterAndUpdateBovine from "../components/register-and-update-bovine.component.vue";

export default {
  name: "bovine-management",
  components: {BovineAdminVaccines, VaccineItemCreateAndEdit, BovineCreateAndEdit,DataManager},
  props:{
    batchId:null
  },
  data(){
    return{
      title:{ singular: 'Bovine', plural: 'Bovines' },
      bovines:[],
      selectedBovines:[],
      breeds:[],
      departments:[],
      cities:[],
      districts:[],
      bovine:{},
      origin:{},
      department:{},
      city:{},
      district:{},
      breed:{},

      bovineService:null,
      breedService:null,
      departmentService:null,
      cityService:null,
      districtService:null,
      isVisibleCard: false,
      isVisibleVaccine:false,
      isEdit: false,
      submitted: false,
      screenSize: window.innerWidth

    }
  },
  created(){
    this.origin=new Origin;
    this.bovineService = new BovinesApiService();
    this.breedService = new BreedsApiService();
    this.departmentService = new DepartmentsApiService();
    this.cityService = new CitiesApiService();
    this.districtService = new DistrictsApiService();
    this.bovineService.getAll().then((response) => {
      console.log(response.data);
      console.log("soy el tipo batch",typeof batchId);
      let bovines = response.data;
      console.log(bovines);
      this.bovines = bovines.filter(bovine => bovine.batchId==this.batchId);//borre el toDisplayableBovine
      console.log("mis bovines filtrados", this.bovines);
    });

    this.breedService.getAll().then((response)=>{
      this.breeds=response.data;
    })

    this.departmentService.getAll().then((response)=>{
      this.departments=response.data;
    });
    this.cityService.getAll().then((response)=>{
      this.cities=response.data;
    })
    this.districtService.getAll().then((response)=>{
      this.districts =response.data;
    })

  },
  methods:{

    notifySuccessfulAction(message){
      this.$toast.add({severity:"success",summary: "Success",detail: message, life: 3000});
    },

    findIndexById(id) {
      return this.bovines.findIndex((bovine) => bovine.id === id);
    },

    onAdminVaccineEventHandler(bovine) {
      this.bovine = bovine;
      this.isVisibleVaccine = !this.isVisibleVaccine;
    },
    closeVaccineRegistration(){
      this.isVisibleVaccine = false;
    },
    onNewItemEventHandler() {
      this.bovine = {};
      this.submitted = false;
      this.isEdit = false;
      this.isVisibleCard = true;
      this.origin = {};
      // this.department={};
      // this.city={};
      // this.district={};
      console.log(`soy el flag de crear y estoy prendiendo ${this.isVisibleCard}`)
    },
    onEditItemEventHandler(item) {
      this.bovine = item;
      this.submitted = false;
      this.isEdit = true;
      this.isVisibleCard = true;
      this.origin=this.bovine.origin;

      console.log(`soy el flag de editar y estoy prendiendo ${this.isVisibleCard}`)
      // this.createAndEditDialogIsVisible = true aqui ira la card para editar;
    },
    onDeleteItemEventHandler(item) {
      this.bovine = item;
      this.deleteBovine();
    },
    onDeleteSelectedItemsEventHandler(selectedItems) {
      this.selectedBovines = selectedItems;
      this.deleteSelectedBovines();
    },
    onCanceledEventHandler() {
      this.submitted = false;
      this.isEdit = false;
      this.isVisibleCard=false;
      console.log(`soy el flag y estoy apagandome1 ${this.isVisibleCard}`)
    },
    onSavedEventHandler(item) {
      this.submitted = true;
      if (this.bovine.name) {
        if (this.isEdit) {
          console.log("soy el update");
          this.updateBovine();
        } else {
          console.log("soy el crear");
          this.createBovine();
          console.log("Sigo del create");
        }
      }
      this.isVisibleCard = false;
      console.log(`soy el card y estoy apagandome2 ${this.isVisibleCard}`)
      this.isEdit = false;
    },

    createBovine(){
     this.bovine.origin=this.origin;
    //   this.bovine.id=0;
    //   this.bovine.bovineIdentifier="123";
     console.log(this.bovine);
     console.log("Voy a crear");

     this.breed = this.breeds.find(breed => breed.name === this.bovine.breed);
     this.department=this.departments.find(department=>department.name === this.bovine.origin.department);
     this.city=this.cities.find(city => city.name===this.bovine.origin.city);
     this.district=this.districts.find(district => district.name === this.bovine.origin.district);

     this.bovine.id=0;
     this.bovine.bovineIdentifier=0;
      this.bovine.batchId = parseInt(this.bovine.batchId);
    console.log(this.city);
      console.log(this.breed);
      console.log(this.department);
      console.log(this.district);

      let imgUrls = this.bovine.imgUrls;


      this.bovine = Bovine.fromDisplayableBovine(this.bovine,this.breed.id,this.department.id,this.city.id,this.district.id);
      console.log(this.bovine);
     this.bovineService.create(this.bovine)
          .then((response) => {
            console.log(response);
            this.bovine = response.data;
            console.log("Este es el bovino ya creado y apunto de puchear");
            console.log(this.bovine);
            this.bovines.push(this.bovine);
            console.log(this.bovines);
            this.notifySuccessfulAction("Bovine Created");
            this.isVisibleCard = false;
          })
          .catch((error) => {
            console.error("Error creating bovine:", error);
          });
    },

    updateBovine() {
     // this.bovine.origin=this.origin;
      console.log("soy bovino en actualiza",this.bovine);

      this.breed = this.breeds.find(breed => breed.name === this.bovine.breed);
      this.department=this.departments.find(department=>department.name === this.bovine.origin.department);
      this.city=this.cities.find(city => city.name===this.bovine.origin.city);
      this.district=this.districts.find(district => district.name === this.bovine.origin.district);

      this.bovine = Bovine.fromDisplayableBovine(this.bovine,this.breed.id,this.department.id,this.city.id,this.district.id);
      console.log("soy bovino en actualiza 2",this.bovine);

      this.bovineService.update(this.bovine.id, this.bovine)
          .then((response)=>{
            const originBovine = response.data.origin;
            const breedBovine = response.data.breed;
            this.bovines[this.findIndexById(response.data.id)] =
                Bovine.toDisplayableBovine(response.data,originBovine,breedBovine);
            console.log("soy bovino en actualiza 3",this.bovine);

            this.notifySuccessfulAction("Bovine Updated");
          });
    },

    deleteBovine(){
      this.bovineService.delete(this.bovine.id)
          .then(()=>{
            this.bovines=this.bovines.filter((t)=>t.id !==this.bovine.id);
            this.bovine = {};
            this.notifySuccessfulAction("Bovine Deleted");
          })
    },

    deleteSelectedBovines(){
      this.selectedBovines.forEach((bovine)=>{
        this.bovineService.delete(bovine.id).then(() =>{
          this.bovines = this.bovines.filter((t) => t.id !==this.bovine.id);
        });
      });
      this.notifySuccessfulAction("Bovines Deleted");
    }



  }
}
</script>

<template>
  <div class="w-full principal-container">
    <!-- Bovine Data Manager -->
    <div class="container-data-table">

    <data-manager
        :title=title
        v-bind:items="bovines"
        v-on:new-item="onNewItemEventHandler"
        v-on:edit-item="onEditItemEventHandler($event)"
        v-on:delete-item="onDeleteItemEventHandler($event)"
        v-on:delete-selected-items="onDeleteSelectedItemsEventHandler($event)">
      <template #custom-columns>
        <!-- Columna ID -->
        <pv-column :sortable="true" field="id" header="ID" style="min-width: 6rem" />

        <!-- Columna Nombre -->
        <pv-column :sortable="true" field="name" header="Name" style="min-width: 10rem">
        </pv-column>
        <!-- Columna Raza -->
        <pv-column :sortable="true" field="breed" header="Breed" style="min-width: 8rem" class="breed-column"/>

        <pv-column :sortable="true" field="weight" header="Weight" style="min-width: 8rem" />

        <pv-column :sortable="true" field="date" header="Date" style="min-width: 8rem"/>

        <pv-column :sortable="true" field="origin.city" header="City" style="min-width: 8rem" />



        <!-- Columna Ver Más -->
      </template>
      <template #actions="{ slotProps }">
        <pv-button icon="pi pi-pencil" text class="mr-2" @click="onEditItemEventHandler(slotProps.data)" />
<!--        <pv-button icon="pi pi-eye" text class="mr-2" @click="onViewItemEventHandler(slotProps.data)" /> &lt;!&ndash; Nuevo botón &ndash;&gt;-->
        <pv-button icon="pi pi-trash" text severity="danger" @click="onDeleteItemEventHandler(slotProps.data)" />
        <pv-button text class="mr-2"  label="Vaccines" @click="onAdminVaccineEventHandler(slotProps.data)" />

      </template>
    </data-manager>
    </div>
    <bovine-create-and-edit
      :item="bovine"
      :item2="origin"
      :edit="isEdit"
      :visible="isVisibleCard"
      v-on:canceled="onCanceledEventHandler"
      v-on:saved2="onSavedEventHandler($event)"/>

    <bovine-admin-vaccines :bovineId="bovine.id" :visible="isVisibleVaccine" v-on:close="closeVaccineRegistration"/>


  </div>
</template>

<style scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.principal-container{
  padding:20px;
}

.race-column{
display:none;
}

@media screen and (max-width: 960px) {
  :deep(.p-toolbar) {
    flex-wrap: wrap;

  }
  .race-column{
    display:table-cell;
  }

}

@media (min-width: 1024px) {
  .tutorials {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>