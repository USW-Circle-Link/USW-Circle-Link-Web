import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../components/Dashboard.vue'),
    },
    {
        path: '/intro',
        name: 'intro',
        component: () => import('../components/intro.vue'),
    },
    {
        path: '/notice',
        name: 'notice',
        component: () => import('../components/notice.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
