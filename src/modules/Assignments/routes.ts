import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/assignments",
    name: "Assignments",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Assignments/pages/PIndex.vue"),
  },
  {
    path: "/assignment/:id",
    name: "AssignmentSingle",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Assignments/pages/PSingle.vue"),
  },
  {
    path: "/assignments/:id/module",
    name: "AssignmentModules",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Assignments/pages/Modules/PIndex.vue"),
  },
  {
    path: "/assignments/mentors/:id",
    name: "AssignmentMentorSingle",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Assignments/pages/PCourseMentors.vue"),
  },
  {
    path: "/assignments/mentors/mentor/:id",
    name: "AssignmentMentorMentorSingle",
    meta: {
      layout: "default",
    },
    component: () =>
      import("@/modules/Assignments/pages/PCourseMentorsMentor.vue"),
  },
  {
    path: "/assignments/mentors/mentor/course/:id",
    name: "AssignmentMentorMentorSingleCourse",
    meta: {
      layout: "default",
    },
    component: () =>
      import("@/modules/Assignments/pages/PMentorsMentorCourse.vue"),
    children: [
      {
        path: "",
        name: "AssignmentMentorMentorsSingle",
        component: () =>
          import("@/modules/Assignments/pages/Course/MentorCourse.vue"),
      },
      {
        path: "/assignments/mentors/mentor/course/:id/assignments",
        name: "AssignmentMentorMentorsSingleAssignments",
        component: () =>
          import(
            "@/modules/Assignments/pages/Course/MentorCourseAssignments.vue"
          ),
      },
    ],
  },
  {
    path: "/assignments/course/:id",
    name: "AssignmentCourseSingle",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Assignments/pages/PSingle.vue"),
  },
];

export default routes;
