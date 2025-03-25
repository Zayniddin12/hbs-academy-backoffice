import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/pages/:slug",
    name: "StaticPage",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Pages/pages/PIndex.vue"),
  },
];

export default routes;
