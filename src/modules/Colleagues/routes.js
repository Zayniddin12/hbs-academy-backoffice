const routes = [
  {
    path: "/colleagues",
    name: "Colleagues",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Colleagues/pages/PIndex.vue"),
  },
  {
    path: "/colleagues/:id",
    name: "ColleaguesSingle",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Colleagues/pages/PSingle.vue"),
  },
];
export default routes;
//# sourceMappingURL=routes.js.map
