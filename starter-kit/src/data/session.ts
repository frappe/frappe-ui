import router from "@/router";
import { createResource } from "frappe-ui";
import { computed, reactive } from "vue";
import { userResource } from "./user";

const sessionUser = () => {
  const cookies = new URLSearchParams(document.cookie.split("; ").join("&"));
  let _sessionUser = cookies.get("user_id");
  if (_sessionUser === "Guest") {
    _sessionUser = null;
  }
  return _sessionUser;
};

export const session = reactive({
  login: createResource({
    url: "login",
    makeParams({ email, password }) {
      return { usr: email, pwd: password };
    },
    onSuccess() {
      userResource.reload();
      session.user = sessionUser();
      session.login.reset();
      router.replace("/");
    },
  }),

  logout: createResource({
    url: "logout",
    onSuccess() {
      userResource.reset();
      session.user = sessionUser();
      router.replace('/login');
    },
  }),
  user: sessionUser(),
  isLoggedIn: computed(() => session.user),
});
