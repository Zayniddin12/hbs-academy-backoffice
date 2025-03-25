import { RouteLocationRaw } from "vue-router";

export interface IMenu {
  heading: string;
  route: RouteLocationRaw;
  svgIcon?: string;
  meta?: {
    role: string[];
  };
  sub?: IMenu[];
}

export const menu: IMenu[] = [
  {
    heading: "home",
    route: "/",
    svgIcon: "icon-home",
  },
  {
    heading: "students",
    route: "/students",
    svgIcon: "icon-user",
  },
  // {
  //   heading: "rating",
  //   route: "/rating",
  //   svgIcon: "icon-docs",
  // },
  {
    heading: "courses",
    route: "/courses",
    svgIcon: "icon-dashboard",
  },
  {
    heading: "assignments",
    route: "/assignments",
    svgIcon: "icon-ruler",
  },
  {
    heading: "colleagues",
    route: "/colleagues",
    svgIcon: "icon-two_user",
  },
  {
    heading: "events",
    route: "/events",
    svgIcon: "icon-calendar",
  },
  // {
  //   heading: "complaints",
  //   route: "/complaints",
  //   svgIcon: "icon-docs",
  // },
  // {
  //   heading: "Menu with sub",
  //   route: "",
  //   svgIcon: "icon-docs",
  //   sub: [
  //     {
  //       heading: "Submenu 1",
  //       route: "",
  //     },
  //     {
  //       heading: "Submenu 2",
  //       route: "",
  //     },
  //   ],
  //   meta: {
  //     role: ["super_admin"],
  //   },
  // },
];
