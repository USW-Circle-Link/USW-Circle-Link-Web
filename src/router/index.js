import { createRouter, createWebHistory } from 'vue-router';
import NoticeClick from '../components/NoticeClick.vue';
import ProfileEdit from '../components/ProfileEdit.vue';

const routes = [
<<<<<<< HEAD
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
                path: 'new-page',
                name: 'new-page',
                component: () => import('../components/ClubInfo.vue'),
            }
        ]
    },
=======
  {
    path: '/',
    name: 'login',
    component: () => import('../components/login/Login.vue'),
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
>>>>>>> kim
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
