import http from "../../../shared/services/http-common.js";

<template>
  <div class="container">
    <h1 class="animated-title" style="margin-bottom: 80px;">Management Inventory</h1>
    <div class="cards-container">
      <div class="card" v-for="card in cards" :key="card.title">
        <pv-card>
          <template #title>
            <div class="card-title">
              {{ card.title }}
              <i :class="card.icon" class="card-icon"></i>
            </div>
          </template>
          <template #content>
            <div class="card-description">{{ card.description }}</div>
          </template>
          <template #footer>
            <div class="card-footer">
              <pv-button label="View" @click="showInventoryDialog(card.title)"></pv-button>
            </div>
          </template>
        </pv-card>
      </div>
    </div>
  </div>

  <pv-dialog v-model:visible="displayDialog" :header="selectedInventory" :style="{ width: '50vw' }" :modal="true">
    <div>Inventory For {{ selectedInventory }}</div>

    <div v-if="selectedInventory === 'Food'">
      <h4>Food Inventory Description</h4>
      <pv-toolbar>
        <template #start>
          <pv-button icon="pi pi-plus" class="mr-2" severity="secondary" @click="openAddDialog" />
          <pv-button icon="pi pi-print" class="mr-2" severity="secondary" />
          <pv-button icon="pi pi-upload" severity="secondary" />
        </template>
        <template #center>
          <pv-icon-field iconPosition="left">
            <pv-input-icon>
              <i class="pi pi-search" />
            </pv-input-icon>
            <pv-input-text placeholder="Search" />
          </pv-icon-field>
        </template>
        <template #end>
          <pv-split-button label="Save" :model="items1"></pv-split-button>
        </template>
      </pv-toolbar>
    </div>
    <div v-else-if="selectedInventory === 'Vaccine'">
      <h4>Vaccine Inventory Description</h4>
      <pv-toolbar>
        <template #start>
          <pv-button icon="pi pi-plus" class="mr-2" severity="secondary" @click="openAddDialog" />
          <pv-button icon="pi pi-print" class="mr-2" severity="secondary" />
          <pv-button icon="pi pi-upload" severity="secondary" />
        </template>
        <template #center>
          <pv-icon-field iconPosition="left">
            <pv-input-icon>
              <i class="pi pi-search" />
            </pv-input-icon>
            <pv-input-text placeholder="Search" />
          </pv-icon-field>
        </template>
        <template #end>
          <pv-split-button label="Save" :model="items1"></pv-split-button>
        </template>
      </pv-toolbar>
    </div>
    <div v-else-if="selectedInventory === 'Tools'">
      <h4>Tools Inventory Description</h4>
      <pv-toolbar>
        <template #start>
          <pv-button icon="pi pi-plus" class="mr-2" severity="secondary" @click="openAddDialog" />
          <pv-button icon="pi pi-print" class="mr-2" severity="secondary" />
          <pv-button icon="pi pi-upload" severity="secondary" />
        </template>
        <template #center>
          <pv-icon-field iconPosition="left">
            <pv-input-icon>
              <i class="pi pi-search" />
            </pv-input-icon>
            <pv-input-text placeholder="Search" />
          </pv-icon-field>
        </template>
        <template #end>
          <pv-split-button label="Save" :model="items1"></pv-split-button>
        </template>
      </pv-toolbar>
    </div>

    <div class="product-list">
      <ul>
        <li v-for="item in items" :key="item.id">
          <div class="product-list-item">
            <div class="product-details">
              <h5 class="product-title">{{ item.name }}</h5>
              <div class="product-quantity">Quantity: {{ item.quantity }}</div>
            </div>
            <div class="product-action">
              <pv-button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="openEditDialog(item)"></pv-button>
              <pv-button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteItem(item)"></pv-button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <template #footer>
      <pv-button label="Close" @click="closeDialog"></pv-button>
      <pv-button label="Add" @click="openAddDialog"></pv-button>
    </template>
  </pv-dialog>

  <pv-dialog v-model:visible="displayAddDialog" :header="'Add ' + selectedInventory" :style="{ width: '30vw' }" :modal="true">
    <div class="form-group">
      <label for="name">Name</label>
      <pv-input-text v-model="newItem.name" id="name" placeholder="Enter item name" />
    </div>
    <div class="form-group">
      <label for="quantity">Quantity</label>
      <pv-input-number v-model="newItem.quantity" id="quantity" placeholder="Enter item quantity" />
    </div>
    <template #footer>
      <pv-button label="Cancel" @click="closeAddDialog"></pv-button>
      <pv-button label="Save" @click="saveNewItem"></pv-button>
    </template>
  </pv-dialog>

  <pv-dialog v-model:visible="displayEditDialog" :header="'Edit ' + selectedInventory" :style="{ width: '30vw' }" :modal="true">
    <div class="form-group">
      <label for="editName">Name</label>
      <pv-input-text v-model="editItemData.name" id="editName" placeholder="Enter item name" />
    </div>
    <div class="form-group">
      <label for="editQuantity">Quantity</label>
      <pv-input-number v-model="editItemData.quantity" id="editQuantity" placeholder="Enter item quantity" />
    </div>

    <template #footer>
      <pv-button label="Cancel" @click="closeEditDialog"></pv-button>
      <pv-button label="Save" @click="saveEditedItem"></pv-button>
    </template>
  </pv-dialog>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import {AuthenticationService} from "../../../iam/services/authentication.service.js";
import {useAuthenticationStore} from "../../../iam/services/authentication.store.js";

export default {
  setup() {

    const displayDialog = ref(false);
    const displayAddDialog = ref(false);
    const displayEditDialog = ref(false);
    const selectedInventory = ref('');

    const items = ref([]);
    const newItem = ref({
      name: '',
      quantity: 0,
      image: ''
    });
    const editItemData = ref({
      id: null,
      name: '',
      quantity: 0,
      image: ''
    });
    const items1 = ref([
      {
        label: 'Update',
        icon: 'pi pi-refresh'
      },
      {
        label: 'Delete',
        icon: 'pi pi-times'
      }
    ]);

    const cards = [
      { title: 'Food', description: 'Inventory', icon: 'pi pi-apple' },
      { title: 'Vaccine', description: 'Inventory', icon: 'pi pi-pen-to-square' },
      { title: 'Tools', description: 'Inventory', icon: 'pi pi-wrench' }
    ];

    const showInventoryDialog = async (title) => {
      console.log(`Opening dialog for ${title}`);
      selectedInventory.value = title;
      await loadInventoryData(title);
      displayDialog.value = true;
      console.log(`Dialog state: ${displayDialog.value}`);
    };

    const route = 'http://localhost:5147/api/v1/inventory/'
    const userId = useAuthenticationStore().currentUserId;

    const authToken = localStorage.getItem('token');

    const router = useRouter();
    const loadInventoryData = async (title) => {
      console.log(`Loading inventory data for ${title}`);
      try {
        if (title === 'Food') {
          const response = await axios.get(route + userId + '/feed-supplies', {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          });
          items.value = response.data;
          console.log('Loaded food items:', items.value);
        } else if (title === 'Vaccine') {
          await router.push('/vaccine');
        } else if (title === 'Tools') {
          const response = await axios.get(route + userId + '/tools', {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          });
          items.value = response.data;
          console.log('Loaded tools items:', items.value);
        }
      } catch (error) {
        console.error('Error loading inventory data:', error);
        // Manejar el error de manera adecuada, por ejemplo, mostrar un mensaje al usuario
      }
    };
    const openAddDialog = () => {
      newItem.value = { name: '', quantity: 0, image: '' };
      displayAddDialog.value = true;
    };

    const saveNewItem = async () => {
      if (selectedInventory.value === "Food") {
        const endpoint = "/feed-supplies";
        console.log(newItem.value);
        const newItemData = {
          inventoryId: userId,
          name: newItem.value.name,
          unitPrice: 1,
          quantity: newItem.value.quantity,
          purchaseDate: "2024-09-25",
          supplier: "supplier",
          unitOfMeasurement: "a",
          status: "Available"
        };
        await axios.post(route + userId + endpoint, newItemData, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
      }
      else if (selectedInventory.value === "Tools"){
        const endpoint = "/tools";
        const newItemData = {
          inventoryId: userId,
          name: newItem.value.name,
          unitPrice: 1,
          quantity: newItem.value.quantity,
          purchaseDate: "2024-09-25",
          supplier: "supplier",
          status: "Available",
          condition: "New"
        };
        await axios.post(route + userId + endpoint, newItemData, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
      }

      await loadInventoryData(selectedInventory.value);
      closeAddDialog();
    };

    const closeAddDialog = () => {
      displayAddDialog.value = false;
    };

    const openEditDialog = (item) => {
      editItemData.value = { ...item };
      displayEditDialog.value = true;
    };

    const saveEditedItem = async () => {
      try {
        const endpoint = `http://localhost:3000/inventory/${editItemData.value.id}`; // Ensure correct endpoint with ID
        const response = await axios.put(endpoint, editItemData.value);
        if (response.status === 200) {
          // ... success handling
        } else {
          console.error('Error updating item:', response.data);
          // ... error handling
        }
      } catch (error) {
        console.error('Error updating item:', error);
        // ... error handling
      }
    };


    const closeEditDialog = () => {
      displayEditDialog.value = false;
    };

    const deleteItem = async (item) => {
      try {
        const endpoint = selectedInventory.value.toLowerCase();
        const response = await axios.delete(`http://localhost:3000/inventory/${endpoint}/${item.id}`);
        if (response.status === 200) {
          await loadInventoryData(selectedInventory.value);
        } else {
          console.error('Error deleting item:', response.data);

        }
      } catch (error) {
        console.error('Error deleting item:', error);

      }
    };

    const closeDialog = () => {
      displayDialog.value = false;
    };

    const onImageError = (event) => {
      event.target.src = 'https://example.com/images/default.jpg'; // Fallback image
    };

    return {
      displayDialog,
      displayAddDialog,
      displayEditDialog,
      selectedInventory,
      items,
      newItem,
      editItemData,
      cards,
      items1,
      showInventoryDialog,
      closeDialog,
      openAddDialog,
      saveNewItem,
      closeAddDialog,
      openEditDialog,
      saveEditedItem,
      closeEditDialog,
      deleteItem,
      onImageError
    };
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
}
.animated-title {
  font-size: 3rem;
  font-weight: bold;
  animation: fadeIn 2s ease-in-out;
  text-align: center;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.cards-container {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card:hover {
  transform: scale(1.05);
}

.card-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5rem;
}

.card-icon {
  font-size: 3rem;
  margin-top: 10px;
}

.card-description {
  text-align: center;
  margin: 20px 0;
}

.card-footer {
  display: flex;
  justify-content: center;
}

.product-list-item {
  border-bottom: 1px solid var(--surface-d);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.product-image {
  max-width: 50px;
  max-height: 50px;
  margin-bottom: 0.5rem;
}

.product-quantity {
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.product-action {
  display: flex;
  justify-content: flex-end;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

.form-group input {
  width: 100%;
}
</style>
