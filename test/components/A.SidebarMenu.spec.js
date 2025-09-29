/* eslint-env jest */
import { shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import SidebarMenu from '@/components/Admin/SidebarMenu.vue';
import axios from 'axios';

jest.mock('axios');//axios mocking

describe('Admin SidebarMenu.vue', () => {
let store;
let state;
let actions;
let mutations;
let $router;

beforeEach(() => {
  //상태 정의
    state = {
    accessToken: 'test-token',
    apiBaseUrl: 'http://localhost', //테스트용
    };
    actions = {
      logout: jest.fn(), //logout mocking
    };
    mutations = {};
    store = new Vuex.Store({
      state,
      actions,
      mutations,
    });
    store.dispatch = jest.fn(); //dispatch 호출 여부 추적
    $router = {
      push: jest.fn(() => Promise.resolve()),//push mocking
    };
  });

  function mountWrapper(options = {}) {//컴포넌트를 mount 하는 헬퍼 수
    return shallowMount(SidebarMenu, {
      global: {
        plugins: [store],
        mocks: { $router },
      },
      ...options,
    });
  }

  it('renders club name', () => {// 사이드바 상단에 운영팀 표시되는지
    const wrapper = mountWrapper();
    expect(wrapper.find('.profile-name h2').text()).toBe('운영팀');
  });

  it('navigates to correct route on menu click', async () => {//메뉴 클릭 시 장상 이동하는지
    const wrapper = mountWrapper();
    const clubListMenu = wrapper.findAll('.top').at(0);
    await clubListMenu.trigger('click');
    expect($router.push).toHaveBeenCalledWith({ name: 'clublist' });
  });

  it('calls logout and navigates to login', async () => {//로그아웃 발생 시 api 호출 및 로그인 페이지로 가는지
    axios.post.mockResolvedValueOnce({});//로그아웃 api mocking
    const wrapper = mountWrapper();
    await wrapper.vm.logout();//logout 실행
    expect(axios.post).toHaveBeenCalledWith(
      'http://15.164.246.244:8080/integration/logout',//실제 로그아웃 api
      {},
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      })
    );
    expect(store.dispatch).toHaveBeenCalledWith('logout');
    expect($router.push).toHaveBeenCalledWith({ name: 'login' });//로그인 페이지로
  });

  it('handles logout error gracefully', async () => {//로그아웃 실패 시 alert 발생 & 강제 수행 여부 확인
    axios.post.mockRejectedValueOnce(new Error('fail'));//에러
    const wrapper = mountWrapper();
    window.alert = jest.fn();
    await wrapper.vm.logout();//로그아웃 시도
    expect(window.alert).toHaveBeenCalledWith('로그아웃 처리 중 오류가 발생했습니다.');
    expect(store.dispatch).toHaveBeenCalledWith('logout');// 강제 처리
    expect($router.push).toHaveBeenCalledWith({ name: 'login' });
  });

  it('footer links highlight selectedLink', async () => {// navigateTo 호출 시 footer 메뉴가 selectedLink로 설정되는지
    const wrapper = mountWrapper();
    await wrapper.vm.navigateTo('AdminTermsOfUse');
    expect(wrapper.vm.selectedLink).toBe('AdminTermsOfUse');
    await wrapper.vm.navigateTo('privacy_policy_');
    expect(wrapper.vm.selectedLink).toBe('privacy_policy_');
  });
});
