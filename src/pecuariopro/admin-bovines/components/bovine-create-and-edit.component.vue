<script>
import createAndEdit from "../../../shared/components/create-and-edit.component.vue";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {BreedsApiService} from "../services/breeds-api.service.js";
import {DepartmentsApiService} from "../../../shared/services/origin/departments-api.service.js";
import {CitiesApiService} from "../../../shared/services/origin/cities-api.service.js";
import {DistrictsApiService} from "../../../shared/services/origin/districts-api.service.js";
import {useAuthenticationStore} from "../../../iam/services/authentication.store.js";

export default {
  name: "bovine-create-and-edit.component",
  components: {createAndEdit },
  props: {
    item: null,
    item2:null,
    visible: Boolean,
    statuses: Array
  },
  inject: ['firebaseStorage'],
  data() {
    return {
      submitted: false,
      dialogSize: 'default',
      files: [],
      totalSize: 0,
      totalSizePercent: 0,
      breeds:null,
      selectedBreeds:null,
      departments:null,
      selectedDepartments:null,
      cities:null,
      selectedCities:null,
      districts:null,
      selectedDistricts:null,
      breedsService:null,
      departmentService:null,
      cityService:null,
      districtService:null,

      auxCities:null,
      auxDepartments:null,
      auxDistricts:null,

      allCities: null,
      allDistricts: null,
    }
  },
  created(){
    this.breedsService = new BreedsApiService();
    this.departmentService = new DepartmentsApiService();
    this.cityService = new CitiesApiService();
    this.districtService = new DistrictsApiService();
    this.breedsService.getAll().then((response)=>{
      this.breeds = response.data.map(breed => breed.name);
    });
    this.departmentService.getAll().then((response)=>{
      this.departments = response.data;
      console.log(this.departments);
      this.auxDepartments = this.departments.map(department => department.name);
      console.log(this.departments);

    });
    this.cityService.getAll().then((response) => {
      this.allCities = response.data;
      this.auxCities = this.allCities.map(city => city.name);
    });
    this.districtService.getAll().then((response) => {
      this.allDistricts = response.data;
      this.auxDistricts = this.allDistricts.map(district => district.name);
    });

    this.selectedDepartments = this.item2.department;

    console.log("breeds",this.breeds);
    console.log("bovine create and edit",this.item);
  },
  watch: {
    visible: function(newValue, oldValue) {
      if (!newValue) {
        this.resetForm();
      }
    },
    'item2.department'(newValue) {
      this.filterCities();
    },
    'item2.city'(newValue) {
      this.filterDistricts();
    }
  },
  mounted() {
    this.detectScreenSize();
    window.addEventListener('resize', this.detectScreenSize);
    console.log("bovine create and edit",this.item);


  },
  beforeDestroy() {
    window.removeEventListener('resize', this.detectScreenSize);
  },

  methods:{
    resetForm() {
      this.submitted = false;
    },

    detectScreenSize() {
      const screenWidth = window.innerWidth;
      if (screenWidth < 768) {
        this.dialogSize = 'standard';
      } else if (screenWidth >= 768 && screenWidth < 1200) {
        this.dialogSize = 'large';
      } else {
        this.dialogSize = 'extra-large';
      }
    },
    canceledEventHandler() {
      this.$emit('canceled');
    },
    async savedEventHandler() {
      console.log(this.submitted,"soy sub");
      console.log("AHO",this.item);
      this.updateItem();
      if (this.item.name && this.item.weight && this.item.breed && this.files.length<6) {
        try {
          await this.uploadFilesToFirebase();
          this.$emit('saved2', this.item);
        } catch (error) {
          console.error('Error uploading files:', error);
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload files.', life: 3000 });
        }
      }
      this.submitted = true;
    },
    updateItem() {
      if (!this.item.origin) {
        this.item.origin = {};
      }
      console.log(this.item.breed);
      let fullDate = new Date(this.item.date);
      this.item.date=fullDate.toISOString().split('T')[0];
      this.item.origin = this.item2;
      this.item.batchId = this.$route.params.batchId;

      const authenticationStore = useAuthenticationStore();
      this.item.userId = authenticationStore.currentUserId;


      console.log(this.item);
    },
    deleteExistingImage(index) {
      this.item.imgUrls.splice(index, 1);
    },
    onSelectedFiles(event) {
      this.files = event.files;
      console.log("los files",this.files);
      this.totalSize = this.files.reduce((acc, file) => acc + file.size, 0);
      this.totalSizePercent = this.totalSize / 10;
    },
    async uploadFilesToFirebase() {
      try {
        const uploadPromises = this.files.map(file => {
          const storageRef = ref(this.firebaseStorage, `PecuarioPro-bovines-resources/${file.name}`);
          return uploadBytes(storageRef, file).then(snapshot => {
            console.log(`Uploaded ${file.name}`);
            return getDownloadURL(snapshot.ref).then(url => {
              console.log(`File available at ${url}`);
              return url;
            });
          }).catch(error => {
            console.error(`Error uploading ${file.name}:`, error);
            throw error;
          });
        });

        const urls = await Promise.all(uploadPromises);

        if (this.item.imgUrls) {
          this.item.imgUrls.push(...urls);
        } else {
          this.item.imgUrls = urls;
        }


        this.$toast.add({ severity: 'info', summary: 'Success', detail: 'Files Uploaded', life: 3000 });
      } catch (error) {
        console.error('Error uploading files:', error);
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'File Upload Failed', life: 3000 });
      }
    },

    filterCities() {
      console.log(this.departments);
      console.log(this.item.date);
      if (this.item2.department) {
        this.selectedDepartments=this.item2.department;
        console.log(this.departments);
        this.selectedDepartments = this.departments.find(department => department.name === this.selectedDepartments );
        this.cities = this.allCities.filter(city => city.departmentId === this.selectedDepartments.id);
        this.auxCities = this.cities.map(city => city.name);
        console.log("toy aca en el if");
        this.selectedCities = null;
        this.districts = null;
        this.selectedDistricts = null;
      } else {
        this.cities = null;
        this.selectedCities = null;
        this.districts = null;
        this.selectedDistricts = null;
      }
    },
    filterDistricts() {
      if (this.item2.city) {
        this.selectedCities=this.item2.city;
        this.selectedCities = this.cities.find(city => city.name === this.selectedCities);
        this.districts = this.allDistricts.filter(district => district.cityId === this.selectedCities.id);
        this.auxDistricts = this.districts.map(district => district.name);
        this.selectedDistricts = null;
      } else {
        this.districts = null;
        this.selectedDistricts = null;
      }
    }



  }
}
</script>

<template>
  <create-and-edit :entity="this.item" :visible="visible" entityName="Bovine" @canceled="canceledEventHandler" @saved="savedEventHandler" :size="this.dialogSize">
    <template #content>
      <div class="p-fluid container-dialog">

        <div class="container-form">
          <div class="field mt-3 container-field">
            <label for="name">Name</label>
            <pv-float-label>
              <pv-input-text id="name" v-model="this.item.name" :class="{'p-invalid': submitted && !this.item.name}"/>
              <small v-if="submitted && !this.item.name" class="p-invalid">Name is required.</small>
            </pv-float-label>
          </div>


          <div class="field mt-3 container-field">
            <label for="date">Date</label>
            <pv-float-label>
              <pv-calendar inputId="date" v-model="this.item.date" showIcon iconDisplay="input" :class="{'p-invalid': submitted && !this.item.date}" dateFormat="dd/mm/yy"/>
              <small v-if="submitted && !this.item.date" class="p-invalid">Date is required.</small>
            </pv-float-label>
          </div>


          <div class="field mt-3 container-field">
            <label for="race">Breed</label>
            <!--            <pv-float-label>-->
            <!--              <pv-input-text id="race" v-model="this.item.breed" :class="{'p-invalid': submitted && !this.item.race}"/>-->
            <!--              <small v-if="submitted && !this.item.breed" class="p-invalid">Breed is required.</small>-->
            <!--            </pv-float-label>-->
            <pv-dropdown v-model="this.item.breed" :options="this.breeds" filter placeholder="Select a Breed" >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                  <div>{{ slotProps.value}}</div>
                </div>
                <span v-else>
            {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="flex align-items-center">
                  <div>{{ slotProps.option }}</div>
                </div>
              </template>
            </pv-dropdown>
          </div>

          <div class="field mt-3 container-field">
            <label for="weight">Weight</label>
            <pv-float-label>
              <pv-input-number id="weight" v-model="this.item.weight" :class="{'p-invalid': submitted && !this.item.weight}"/>
              <small v-if="submitted && !this.item.weight" class="p-invalid">Weight is required.</small>
            </pv-float-label>
          </div>

<!--          <div class="field mt-5 container-field">-->
<!--            <label for="department">Department</label>-->
<!--            <pv-float-label>-->
<!--              <pv-input-text id="department" v-model="this.item2.department" class="p-inputtext p-component" />-->
<!--            </pv-float-label>-->
<!--          </div>-->

          <div class="field mt-3 container-field">
            <label for="race">Department</label>
            <!--            <pv-float-label>-->
            <!--              <pv-input-text id="race" v-model="this.item.breed" :class="{'p-invalid': submitted && !this.item.race}"/>-->
            <!--              <small v-if="submitted && !this.item.breed" class="p-invalid">Breed is required.</small>-->
            <!--            </pv-float-label>-->
            <pv-dropdown v-model="this.item2.department" :options="this.auxDepartments" filter placeholder="Select a Department" >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                  <div>{{ slotProps.value }}</div>
                </div>
                <span v-else>
            {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="flex align-items-center">
                  <div>{{ slotProps.option }}</div>
                </div>
              </template>
            </pv-dropdown>
          </div>

          <div class="field mt-3 container-field">
<!--            <label for="city">City</label>-->
<!--            <pv-float-label>-->
<!--              <pv-input-text id="city" v-model="this.item2.city" class="p-inputtext p-component" />-->
<!--            </pv-float-label>-->
            <label for="race">City</label>
            <pv-dropdown v-model="this.item2.city" :options="this.auxCities" filter placeholder="Select a City" :disabled="!this.cities">
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                  <div>{{ slotProps.value }}</div>
                </div>
                <span v-else>
            {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="flex align-items-center">
                  <div>{{ slotProps.option }}</div>
                </div>
              </template>
            </pv-dropdown>
          </div>
          <div class="field mt-3 container-field">
            <!--            <label for="district">District</label>-->
            <!--            <pv-float-label>-->
            <!--              <pv-input-text id="district" v-model="this.item2.district" class="p-inputtext p-component" />-->
            <!--            </pv-float-label>-->
            <label for="race">District</label>
            <pv-dropdown v-model="this.item2.district" :options="this.auxDistricts" filter placeholder="Select a District" :disabled="!this.districts">
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                  <div>{{ slotProps.value }}</div>
                </div>
                <span v-else>
            {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="flex align-items-center">
                  <div>{{ slotProps.option }}</div>
                </div>
              </template>
            </pv-dropdown>

          </div>

          <div class="field mt-3 container-field">
            <label for="observations">Additional Information</label>
            <pv-float-label>
              <pv-textarea v-model="this.item.observations" autoResize rows="10" cols="30" />
            </pv-float-label>
          </div>
            </div>
        <div class="container-gallery">
          <div class="card">
            <pv-toast />
            <pv-file-upload name="demo[]" :multiple="true" accept="image/*" :maxFileSize="1000000" @select="onSelectedFiles" invalidFileLimitMessage="You can upload 5 images" fileLimit=5>
              <template #header="slotProps">
                <div class="custom-header">
                  <p>Files: {{ slotProps.files.length }}</p>
                  <pv-button @click="slotProps.chooseCallback" icon="pi pi-images" text label="Add image"></pv-button>
                  <pv-button @click="slotProps.clearCallback" class="pi pi-trash"  text ></pv-button>
                </div>
              </template>

              <template #empty>
                <p>Drag and drop files to here to upload.</p>
              </template>

            </pv-file-upload>
            <template v-if="this.item.imgUrls && this.item.imgUrls.length > 0">
              <div class="existing-images">
                <p>Edit Images:</p>
                <div  class="existing-image">
                  <div v-for="(url, index) in this.item.imgUrls" :key="index" class="container-item">
                    <div class="image-container">
                      <img :src="url" alt="Existing Image">
                    </div>
                    <pv-button icon="pi pi-trash" severity="danger" text  rounded aria-label="Delete Image" class="delete-image-button"  @click="deleteExistingImage(index)" />
                  </div>
                </div>
              </div>
            </template>
          </div>

        </div>
       </div>


    </template>
  </create-and-edit>
</template>

<style scoped>
.container-field label{
  margin-bottom:5px;
}
.card{
  width:100%;
  height:auto;
}
.existing-images {
  display: flex;
  flex-wrap: wrap;
  flex-direction:column;
  height:auto;
  padding:15px;
}

.existing-image {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  min-height:500px;
  flex-direction:row;
  gap:10px;
}

.image-container {
  overflow:hidden;
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction:column;
  width: 150px;
  height:150px;
  gap:6px;
}
.container-item{
  width:auto;
  height:auto;
  gap:5px;
  display:flex;
  flex-direction:column;
  align-items:center;
}
.image-container img {
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
}

.delete-image-button {

}
@media (min-width: 1200px){
  .container-dialog{
    display:flex;
    gap:20px;
    width:100%;
    height:100%;

  }
  .container-form{
    width:400px;
    display:flex;
    flex-direction:column;
    align-items: center;
    height:auto;
  }
  .container-gallery{
    display:flex;
    justify-content:center;
    align-items:center;
    height:100%;
    width:680px;
    margin-top:40px;
  }
  .container-field{
    width:100%;
  }

}


</style>