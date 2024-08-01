import { createRouter, createWebHistory } from 'vue-router';
import NoticeClick from '../components/NoticeClick.vue';
import ProfileEdit from '../components/ProfileEdit.vue';

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('../components/login/Login.vue'),
    },
    {
        path: '/new-page',
        name: 'new-page',
        component: () => import('../components/PopupClubinfo.vue'),
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
                path: 'passer-management',
                name: 'passer-management',
                component: () => import('../components/PasserManagement.vue'),
            },
            {
                path: 'notice',
                name: 'notice',
                component: () => import('../components/notice.vue'),
            },
            {
                path: 'noticeclick/:id',
                name: 'NoticeClick',
                component: NoticeClick,
                props: true,
            },
            {
                path: 'profileedit',
                name: 'profileedit',
                component: ProfileEdit
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
