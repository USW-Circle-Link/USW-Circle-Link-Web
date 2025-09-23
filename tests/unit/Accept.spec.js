import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import axios from 'axios';
import MemberRequestManager from '@/components/ClubLeader/Accept/Accept.vue';
import store from '@/store/store';

jest.mock('axios');

describe('MemberRequestManager.vue', () => {
  let wrapper;

  const mockRequestedMembers = [
  {
    clubMemberAccountStatusUUID: 'uuid-1',
    profileTempName: '홍길동',
    profileTempStudentNumber: '20220001',
    profileTempMajor: '컴퓨터공학과',
    profileTempHp: '010-1234-5678'
  }
];

const mockAddedMembers = [
  {
    clubMemberUUID: 'uuid-2',
    userName: '이순신',
    studentNumber: '20220002',
    major: '소프트웨어학과',
    userHp: '010-5678-1234'
  }
];


  beforeEach(async () => {
    // 상태 초기화
    store.state.accessToken = 'test-token';
    store.state.clubUUID = 'club-uuid';
    store.state.apiBaseUrl = 'https://api.test.com';

    axios.get.mockReset();
    axios.post.mockReset();

    axios.get
      .mockResolvedValueOnce({ data: { data: mockRequestedMembers } }) // sign-up
      .mockResolvedValueOnce({ data: { data: mockAddedMembers } });    // non-member

    wrapper = shallowMount(MemberRequestManager, {
      global: {
        stubs: ['Popup', 'Popup401']
      }
    });

    await flushPromises();
  });

  it('요청 목록이 렌더링된다', () => {
    expect(wrapper.text()).toContain('요청 인원: 1명');
    expect(wrapper.text()).toContain('홍길동');
  });

  it('비회원 목록이 렌더링된다', () => {
    expect(wrapper.text()).toContain('비회원: 1 명');
    expect(wrapper.text()).toContain('이순신');
  });

  it('요청 회원을 클릭하면 선택된다', async () => {
    const requestItems = wrapper.findAll('.request-item');
    await requestItems[0].trigger('click');
    expect(wrapper.vm.selectedRequestedMembers).toContain(0);
  });

  it('수락 버튼은 요청과 비회원이 선택되어야 활성화된다', async () => {
    expect(wrapper.find('.accept-button').attributes('disabled')).toBeDefined();

    await wrapper.setData({
      selectedRequestedMembers: [0],
      selectedAddedMembers: [0]
    });

    await flushPromises();

    expect(wrapper.find('.accept-button').attributes('disabled')).toBeUndefined();
  });

  it('회원 수정 버튼 클릭 시 편집 모드로 진입한다', async () => {
    const editButton = wrapper.find('.edit-button');
    await editButton.trigger('click');
    expect(wrapper.vm.editingIndex).toBe(0);
    expect(wrapper.find('.save-button').exists()).toBe(true);
  });

  it('회원 요청 수락 시 API 호출된다', async () => {
  axios.post.mockResolvedValue({
    data: {
      message: "기존 동아리 회원 가입 요청 수락 완료"
    }
  });

  // 수동으로 데이터 주입
  await wrapper.setData({
    requestedMembers: [{
      clubMemberAccountStatusUUID: 'uuid-1',
      name: '홍길동',
      studentId: '20220001',
      department: '컴퓨터공학과',
      phone: '010-1234-5678',
      rejected: false
    }],
    addedMembers: [{
      clubMemberUUID: 'uuid-2',
      name: '이순신',
      studentId: '20220002',
      department: '소프트웨어학과',
      phone: '010-5678-1234',
      college: 'IT대학'
    }],
    selectedRequestedMembers: [0],
    selectedAddedMembers: [0]
  });

  await wrapper.vm.confirmAccept();
  await flushPromises();

  expect(wrapper.vm.showConfirmationPopup).toBe(true);
  expect(axios.post).toHaveBeenCalled();
});

});
