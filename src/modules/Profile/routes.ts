import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/profile",
    name: "PProfile",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Profile/pages/PProfile.vue"),
  },
];

export default routes;
