import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/rating",
    name: "Rating",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Rating/pages/PIndex.vue"),
  },
];

export default routes;
