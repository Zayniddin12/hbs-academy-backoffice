import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/students",
    name: "Students",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Students/pages/PIndex.vue"),
  },
  {
    path: "/students/:id",
    name: "StudentsSingle",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Students/pages/PSingle.vue"),
    children: [
      {
        path: "/students/:id/courses",
        name: "StudentsSingleCourses",
        component: () =>
          import("@/modules/Students/pages/Single/PStudentCourses.vue"),
      },
      {
        path: "/students/:id/attendances",
        name: "StudentSingleAttendance",
        component: () =>
          import("@/modules/Students/pages/Single/PStudentAttendance.vue"),
      },
      {
        path: "/students/:id/course/:courseId",
        name: "StudentsCourseSingle",
        component: () => import("@/modules/Students/pages/PCourse.vue"),
      },
      {
        path: "/students/:id/course/:courseId/:moduleId",
        name: "StudentsModuleSingle",
        component: () => import("@/modules/Students/pages/PModule.vue"),
        children: [
          {
            path: "",
            name: "StudentsModuleSingleLessons",
            component: () => import("@/modules/Students/pages/PLessons.vue"),
          },
          {
            path: "/students/:id/course/:courseId/:moduleId/assignments",
            name: "StudentsModuleSingleAssignments",
            component: () =>
              import("@/modules/Students/pages/PAssignments.vue"),
          },
        ],
      },
    ],
  },
];

export default routes;
