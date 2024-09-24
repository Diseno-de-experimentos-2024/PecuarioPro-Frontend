<script>
import {Vaccine} from "../../vaccines/model/vaccine.entity.js";

export default {
  name: "bovine-view-vaccine",
  props:{
    vaccine : Vaccine
  },
  data(){
    return{
    }
  },
  methods:{

  }
}
</script>

<template>
  <pv-card class="card-vaccine-bovine " >
    <template #title>
      <div class="title-card">
        <p class="title">Name</p>
        <p class="data">{{ vaccine.name }}</p>
      </div>
    </template>
    <template #subtitle>
      <div class="code-card">
        <p class="title">Code</p>
        <p class="data">{{ vaccine.code }}</p>
      </div>
    </template>
    <template #content>
      <div class="content-vaccine">
        <div class="row">
          <div class="column">
            <p class="title">Date</p>
            <p class="data">{{ vaccine.date }}</p>
          </div>
          <div class="column">
            <p class="title">Dose</p>
            <p class="data">{{ vaccine.dose }}</p>
          </div>
        </div>

        <div class="reason">
          <p class="title">Reason</p>
          <p class="data">{{ vaccine.reason }}</p>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.card-vaccine-bovine {
  border: 1px solid #e0e0e0;
  padding: 3px; /* Reduce padding */
  margin: 2px 0;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Reduce shadow */
  min-height: 150px; /* Reduce minimum height */
}

.title-card,
.code-card,
.content-vaccine {
  margin-bottom: 2px; /* Adjust spacing */
}

.title {
  font-weight: bold;
  font-size: 0.9rem; /* Reduce font size */
  color: white;
  margin-bottom: 1px;
}

.data {
  font-size: 0.85rem; /* Reduce data font size */
  color: white;
  margin-bottom: 1px;
}

.row {
  display: flex;
  justify-content: space-between;
}

.column {
  flex: 1;
  margin-right: 2px;
}

.column:last-child {
  margin-right: 0;
}

.reason {
  margin-top: 2px;
}

@media (max-width: 768px) {
  .row {
    flex-direction: column;
  }

  .column {
    margin-right: 0;
    margin-bottom: 8px; /* Reduce bottom margin */
  }

  .column:last-child {
    margin-bottom: 0;
  }
}
</style>