const routes = [
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
//# sourceMappingURL=routes.js.map
