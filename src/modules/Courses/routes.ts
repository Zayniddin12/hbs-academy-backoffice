import { RouteRecordRaw } from "vue-router";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/courses",
    name: "Courses",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Courses/pages/PIndex.vue"),
  },
  {
    path: "/courses/:courseId/module/:moduleId/assignments/:taskId",
    name: "CourseModulesSingleTask",
    meta: {
      layout: "default",
    },
    component: () =>
      import(
        "@/modules/Courses/pages/Single/Modules/Single/Task/PTaskSingle.vue"
      ),
  },
  {
    path: "/courses/:courseId",
    name: "CourseSingle",
    redirect: { name: "CourseModules" },
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Courses/pages/Single/PIndex.vue"),
    children: [
      {
        path: "/courses/:courseId/module",
        name: "CourseModules",
        component: () =>
          import("@/modules/Courses/pages/Single/Modules/PIndex.vue"),
      },
      {
        path: "/courses/:courseId/module/:moduleId",
        name: "CourseModulesSingle",
        redirect: { name: "CourseModulesSingleLessons" },
        component: () =>
          import("@/modules/Courses/pages/Single/Modules/Single/PIndex.vue"),
        children: [
          {
            path: "/courses/:courseId/module/:moduleId/lessons",
            name: "CourseModulesSingleLessons",
            component: () =>
              import(
                "@/modules/Courses/pages/Single/Modules/Single/Lesson/PLessons.vue"
              ),
          },
          {
            path: "/courses/:courseId/module/:moduleId/assignments",
            name: "CourseModulesSingleAssignments",
            component: () =>
              import(
                "@/modules/Courses/pages/Single/Modules/Single/Task/PTasks.vue"
              ),
          },
        ],
      },

      {
        path: "/courses/:courseId/flows",
        name: "CourseFlows",
        redirect: { name: "CourseFlowsIndex" },
        component: () =>
          import("@/modules/Courses/pages/Single/Flows/PIndex.vue"),
        children: [
          {
            path: "",
            name: "CourseFlowsIndex",
            component: () =>
              import("@/modules/Courses/pages/Single/Flows/PFlows.vue"),
          },
          {
            path: "/courses/:courseId/flows/:flowId",
            name: "CourseFlowsSingle",
            component: () =>
              import("@/modules/Courses/pages/Single/Flows/PFlowSingle.vue"),
          },
          {
            path: "/courses/:courseId/flows/:flowId/group/:groupId",
            name: "CourseFlowsSingleGroupIndex",
            component: () =>
              import("@/modules/Courses/pages/Single/Flows/Group/PIndex.vue"),
            children: [
              {
                path: "",
                name: "CourseFlowsSingleGroup",
                component: () =>
                  import(
                    "@/modules/Courses/pages/Single/Flows/Group/PGroupStudents.vue"
                  ),
              },
              {
                path: "/courses/:courseId/flows/:flowId/group/:groupId/personal",
                name: "CourseFlowsSingleGroupPersonal",
                component: () =>
                  import(
                    "@/modules/Courses/pages/Single/Flows/Group/PGroupPersonal.vue"
                  ),
              },
              {
                path: "/courses/:courseId/flows/:flowId/group/:groupId/attendance",
                name: "CourseFlowsSingleGroupAttendance",
                component: () =>
                  import(
                    "@/modules/Courses/pages/Single/Flows/Group/PGroupAttendance.vue"
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/courses/:courseId/module/:moduleId/assignments/create",
    name: "CourseModulesSingleTaskCreate",
    meta: {
      layout: "default",
    },
    component: () =>
      import(
        "@/modules/Courses/pages/Single/Modules/Single/Task/PTaskCreate.vue"
      ),
  },
  {
    path: "/courses/:courseId/module/:moduleId/assignments/:taskId/edit",
    name: "CourseModulesSingleTaskEdit",
    meta: {
      layout: "default",
    },
    component: () =>
      import(
        "@/modules/Courses/pages/Single/Modules/Single/Task/PTaskEdit.vue"
      ),
  },
  {
    path: "/courses/:courseId/module/:moduleId/lessons/:lessonId",
    name: "CourseModuleLessonSingle",
    meta: {
      layout: "default",
    },
    component: () =>
      import(
        "@/modules/Courses/pages/Single/Modules/Single/Lesson/PLessonSingle.vue"
      ),
  },
  {
    path: "/courses/:courseId/module/create",
    name: "CourseSingleModuleCreate",
    meta: {
      layout: "default",
    },
    component: () =>
      import("@/modules/Courses/pages/Single/Modules/PModuleCreate.vue"),
  },
  {
    path: "/courses-create",
    name: "CourseCreate",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Courses/pages/PCourseCreate.vue"),
  },
  {
    path: "/courses-edit/:id",
    name: "CourseEdit",
    meta: {
      layout: "default",
    },
    component: () => import("@/modules/Courses/pages/PCourseEdit.vue"),
  },
  {
    path: "/courses/:courseId/flows/:flowId/create",
    name: "CourseGroupCreate",
    meta: {
      layout: "default",
    },
    component: () =>
      import("@/modules/Courses/pages/Single/Flows/Group/PGroupCreate.vue"),
  },
  // {
  //   path: "/courses/:courseId/flows/:flowId/group/:groupId/edit",
  //   name: "CourseGroupEdit",
  //   meta: {
  //     layout: "default",
  //   },
  //   component: () =>
  //     import("@/modules/Courses/pages/Single/Flows/Group/PGroupEdit.vue"),
  // },
];

export default routes;
