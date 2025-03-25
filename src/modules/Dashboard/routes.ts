import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/",
    name: "PDashboard",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Dashboard/pages/PDashboard.vue"),
  },
];

export default routes;
