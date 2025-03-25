import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/login",
    name: "PAuth",
    meta: {
      layout: "auth",
    },
    component: () => import("@/modules/Auth/pages/PLogin.vue"),
  },
];

export default routes;
