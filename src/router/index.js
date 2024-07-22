import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('../components/login/Login.vue'),
    },
    {
        path: '/',
        name: 'new-page',
        component: () => import('../components/Dashboard.vue'),
    },
    {
        path: '/main',
        name: 'main',
        component: () => import('../components/Main.vue'),
        redirect: { name: 'dashboard' },
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('../components/Dashboard.vue'),
            },
            {
                path: 'intro',
                name: 'intro',
                component: () => import('../components/intro.vue'),
            },
            {
                path: 'notice',
                name: 'notice',
                component: () => import('../components/notice.vue'),
            },
            {
                path: 'passer-management',
                name: 'passer-management',
                component: () => import('../components/PasserManagement.vue'),
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
