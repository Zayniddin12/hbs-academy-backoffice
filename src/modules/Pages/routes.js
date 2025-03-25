const routes = [
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
//# sourceMappingURL=routes.js.map
