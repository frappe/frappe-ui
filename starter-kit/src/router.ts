import { session } from "./data/session";
import { userResource } from "./data/user";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/pages/Home.vue"),
  },
  {
    name: "Login",
    path: "/login",
    component: () => import("@/pages/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory("/frontend"),
  routes,
});

router.beforeEach(async (to, from, next) => {
  let isLoggedIn = session.isLoggedIn;

  try {
    await userResource.promise;
  } catch (error) {
    isLoggedIn = false;
  }

  if (!isLoggedIn && to.name !== "Login") {
    next({ name: "Login" });
  } //
  else if (isLoggedIn && to.name === "Login") {
    next({ name: "Home" });
  } //
  else next();
});

export default router;
