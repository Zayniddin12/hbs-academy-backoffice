const routes = [
  {
    path: "/events",
    name: "Events",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Events/pages/PIndex.vue"),
  },
  {
    path: "/events/:id",
    name: "EventSingle",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Events/pages/PSingle.vue"),
  },
];
export default routes;
//# sourceMappingURL=routes.js.map
