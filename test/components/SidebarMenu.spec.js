/* eslint-env jest */
import { shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import SidebarMenu from '@/components/ClubLeader/SidebarMenu.vue';
import axios from 'axios';
import flushPromises from 'flush-promises';

jest.mock('axios'); //avios 모듈 mocking
describe('SidebarMenu.vue', () => {
let store;
let state;
let actions;
let mutations;
let $router;
let originalCreateObjectURL;

beforeEach(() => {
    // URL.createObjectURL mock
    originalCreateObjectURL = global.URL.createObjectURL;
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url');




    //Vuex 상태
    state = {
    shouldUpdateSidebar: false,
    accessToken: 'test-token',
    clubUUID: 'test-uuid',
      apiBaseUrl: 'http://15.164.246.244:8080', // 실제 값과 일치시킴
    };
    actions = {
    logout: jest.fn(), //logout mocking함
    };
    mutations = {
    SET_SIDEBAR_UPDATE: jest.fn(), //muations mocking함
    };
    store = new Vuex.Store({
    state,
    actions,
    mutations,
    });
    store.dispatch = jest.fn(); //dispatch mocking
    store.commit = jest.fn(); //commit mocking
    $router = {
    push: jest.fn(() => Promise.resolve()),
    };
});

afterEach(() => {
    //원래대로 복원
    global.URL.createObjectURL = originalCreateObjectURL;
});


function mountWrapper(options = {}) {//컴포넌트 mount 헬퍼 함수
    return shallowMount(SidebarMenu, {
    global: {
        plugins: [store],
        mocks: { $router },
    },
    ...options,
    });
}

it('renders club name and department from API', async () => {
    const clubData = {
    data: {
        data: {
        clubName: 'Test Club', //이름 확인
        department: 'Test Department', //학과명 확인
        },
    },
    };
    axios.get.mockResolvedValueOnce(clubData); //결과 mocking
    const wrapper = mountWrapper();
    await flushPromises();//비동기 처리 완료 대기
    expect(wrapper.find('.profile-name h2').text()).toBe('Test Club');
    expect(wrapper.find('.profile-info p').text()).toBe('Test Department');
});

it('navigates to correct route on menu click', async () => {//클릭-> 올바르게 이동하는지 확인
    const wrapper = mountWrapper();
    await wrapper.vm.$nextTick();
    const homeMenu = wrapper.findAll('.top').at(0);
    await homeMenu.trigger('click');
    expect($router.push).toHaveBeenCalledWith({ name: 'dashboard' });
});

it('calls logout and navigates to login', async () => {//로그아웃 확인
    axios.post.mockResolvedValueOnce({});//성공 시 응답 mocking
    const wrapper = mountWrapper();
    await wrapper.vm.logout();
    expect(axios.post).toHaveBeenCalledWith(//로그아웃 메서드 실행
    'http://15.164.246.244:8080/integration/logout',
    {},
    expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
    })
    );
    expect(store.dispatch).toHaveBeenCalledWith('logout');
    expect($router.push).toHaveBeenCalledWith({ name: 'login' });
});

it('handles logout error gracefully', async () => {//로그아웃 실패 시 경고창 &강제 로그아웃
    axios.post.mockRejectedValueOnce(new Error('fail'));// 실패 응답 mocking
    const wrapper = mountWrapper();
    window.alert = jest.fn();
    await wrapper.vm.logout();
    expect(window.alert).toHaveBeenCalledWith('로그아웃 처리 중 오류가 발생했습니다.');
    expect(store.dispatch).toHaveBeenCalledWith('logout');
    expect($router.push).toHaveBeenCalledWith({ name: 'login' });
});

it('updates sidebar when shouldUpdateSidebar changes', async () => {//shouldUpdateSidebar true면 정보 갱신
    const clubData = {
    data: {
        data: {
        clubName: 'Test Club',
        department: 'Test Department',
        },
    },
    };
    axios.get.mockResolvedValue(clubData);// 클럽 정보 응답 mock
    const wrapper = mountWrapper();
    await wrapper.vm.$nextTick();
    wrapper.vm.$store.state.shouldUpdateSidebar = true;// 수동 변경
    await wrapper.vm.$options.watch.shouldUpdateSidebar.call(wrapper.vm, true);//watch 수동 호출
    expect(axios.get).toHaveBeenCalled();//get 호출 확인
    expect(store.commit).toHaveBeenCalledWith('SET_SIDEBAR_UPDATE', false);//상태 false로 초기화
});

it('sets imageSrc to blob url if mainPhotoUrl exists', async () => {//프로필 이미지 있다면 blob url로 변환되는지 확인
    const clubData = {
    data: {
        data: {
        clubName: 'Test Club',
        department: 'Test Department',
        mainPhotoUrl: 'http://image.url/test.png',
        },
    },
    };
    const blob = new Blob(['test'], { type: 'image/png' });//이미지 mock
    axios.get
      .mockResolvedValueOnce(clubData) // club info
      .mockResolvedValueOnce({ data: blob }); // image blob
    const wrapper = mountWrapper();
    await flushPromises();
    expect(wrapper.vm.imageSrc).toContain('blob:');
});
}); 