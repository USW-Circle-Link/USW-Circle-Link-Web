import { createRouter, createWebHistory } from 'vue-router';
import NoticeClick from '../components/ClubLeader/NoticeClick.vue';
import ProfileEdit from '../components/ClubLeader/ProfileEdit.vue';

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('@/components/Login/Login.vue'),
    },
    {
        path: '/new-page',
        name: 'new-page',
        component: () => import('../components/ClubLeader/PopupClubinfo.vue'),
    },
    {
        path: '/main',
        name: 'main',
        component: () => import('../components/ClubLeader/Main.vue'),
        redirect: { name: 'dashboard' },
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('../components/ClubLeader/Dashboard.vue'),
            },
            {
                path: 'intro',
                name: 'intro',
                component: () => import('../components/ClubLeader/intro.vue'),
            },
            {
                path: 'passer-management',
                name: 'passer-management',
                component: () => import('../components/ClubLeader/PasserManagement.vue'),
            },
            {
                path: 'notice',
                name: 'notice',
                component: () => import('../components/ClubLeader/notice.vue'),
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
    {
        path: '/adminmain',
        name: 'adminmain',
        component: () => import('../components/Admin/Main.vue'),
        redirect: { name: 'admindashboard' },
        children: [
            {
                path: '',
                name: 'admindashboard',
                component: () => import('../components/Admin/Dashboard.vue'),
            }
            ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
