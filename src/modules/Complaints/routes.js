const routes = [
  {
    path: "/complaints",
    name: "Complaints",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Complaints/pages/PIndex.vue"),
  },
  {
    path: "/complaints/:id",
    name: "ComplaintSingle",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Complaints/pages/PSingle.vue"),
  },
];
export default routes;
//# sourceMappingURL=routes.js.map
