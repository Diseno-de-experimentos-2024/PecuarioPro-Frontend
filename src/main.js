import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-dark-green/theme.css'
import App from "./app.vue";

// PrimeIcons
import 'primeicons/primeicons.css';

// PrimeFlex
import 'primeflex/primeflex.css';

// PrimeVue Services
import ToastService from "primevue/toastservice";
import DialogService from "primevue/dialogservice";
import ConfirmationService from "primevue/confirmationservice";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Pinia
import {createPinia} from "pinia";

const pinia = createPinia();


// PrimeVue Components
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ConfirmDialog from "primevue/confirmdialog";
import Row from "primevue/row";
import Toolbar from "primevue/toolbar";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Sidebar from "primevue/sidebar";
import Menu from "primevue/menu";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import Dropdown from "primevue/dropdown";
import Tag from "primevue/tag";
import Card from "primevue/card";
import FileUpload from "primevue/fileupload";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputNumber from "primevue/inputnumber";
import FloatLabel from "primevue/floatlabel";
import Checkbox from "primevue/checkbox";
import Rating from "primevue/rating";
import StyleClass from "primevue/styleclass";
import router from "./router/index.js";
import Ripple from "primevue/ripple";
import Avatar from "primevue/avatar";
import SpeedDial from "primevue/speeddial";
import Calendar from "primevue/calendar";
import Chart from 'primevue/chart';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import RadioButton from 'primevue/radiobutton';
import SplitButton from "primevue/splitbutton";
import Badge from 'primevue/badge';
import ProgressBar from 'primevue/progressbar';

const firebaseConfig = {
    /*apiKey: "AIzaSyBGQMuUsRAs93CevEn84uHD7zO21kM3v_k",
    authDomain: "pecuariopro-98bb9.firebaseapp.com",
    projectId: "pecuariopro-98bb9",
    storageBucket: "pecuariopro-98bb9.appspot.com",
    messagingSenderId: "60716147983",
    appId: "1:60716147983:web:8d48321037ce86fafe4a7a"*/
    apiKey: "AIzaSyBEJ1Uy6lH90NL8GfHZBglrHeFMNAj7GYQ",
    authDomain: "pecuario-pro-2024-02.firebaseapp.com",
    projectId: "pecuario-pro-2024-02",
    storageBucket: "pecuario-pro-2024-02.appspot.com",
    messagingSenderId: "252617488427",
    appId: "1:252617488427:web:bd6caf3c40158201b9926e"
};
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

createApp(App)
    .use(router)
    .use(PrimeVue, {ripple: true})
    .use(ToastService)
    .use(DialogService)
    .use(ConfirmationService)
    .use(pinia)
    .component('Chart', Chart)
    .component('ConfirmDialog', ConfirmDialog)
    .component('pv-progress-bar',ProgressBar)
    .component('pv-badge',Badge)
    .component('pv-button', Button)
    .component('pv-radio-button',RadioButton)
    .component('pv-data-table', DataTable)
    .component('pv-column', Column)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-row', Row)
    .component('pv-stepper', Stepper)
    .component('pv-stepper-panel',StepperPanel)
    .component('pv-toolbar', Toolbar)
    .component('pv-input-text', InputText)
    .component('pv-textarea', Textarea)
    .component('pv-sidebar', Sidebar)
    .component('pv-menu', Menu)
    .component('pv-dialog', Dialog)
    .component('pv-toast', Toast)
    .component('pv-dropdown', Dropdown)
    .component('pv-tag', Tag)
    .component('pv-card', Card)
    .component('pv-file-upload', FileUpload)
    .component('pv-icon-field', IconField)
    .component('pv-input-icon', InputIcon)
    .component('pv-input-number', InputNumber)
    .component('pv-float-label', FloatLabel)
    .component('pv-checkbox', Checkbox)
    .component('pv-rating', Rating)
    .component('pv-avatar',Avatar)
    .component('pv-speed-dial',SpeedDial)
    .component('pv-calendar',Calendar)
    .component('pv-split-button', SplitButton)
    .directive('styleclass', StyleClass)
    .directive('ripple', Ripple)
    .provide('firebaseApp', firebaseApp)
    .provide('firebaseStorage', storage)
    .mount('#app')

