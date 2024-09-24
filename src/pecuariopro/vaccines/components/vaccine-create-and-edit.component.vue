<script>
import createAndEdit from "../../../shared/components/create-and-edit.component.vue";
import moment from 'moment';
import {useAuthenticationStore} from "../../../iam/services/authentication.store.js";
import {BovinesApiService} from "../../admin-bovines/services/bovines-api.service.js";

export default {
  name: "vaccine-item-create-and-edit",
  components: { createAndEdit},
  props: {
    item: null,
    visible: Boolean,
    statuses: Array
  },
  data() {
    return {
      submitted: false,
      bovines:[],
      bovine: {},
    }
  },
  created() {
    this.bovineService = new BovinesApiService();
     const authenticationStore = useAuthenticationStore();
    this.item.userId = authenticationStore.currentUserId;

    this.bovineService.getAllBovinesByUserId(this.item.userId).then((response) => {

      this.bovines = response.data;

    })
  },
  methods: {
    canceledEventHandler() {
      this.bovine={};
      this.$emit('canceled');
    },
    savedEventHandler() {
      this.submitted = true;
      // Verify if the required fields are filled
      const authenticationStore2 = useAuthenticationStore();

      this.item.userId = authenticationStore2.currentUserId;
      let fullDate = new Date(this.item.date);
      this.item.date=fullDate.toISOString().split('T')[0];
      if (this.item.name && this.item.code && this.item.status) {
        let authToken = localStorage.getItem('authToken');
        this.$emit('saved', {item: this.item, token: authToken});
      }
    }
  }
}
</script>

<template>
  <create-and-edit :entity="item" :visible="visible" entityName="Vaccine" @canceled="canceledEventHandler"
                   @saved="savedEventHandler">
    <template #content>
      <div class="p-fluid">
        <!-- Remove ID field for creation -->
        <div class="field mt-5">
          <pv-float-label>
            <label for="name">Name</label>
            <pv-input-text id="name" v-model="item.name" :class="{'p-invalid': submitted && !item.name}"/>
            <small v-if="submitted && !item.name" class="p-invalid">Name is required.</small>
          </pv-float-label>
        </div>
        <div class="p-field mt-5">
          <pv-float-label>
            <label for="reason">Reason</label>
            <input id="reason" v-model="item.reason" class="p-inputtext p-component" type="text"/>
          </pv-float-label>
        </div>
        <div class="p-field mt-5">
          <pv-float-label>
            <label for="date">Date</label>
            <pv-calendar v-model="item.date" showIcon iconDisplay="input" dateFormat="dd/mm/yy" class="form-input"></pv-calendar>
          </pv-float-label>
        </div>
        <div class="p-field mt-5">
          <pv-float-label>
            <label for="code">Code</label>
            <pv-input-text id="code" v-model="item.code" :class="{'p-invalid': submitted && !item.code}"/>
            <small v-if="submitted && !item.code" class="p-invalid">Code is required.</small>
          </pv-float-label>
        </div>


        <div class="p-field mt-5">

          <pv-dropdown v-model="this.bovine" :options="this.bovines" filter  placeholder="Select a Bovine" >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex align-items-center">
                <div>{{ slotProps.value.name }}</div>
              </div>
              <span v-else>
            {{ slotProps.placeholder }}
        </span>
            </template>
            <template #option="slotProps">
              <div class="flex align-items-center">
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
          </pv-dropdown>
        </div>


      </div>
    </template>
  </create-and-edit>
</template>
