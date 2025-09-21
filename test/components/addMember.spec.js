/* eslint-env jest */
import { shallowMount } from '@vue/test-utils';
import addMember from '@/components/ClubLeader/addMember.vue';
import axios from 'axios';
import flushPromises from 'flush-promises';

jest.mock('axios');//axios 비동기 호출 mocking

describe('addMember.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(addMember, {
      global: {
        stubs: ['Popup401']//팝업 컴포넌트 stub처리
      }
    });
    window.alert = jest.fn();//alert mocking
  });

  afterEach(() => {
    jest.clearAllMocks();//mock 초기화
  });

  it('renders title and buttons', () => {//제목 버튼 정상적인지 확인
    expect(wrapper.find('h2').text()).toContain('엑셀 파일로 추가할 동아리 회원 정보');
    expect(wrapper.find('.download-btn').exists()).toBe(true);
    expect(wrapper.find('.upload-btn').exists()).toBe(true);
  });

  it('triggers file input on upload button click', async () => {//업로드 시 input 클릭 되는지
    const fileInput = wrapper.find('input[type="file"]');
    const clickSpy = jest.spyOn(fileInput.element, 'click');
    await wrapper.find('.upload-btn').trigger('click');
    expect(clickSpy).toHaveBeenCalled();
  });

  it('downloads excel template on download button click', async () => {//다운로드 버튼 클릭 시 템플릿 다운로드 동작 수행되는지
    const createElementSpy = jest.spyOn(document, 'createElement');
    const clickMock = jest.fn();
    createElementSpy.mockReturnValue({ click: clickMock, setAttribute: jest.fn(), href: '', download: '' });
    await wrapper.find('.download-btn').trigger('click');
    expect(createElementSpy).toHaveBeenCalledWith('a');
    createElementSpy.mockRestore();
  });

  it('shows member list after successful file upload', async () => {//파일 업로드 시 회원 리스트가 보여지는지
    const fakeFile = new File(['dummy'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const event = { target: { files: [fakeFile] } };
    axios.post.mockResolvedValueOnce({
      data: {
        data: {
          addClubMembers: [{ userName: '홍길동', studentNumber: '20230001', userHp: '01012345678', department: '', major: '', departments: [], errorMessage: '' }],
          duplicateClubMembers: []
        }
      }
    });
    await wrapper.vm.handleFileUpload(event);
    await flushPromises();
    expect(wrapper.vm.members.length).toBe(1);
    expect(wrapper.vm.visible).toBe(true);// 리스트 보여야 함
    expect(wrapper.find('.member-list').exists()).toBe(true);
  });

  it('shows overlapping popup if duplicateClubMembers exist', async () => {// 중복 회원 잇을 시 중복 팝업 뜨는지
    const fakeFile = new File(['dummy'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const event = { target: { files: [fakeFile] } };
    axios.post.mockResolvedValueOnce({
      data: {
        data: {
          addClubMembers: [{ userName: '홍길동', studentNumber: '20230001', userHp: '01012345678', department: '', major: '', departments: [], errorMessage: '' }],
          duplicateClubMembers: [{ userName: '김철수', studentNumber: '20230002', userHp: '01087654321' }]
        }
      }
    });
    await wrapper.vm.handleFileUpload(event);
    await flushPromises();
    expect(wrapper.vm.isOverlappingMemberListsPopupVisible).toBe(true);
    expect(wrapper.find('.popup-overlay1').exists()).toBe(true);
  });

  it('clears member list when clearList is called', () => { //멤버리스트 지우면 지워지는지
    wrapper.setData({ members: [{ userName: '홍길동' }] });
    wrapper.vm.clearList();
    expect(wrapper.vm.members.length).toBe(0);
  });

  it('shows select department popup if any member has empty major on submit', () => {//major비어있는 경우 전공 선택 파업 뜨는지
    wrapper.setData({ members: [{ userName: '홍길동', major: '' }], visible: true });
    wrapper.vm.submitMembers();
    expect(wrapper.vm.isSelectDepartmentPopupVisible).toBe(true);
  });

  it('shows confirm popup if all members have major on submit', () => { //모든 멤버 전공 선택 시 확인 팝업 뜨는지
    wrapper.setData({ members: [{ userName: '홍길동', major: '컴퓨터공학과' }], visible: true });
    wrapper.vm.submitMembers();
    expect(wrapper.vm.isPopupVisible).toBe(true);
  });

  it('shows edit confirm popup when confirmEdit is called and input is valid', () => {//정보가 유효할 경우 확인 팝업 뜨는지
    wrapper.setData({
      editingIndex: 0,
      editingMember: { userName: '홍길동', studentNumber: '20230001', userHp: '01012345678' },
      members: [{ userName: '홍길동', studentNumber: '20230001', userHp: '01012345678', major: '컴퓨터공학과' }]
    });
    wrapper.vm.confirmEdit(0);
    expect(wrapper.vm.showEditConfirmPopup).toBe(true);
  });

  it('shows error popup if handleFileUpload fails with 401', async () => { //401 에러 발생 시 해당 팝업 뜨는지
    axios.post.mockRejectedValueOnce({ response: { status: 401 } });
    const fakeFile = new File(['dummy'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const event = { target: { files: [fakeFile] } };
    await wrapper.vm.handleFileUpload(event);
    await flushPromises();
    expect(wrapper.vm.show401Popup).toBe(true);
  });
});
