<script>
import DataManager from "../../../shared/components/data-manager.component.vue";
import VaccineCreateAndEdit from "../components/vaccine-create-and-edit.component.vue";
import { Vaccine } from "../model/vaccine.entity.js";
import { VaccinesApiService } from "../services/vaccine-api.service.js";
import moment from "moment";

export default {
  name: "vaccine-management",
  components: { VaccineCreateAndEdit, DataManager },
  data() {
    return {
      title: { singular: 'Vaccine', plural: 'Vaccines' },
      vaccines: [],
      vaccine: {},
      bovine:{},
      selectedVaccines: [],
      vaccineService: null,
      createAndEditDialogIsVisible: false,
      isEdit: false,
      submitted: false,
      showWelcomeMessage: true,
      reasonModalIsVisible: false,
      reasonText: ""
    };
  },
  methods: {
    toggleRow(data) {
      this.$set(data, 'expanded', !data.expanded);
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    notifySuccessfulAction(message) {
      this.$toast.add({ severity: "success", summary: "Success", detail: message, life: 3000 });
    },
    findIndexById(id) {
      return this.vaccines.findIndex((vaccine) => vaccine.id === id);
    },
    onNewItemEventHandler() {
      this.vaccine = {};
      this.submitted = false;
      this.isEdit = false;
      this.createAndEditDialogIsVisible = true;
    },
    onEditItemEventHandler(item) {
      this.vaccine = item;
      this.submitted = false;
      this.isEdit = true;
      this.createAndEditDialogIsVisible = true;
      this.bovine
    },
    onDeleteItemEventHandler(item) {
      this.vaccine = item;
      this.deleteVaccine();
    },
    onDeleteSelectedItemsEventHandler(selectedItems) {
      this.selectedVaccines = selectedItems;
      this.deleteSelectedVaccines();
    },
    onCanceledEventHandler() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },
    onSavedEventHandler(item) {
      this.submitted = true;
      if (this.vaccine.name && this.vaccine.code) {
        if (this.isEdit) {
          this.updateVaccine();
        } else {
          this.createVaccine();
        }
      }
      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
    },
    createVaccine() {
      this.vaccine = Vaccine.fromDisplayableVaccine(this.vaccine);
      this.vaccineService.create(this.vaccine)
          .then((response) => {
            this.vaccine = Vaccine.toDisplayableVaccine(response.data);
            this.vaccines.push(this.vaccine);
            this.notifySuccessfulAction("Vaccine Created");
          })
          .catch((error) => {
            console.error('Error creating vaccine:', error);
          });
    },
    updateVaccine() {
      this.vaccine = Vaccine.fromDisplayableVaccine(this.vaccine);
      console.log(this.vaccine);
      this.vaccineService.update(this.vaccine.id, this.vaccine)
          .then((response) => {
            this.vaccines[this.findIndexById(response.data.id)] = Vaccine.toDisplayableVaccine(response.data);
            this.notifySuccessfulAction("Vaccine Updated");
          })
          .catch((error) => {
            console.error('Error updating vaccine:', error);
          });
    },
    deleteVaccine() {
      this.vaccineService.delete(this.vaccine.id)
          .then(() => {
            this.vaccines = this.vaccines.filter((v) => v.id !== this.vaccine.id);
            this.vaccine = {};
            this.notifySuccessfulAction("Vaccine Deleted");
          });
    },
    deleteSelectedVaccines() {
      this.selectedVaccines.forEach((vaccine) => {
        this.vaccineService.delete(vaccine.id).then(() => {
          this.vaccines = this.vaccines.filter((v) => v.id !== this.vaccine.id);
        });
      });
      this.notifySuccessfulAction("Vaccines Deleted");
    },
    hideWelcomeMessage() {
      setTimeout(() => {
        this.showWelcomeMessage = false;
      }, 500);
    },
    showReason(reason) {
      this.reasonText = reason;
      this.reasonModalIsVisible = true;
    },
    hideReason() {
      this.reasonModalIsVisible = false;
    }
  },
  created() {
    this.vaccineService = new VaccinesApiService();
    this.vaccineService.getAll().then((response) => {
      let vaccines = response.data;
      this.vaccines = vaccines.map((vaccine) => Vaccine.toDisplayableVaccine(vaccine));
    });


  },
  mounted() {
    this.hideWelcomeMessage();
  }
}
</script>

<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <div>
    <div v-if="showWelcomeMessage" class="welcome-message-overlay">
      <div class="welcome-message">
        <h2>Welcome!!</h2>
        <h2>to the Vaccine Administration of Your Farm</h2>
        <div class="tip-container">
          <div class="tip-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="tip-message">
            <p>Tip: Look carefully at the code for good animal care</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="w-full principal-container">
    <data-manager
        class="custom-table"
        :title="title"
        v-bind:items="vaccines"
        v-on:new-item="onNewItemEventHandler"
        v-on:edit-item="onEditItemEventHandler($event)"
        v-on:delete-item="onDeleteItemEventHandler($event)"
        v-on:delete-selected-items="onDeleteSelectedItemsEventHandler($event)">
      <template #custom-columns>
        <pv-column :sortable="true" field="id" header="id" style="min-width: 10rem"/>
        <pv-column :sortable="true" field="name" header="Name" style="min-width: 20rem"/>
        <pv-column :sortable="true" field="date" header="Date" style="min-width: 15rem">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.date.value) }}
          </template>
        </pv-column>
        <pv-column :sortable="true" field="code" header="Code" style="min-width: 15rem"/>
        <pv-column header="Actions" style="min-width: 10rem">
          <template #body="slotProps">
            <button class="action-button reason-button" @click="showReason(slotProps.data.reason)">
              Reason
            </button>
          </template>
        </pv-column>
      </template>

    </data-manager>

    <vaccine-create-and-edit
        :item="vaccine"
        :edit="isEdit"
        :visible="createAndEditDialogIsVisible"
        v-on:canceled="onCanceledEventHandler"
        v-on:saved="onSavedEventHandler($event)"/>

    <div v-if="reasonModalIsVisible" class="reason-modal-overlay">
      <div class="reason-modal">
        <div class="reason-button">
          <h3>Reason</h3>
          <button class="close-button" @click="hideReason">&times;</button>
        </div>
        <div class="reason-modal-content">
          <p>{{ reasonText }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.welcome-message-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.welcome-message {
  background-color: #023F3A;
  color: #E1D29A;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.tip-container {
  margin-top: 20px;
}

.tip-icon {
  margin-bottom: 10px;
}

.tip-message {
  margin-top: 10px;
}

.action-button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  margin: 0 5px;
}

.action-button i {
  font-size: 1.2em;
}
.principal-container{
  padding:20px;
}
.reason-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.reason-modal {
  background-color:  #33d29b ;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  position: relative;
}

.reason-button {
  background-color:  #33d29b ;
  color: #000000;
  border: 20px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 3px;
}


.reason-modal-content {
  margin-top: 10px;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}

@media screen and (max-width: 1200px) {
  .custom-table .p-datatable .p-datatable-thead > tr > th:nth-child(2),
  .custom-table .p-datatable .p-datatable-tbody > tr > td:nth-child(2) {
    display: none;
  }
}

@media screen and (max-width: 900px) {
  .custom-table .p-datatable .p-datatable-thead > tr > th:nth-child(3),
  .custom-table .p-datatable .p-datatable-tbody > tr > td:nth-child(3) {
    display: none;
  }
}

@media screen and (max-width: 600px) {
  .custom-table .p-datatable .p-datatable-thead > tr > th:nth-child(4),
  .custom-table .p-datatable .p-datatable-tbody > tr > td:nth-child(4) {
    display: none;
  }
}

@media screen and (max-width: 420px) and (max-height: 932px) {
  .custom-table .p-datatable .p-datatable-thead > tr > th:not(:nth-child(4)),
  .custom-table .p-datatable .p-datatable-tbody > tr > td:not(:nth-child(4)) {
    display: none;
  }
}
</style>