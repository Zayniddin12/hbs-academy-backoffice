import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AuthRoutes from "@/modules/Auth/routes";
import DashboardRoutes from "@/modules/Dashboard/routes";
import ProfileRoutes from "@/modules/Profile/routes";
import StudentsRoutes from "@/modules/Students/routes";
import ColleagueRoutes from "@/modules/Colleagues/routes";
import CoursesRoutes from "@/modules/Courses/routes";
import ComplaintsRoutes from "@/modules/Complaints/routes";
import EventsRoutes from "@/modules/Events/routes";
import RatingRoutes from "@/modules/Rating/routes";
import AssignmentRoutes from "@/modules/Assignments/routes";
import PagesRoutes from "@/modules/Pages/routes";
import { useAuthStore } from "@/modules/Auth/stores";
import { computed } from "vue";
import { JwtService } from "@/services/JwtService";

const routes: Array<RouteRecordRaw> = [
  ...AuthRoutes,
  ...DashboardRoutes,
  ...ProfileRoutes,
  ...StudentsRoutes,
  ...ColleagueRoutes,
  ...CoursesRoutes,
  ...ComplaintsRoutes,
  ...EventsRoutes,
  ...RatingRoutes,
  ...AssignmentRoutes,
  ...PagesRoutes,
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    meta: {
      layout: "error",
    },
    component: () => import("@/layout/Error/LError.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  if (["404", "403", "500"].includes((to.name || "").toString())) {
    return true;
  }
  const authStore = useAuthStore();
  const user = computed(() => authStore.user);
  if (JwtService.getToken() && !Object.keys(user.value)?.length) {
    await authStore.fetchUserData();
  }
  if (Object.keys(user.value)?.length && to.name === "PAuth") {
    return { name: "PDashboard" };
  }
  if (to.name === "StaticPage") return true;
  if (
    to.name !== "PAuth" &&
    !JwtService.getToken() &&
    !Object.keys(user.value)?.length
  ) {
    return { name: "PAuth" };
  } else {
    return true;
  }
});
export default router;
