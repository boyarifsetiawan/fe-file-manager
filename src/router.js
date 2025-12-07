import { useAuthStore } from "./store/useAuthStore.js";
import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "./Pages/Dashboard.vue";
import MyFilesPage from "./Pages/MyFiles.vue";
import SharedWithMePage from "./Pages/SharedWithMe.vue";
import SharedByMePage from "./Pages/SharedByMe.vue";
import TrashPage from "./Pages/Trash.vue";
import Login from "./Pages/Auth/Login.vue";
import Register from "./Pages/Auth/Register.vue";

const routes = [
	{
		path: "/login",
		name: "login",
		component: Login,
		meta: { guest: true },
	},
	{
		path: "/register",
		name: "register",
		component: Register,
		meta: { guest: true },
	},
	{
		path: "/",
		name: "dashboard",
		component: Dashboard,
		meta: { requiresAuth: true },
	},
	{
		path: "/my-files/:pathMatch(.*)*",
		name: "myFiles",
		component: MyFilesPage,
		meta: { requiresAuth: true },
	},
	{
		path: "/shared-with-me",
		name: "file.sharedWithMe",
		component: SharedWithMePage,
		meta: { requiresAuth: true },
	},
	{
		path: "/shared-by-me",
		name: "file.sharedByMe",
		component: SharedByMePage,
		meta: { requiresAuth: true },
	},
	{
		path: "/trash",
		name: "trash",
		component: TrashPage,
		meta: { requiresAuth: true },
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	const auth = useAuthStore();

	if (to.meta.requiresAuth && !auth.isLoggedIn) {
		return next("/login");
	}

	if (to.meta.guest && auth.isLoggedIn) {
		return next("/");
	}

	next();
});
export default router;
