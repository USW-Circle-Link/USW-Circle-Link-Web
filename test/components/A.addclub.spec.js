/* eslint-env jest */
import { shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import AddClub from '@/components/Admin/AddClub.vue';
import axios from 'axios';
import flushPromises from 'flush-promises';

jest.mock('axios'); //axios mocking

describe('Admin AddClub.vue', () => {
  let store;
  let state;
  let $router;

  beforeEach(() => {
    //상태 정의
    state = {
      accessToken: 'test-token',
      apiBaseUrl: 'http://15.164.246.244:8080', // 실제 주소
    };
    store = new Vuex.Store({ state });
    store.state.accessToken = 'test-token'; // 명확히 지정
    $router = {
      push: jest.fn(() => Promise.resolve()),
    };
    window.alert = jest.fn();//alet 함수 mock
  });

  function mountWrapper(options = {}) {
    return shallowMount(AddClub, {
      global: {
        plugins: [store],
        mocks: { $router },
      },
      ...options,
    });
  }

  it('renders form and title', () => {//타이틀 폼 있는지
    const wrapper = mountWrapper();
    expect(wrapper.find('.title').text()).toContain('동아리 추가');
    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('shows id validation error for invalid id', async () => {// 아이디 적절하게 했는지 (너무 짧으면 오류)
    const wrapper = mountWrapper();
    const idInput = wrapper.find('#id');
    await idInput.setValue('ab');
    await idInput.trigger('input');
    expect(wrapper.text()).toContain('아이디는 5~20자 이내의 숫자와 문자만 입력 가능합니다.');
  });

  it('shows password validation error for invalid password', async () => {//비번 적절하게 했는지
    const wrapper = mountWrapper();
    const pwInput = wrapper.find('#password');
    await pwInput.setValue('12');
    await pwInput.trigger('input');
    expect(wrapper.text()).toContain('비밀번호는 5~20자 이내의 숫자, 문자, 특수문자만 입력 가능합니다.');
  });

  it('shows clubName validation error for long name', async () => {//동아리 이름 적절하게 했는지 , 오류 시 오류 메시지 출력
    const wrapper = mountWrapper();
    const clubNameInput = wrapper.find('#clubName');
    await clubNameInput.setValue('12345678901');
    await clubNameInput.trigger('input');
    expect(wrapper.text()).toContain('동아리명은 10자 이내로 입력해야 합니다.');
  });

  it('shows popup when popupbtn is clicked', async () => {// 팝업 버튼 누르면 나오는지
    const wrapper = mountWrapper();
    await wrapper.find('.popupbtn').trigger('click');
    expect(wrapper.vm.isPopupVisible).toBe(true);
    expect(wrapper.find('.popup-overlay').exists()).toBe(true);
  });

  it('hides popup when cancelDelete is called', async () => {// 취소 시 팝업 닫히는지
    const wrapper = mountWrapper();
    await wrapper.find('.popupbtn').trigger('click');
    await wrapper.vm.cancelDelete();
    expect(wrapper.vm.isPopupVisible).toBe(false);
  });

  it('alerts if password and confirmPassword do not match', async () => {//비밀번호 오류 시 alert 출력
    const wrapper = mountWrapper();
    wrapper.setData({
      id: 'validid',
      password: 'pw12345',
      confirmPassword: 'pw54321',
      clubName: '동아리',
      department: 'ART',
      adminPw: 'adminpw',
      isPopupVisible: true,
    });
    await wrapper.vm.submitForm();
    expect(window.alert).toHaveBeenCalledWith('비밀번호가 일치하지 않습니다.');
  });

  it('alerts if there are validation errors', async () => {// 입력값 오류 시 alert 출력
    const wrapper = mountWrapper();
    wrapper.setData({
      id: 'ab',
      password: 'pw',
      confirmPassword: 'pw',
      clubName: '동아리',
      department: 'ART',
      adminPw: 'adminpw',
      idError: 'err',
      isPopupVisible: true,
    });
    await wrapper.vm.submitForm();
    expect(window.alert).toHaveBeenCalledWith('입력값을 확인해 주세요.');
  });

  it('submits form and navigates on success', async () => {// 폼 제출 성공 시 alert 출력 및 culblist 페이지로 이동
    axios.post.mockResolvedValueOnce({});
    const wrapper = mountWrapper();
    wrapper.setData({
      id: 'validid',
      password: 'pw12345',
      confirmPassword: 'pw12345',
      clubName: '동아리',
      department: 'ART',
      adminPw: 'adminpw',
      isPopupVisible: true,
    });
    await wrapper.vm.submitForm();
    await flushPromises();// 비동기 퍼리 대기
    expect(axios.post).toHaveBeenCalledWith(
      'http://15.164.246.244:8080/admin/clubs',
      expect.objectContaining({ leaderAccount: 'validid' }),
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: expect.stringContaining('Bearer') }) })
    );
    expect(window.alert).toHaveBeenCalledWith('성공적으로 추가했습니다.');
    expect($router.push).toHaveBeenCalledWith({ name: 'clublist' });
    expect(wrapper.vm.isPopupVisible).toBe(false);
  });

  it('handles 400 error (wrong admin pw)', async () => { // 관리자 비밀번호 오류 (400) 응답
    axios.post.mockRejectedValueOnce({ response: { status: 400 } });
    const wrapper = mountWrapper();
    wrapper.setData({
      id: 'validid',
      password: 'pw12345',
      confirmPassword: 'pw12345',
      clubName: '동아리',
      department: 'ART',
      adminPw: 'adminpw',
      isPopupVisible: true,
    });
    await wrapper.vm.submitForm();
    await flushPromises();
    expect(window.alert).toHaveBeenCalledWith('동아리 추가에 실패했습니다. 관리자 비밀번호가 틀렸습니다.');
    expect(wrapper.vm.isPopupVisible).toBe(false);
  });

  it('handles 409 error (duplicate club)', async () => {// 중복된 동알 (409) 응답
    axios.post.mockRejectedValueOnce({ response: { status: 409 } });
    const wrapper = mountWrapper();
    wrapper.setData({
      id: 'validid',
      password: 'pw12345',
      confirmPassword: 'pw12345',
      clubName: '동아리',
      department: 'ART',
      adminPw: 'adminpw',
      isPopupVisible: true,
    });
    await wrapper.vm.submitForm();
    await flushPromises();
    expect(window.alert).toHaveBeenCalledWith('동아리 추가에 실패했습니다. 이미 존재하는 동아리 입니다.');
    expect(wrapper.vm.isPopupVisible).toBe(false);
  });

  it('handles 422 error (duplicate leader id)', async () => {// 중복된 회장 아이디 (422) 응답
    axios.post.mockRejectedValueOnce({ response: { status: 422 } });
    const wrapper = mountWrapper();
    wrapper.setData({
      id: 'validid',
      password: 'pw12345',
      confirmPassword: 'pw12345',
      clubName: '동아리',
      department: 'ART',
      adminPw: 'adminpw',
      isPopupVisible: true,
    });
    await wrapper.vm.submitForm();
    await flushPromises();
    expect(window.alert).toHaveBeenCalledWith('동아리 추가에 실패했습니다. 이미 존재하는 동아리 회장 아이디 입니다.');
    expect(wrapper.vm.isPopupVisible).toBe(false);
  });
});
