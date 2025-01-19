import store from '@/store/store';
import { createRouter, createWebHistory } from 'vue-router';
import AdminNoticeClick from '../components/Admin/NoticeClick.vue';
import ProfileEdit from '../components/ClubLeader/ClubInfoRewrite/ProfileEdit.vue';

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('@/components/Login/Login.vue'),
    },
    // {
    //     path: '/user',
    //     name: 'user',
    //     component: () => import('@/components/User/Main.vue'),
    // },
    {
        path: '/ClubProfile',
        name: 'ClubProfile',
        component: () => import('../components/ClubLeader/PopupClubinfo.vue'),
        meta: { requiresAuth: true, requiresLeader: true },
    },


    {
        path: '/main',
        name: 'main',
        component: () => import('../components/ClubLeader/Main.vue'),
        redirect: { name: 'dashboard' },
        meta: { requiresAuth: true, requiresLeader: true },
        children: [
            {
                path: '/TermsOfUse',
                name: 'TermsOfUse',
                component: () => import('../components/ClubLeader/policy/TermsOfUse.vue'),
                meta: { layout: 'no-layout' } // 특수한 레이아웃을 사용하지 않도록 설정
            },
            {
                path: '/privacy_policy',
                name: 'privacy_policy',
                component: () => import('../components/ClubLeader/policy/PrivacyPolicy.vue'),
                meta: { layout: 'no-layout' } // 특수한 레이아웃을 사용하지 않도록 설정
            },
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
                component: () => import('../components/ClubLeader/NoticeClick.vue'),
                props: true,
            },
            {
                path: 'profileedit',
                name: 'profileedit',
                component: ProfileEdit
            },
            {
                path: 'duplicate-member',
                name: 'duplicate-member',
                component: () => import('../components/ClubLeader/RemoveMember.vue'),
            },
            {
                path: 'remove-member',
                name: 'remove-member',
                component: () => import('../components/ClubLeader/DuplicateMember/DuplicateMember.vue'),
            },
            {
                path: 'addMember',
                name: 'addMember',
                component: () => import('../components/ClubLeader/addMember.vue'),
            },
            {
                path: 'Accept',
                name: 'Accept',
                component: () => import('../components/ClubLeader/Accept.vue'),
            },
            {
                path: 'morepass',
                name: 'morepass',
                component: () => import('../components/ClubLeader/MorePass.vue'),
            },
        ]
    },
    {
        path: '/adminmain',
        name: 'adminmain',
        component: () => import('../components/Admin/Main.vue'),
        redirect: { name: 'admindashboard' },
        meta: { requiresAuth: true, requiresAdmin: true },

        children: [
            {
                path: '/AdminTermsOfUse',
                name: 'AdminTermsOfUse',
                component: () => import('../components/Admin/policy/AdminTermsOfUse.vue'),
                meta: { requiresAuth: true, requiresLeader: true },
            },
            {
                path: '/privacy_policy_',
                name: 'privacy_policy_',
                component: () => import('../components/Admin/policy/PrivacyPolicy.vue'),
                meta: { requiresAuth: true, requiresLeader: true },
            },
            {
                path: '',
                name: 'admindashboard',
                component: () => import('../components/Admin/ClubList.vue'),
            },
            {
                path: 'Notice',
                name: 'Notice',
                component: () => import('../components/Admin/notice.vue'),
            },
            {
                path: 'noticeclick/:id',
                name: 'AdminNoticeClick',
                component: AdminNoticeClick,
                props: true,
            },
            {
                path: 'AddClub',
                name: 'AddClub',
                component: () => import('../components/Admin/AddClub.vue'),
            },

            {
                path: 'noticeedit/:id',
                name: 'noticeedit',
                component: () => import('../components/Admin/NoticeEdit.vue'),
                props: true,
            },

            {
                path: 'noticewrite',
                name: 'noticewrite',
                component: () => import('../components/Admin/NoticeWrite.vue'),
                props: true,
            },
            {
                path: 'clublist',
                name: 'clublist',
                component: () => import('../components/Admin/ClubList.vue'),
                props: true,
            },
            {
                path: 'clubroom',
                name: 'clubroom',
                component: () => import('../components/Admin/ClubroomMapUpload.vue'),
                props: true,
            },
            {
                path: 'category',
                name: 'category',
                component: () => import('../components/Admin/AddCategory.vue'),
                props: true,
            },
        ]
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.isAuthenticated) {

            next({ name: 'login' });
        } else if (to.matched.some(record => record.meta.requiresAdmin)) {

            if (store.getters.role !== 'ADMIN') {
                next({ name: 'login' });
            } else {
                next();
            }
        } else if (to.matched.some(record => record.meta.requiresLeader)) {

            if (store.getters.role !== 'LEADER') {
                next({ name: 'login' });
            } else {
                next();
            }
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
