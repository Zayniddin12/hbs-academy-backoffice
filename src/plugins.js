import "vue-toastification/dist/index.css";
import Toast from "vue-toastification";
import CommonToast from "@/components/CToast.vue";
import Maska from "maska";
import apiService from "@/services/ApiService";
import { createPinia } from "pinia";
export default function definePlugins(app) {
  apiService.init(app);
  const pinia = createPinia();
  const options = {
    position: "top-right",
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: false,
    icon: true,
    rtl: false,
    maxToasts: 3,
    newestOnTop: true,
    component: CommonToast,
  };
  app.use(pinia);
  app.use(Maska);
  app.use(Toast, options);
  return app;
}
//# sourceMappingURL=plugins.js.map
