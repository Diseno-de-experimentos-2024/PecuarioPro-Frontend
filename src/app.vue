<script>
import { useRoute} from "vue-router";
import AuthenticationSection from "./iam/components/authentication-section.component.vue";

export default {
  name: 'App',
  components: {AuthenticationSection},
  setup() {
    const route = useRoute();
    return { route };
  },
  data() {
    return {
      drawer: false,
      visible:Boolean,
      items: [
        {label: 'Animal', to: '/animal'},
        {label: 'Vaccine', to: '/vaccine'},
        {label: 'Campaign', to: '/campaign'},
        {label: 'Staff', to: '/staff-view'},
        {label: 'Inventory', to: '/inventory'}
      ],
      hiddenRoutes: ['/sign-in', '/sign-up']

    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    }
  }
}
</script>

<template>
  <div>
      <pv-toolbar class="toolbar" fixed>
        <template #start>
          <pv-button
              class="menu-button"
              icon="pi pi-bars"
              @click="toggleDrawer()"
              v-if="!hiddenRoutes.includes(route.path)"
          />
          <h1 class="toolbar-title">PecuarioPro</h1>
        </template>
        <template #end>
          <authentication-section/>
        </template>
      </pv-toolbar>

    <div class="app-content" v-if="route.path !== '/' && route.path !== '/register' && route.path !== '/login'">

      <template>
        <div class="card flex justify-content-center">
          <pv-sidebar v-model:visible="drawer">
            <template #container="{ closeCallback }">
              <div class="flex flex-column h-full">
                <div class="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
                        <span class="inline-flex align-items-center gap-2">
                            <img src="./assets/Green%20Modern%20Farm%20Logo%20(4).png" alt="logo" class="h-8"  width="75" height="75"/>
                            <span class="font-semibold text-2xl text-primary">PecuarioPro</span>
                        </span>
                  <span>
                            <pv-button type="button" @click="closeCallback" icon="pi pi-times" rounded outlined class="h-2rem w-2rem"></pv-button>
                        </span>
                </div>
                <div class="overflow-y-auto">
                  <ul class="list-none p-3 m-0">
                    <li>
                      <div
                          v-ripple
                          v-styleclass="{
                                        selector: '@next',
                                        enterClass: 'hidden',
                                        enterActiveClass: 'slidedown',
                                        leaveToClass: 'hidden',
                                        leaveActiveClass: 'slideup'
                                    }"
                          class="p-3 flex align-items-center justify-content-between text-600 cursor-pointer p-ripple"
                      >
                        <span class="font-medium">My Farm</span>
                        <i class="pi pi-chevron-down"></i>
                      </div>
                      <ul class="list-none p-0 m-0 overflow-hidden">
                        <li>
                          <router-link to="/" @click=toggleDrawer() style="text-decoration: none">
                            <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                              <i class="pi pi-home mr-2"></i>
                              <span class="font-medium">Home</span>
                            </a>
                          </router-link>
                        </li>
                        <li>
                          <router-link to="/campaign" @click=toggleDrawer() style="text-decoration: none">
                            <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple text-decoration:none" >
                              <i class="pi pi-bookmark mr-2 " ></i>
                              <span class="font-medium">Campaings</span>
                            </a>
                          </router-link>
                        </li>
                        <li>
                          <a
                              v-ripple
                              v-styleclass="{
                                                selector: '@next',
                                                enterClass: 'hidden',
                                                enterActiveClass: 'slidedown',
                                                leaveToClass: 'hidden',
                                                leaveActiveClass: 'slideup'
                                            }"
                              class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple"
                          >
                            <i class="pi pi-chart-line mr-2"></i>
                            <span class="font-medium">Reports</span>
                            <i class="pi pi-chevron-down ml-auto"></i>
                          </a>
                          <ul class="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                            <li>
                              <a
                                  v-ripple
                                  v-styleclass="{
                                                        selector: '@next',
                                                        enterClass: 'hidden',
                                                        enterActiveClass: 'slidedown',
                                                        leaveToClass: 'hidden',
                                                        leaveActiveClass: 'slideup'
                                                    }"
                                  class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple"
                              >
                                <i class="pi pi-chart-line mr-2"></i>
                                <span class="font-medium">livestock</span>
                                <i class="pi pi-chevron-down ml-auto"></i>
                              </a>
                              <ul class="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                                <li>
                                  <router-link to="/statisticsBovine" @click=toggleDrawer() style="text-decoration: none">
                                  <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                    <i class="pi pi-table mr-2"></i>
                                    <span class="font-medium">Statistics</span>
                                  </a>
                                  </router-link>
                                </li>
                                <li>
                                  <router-link to="/animalTotal" @click=toggleDrawer() style="text-decoration: none">
                                  <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                    <i class="pi pi-search mr-2"></i>
                                    <span class="font-medium">Animal</span>
                                  </a>
                                  </router-link>
                                </li>
                              </ul>
                            </li>
                            <li>
                              <router-link to="/Statistics" @click=toggleDrawer() style="text-decoration: none">
                              <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                <i class="pi pi-chart-line mr-2"></i>
                                <span class="font-medium">Vaccines Statistics</span>
                              </a>
                              </router-link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a
                              v-ripple
                              v-styleclass="{
                                                selector: '@next',
                                                enterClass: 'hidden',
                                                enterActiveClass: 'slidedown',
                                                leaveToClass: 'hidden',
                                                leaveActiveClass: 'slideup'
                                            }"
                              class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple"
                          >
                            <i class="pi pi-users mr-2"></i>
                            <span class="font-medium">Staff</span>
                            <i class="pi pi-chevron-down ml-auto"></i>
                          </a>
                          <ul class="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                            <li>
                              <router-link to="/staff-view" @click=toggleDrawer() style="text-decoration: none">
                                <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                  <i class="pi pi-users mr-2"></i>
                                  <span class="font-medium">View Staff</span>
                                </a>
                              </router-link>
                            </li>
                            <li>
                              <router-link to="/staff-manage" @click=toggleDrawer() style="text-decoration: none">
                                <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                  <i class="pi pi-users mr-2"></i>
                                  <span class="font-medium">Manage Staff</span>
                                </a>
                              </router-link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <router-link to="/inventory" @click=toggleDrawer() style="text-decoration: none">
                          <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                            <i class="pi pi-warehouse mr-2"></i>
                            <span class="font-medium">Inventory</span>
<!--                            <span class="inline-flex align-items-center justify-content-center ml-auto bg-primary border-circle" style="min-width: 1.5rem; height: 1.5rem">3</span>-->
                          </a>
                          </router-link>
                        </li>
                        <li>
                          <a
                              v-ripple
                              v-styleclass="{
                                                selector: '@next',
                                                enterClass: 'hidden',
                                                enterActiveClass: 'slidedown',
                                                leaveToClass: 'hidden',
                                                leaveActiveClass: 'slideup'
                                            }"
                              class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple"
                          >
                            <i class="pi pi-calendar-minus mr-2"></i>
                            <span class="font-medium">Vaccines</span>
                            <i class="pi pi-chevron-down ml-auto"></i>
                          </a>
                        <ul class="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                        <li>
                          <router-link to="/vaccine" @click=toggleDrawer() style="text-decoration: none">
                            <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple text-decoration:none" >
                              <i class="pi pi-heart mr-2 " ></i>
                              <span class="font-medium">Vaccine Management</span>
                            </a>
                          </router-link>
                          </li>
                        </ul>
                        </li>
                        <li>
                          <router-link to="/settings" @click=toggleDrawer() style="text-decoration: none">
                          <a v-ripple class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                            <i class="pi pi-spin pi-cog mr-2" ></i>
                            <span class="font-medium">Settings</span>
                          </a>
                          </router-link>

                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </template>
          </pv-sidebar>
        </div>
      </template>
    </div>
    <router-view/>
  </div>
</template>

<style scoped>
.toolbar {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: white;
}

.menu-button {
  font-size: 24px;
  color: white;
  background: transparent;
  border: none;
  cursor: pointer;
}

.menu-button:hover {
  color: #d4d4d4; /* Change color on hover */
}

.toolbar-title {
  margin-left: 16px;
  font-size: 24px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.white-text {
  color: white;
}
</style>