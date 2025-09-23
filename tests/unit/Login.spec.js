// Login.vue 컴포넌트를 테스트하기 위한 유닛 테스트 파일

import { shallowMount } from '@vue/test-utils';
import Login from '@/components/Login/Login.vue';
import axios from 'axios';

// axios 요청을 모킹 (실제 네트워크 요청 방지)
jest.mock('axios');

// Vuex store 및 router의 dispatch, push 함수를 모킹
const mockDispatch = jest.fn();
const mockPush = jest.fn();

// 테스트 환경에서 사용할 글로벌 mock 객체 설정
const globalMocks = {
  $store: {
    dispatch: mockDispatch,
    state: {
      // 실제 요청을 보내는 URL을 테스트용으로 대체
      apiBaseUrl: 'https://api.donggurami.net'
    }
  },
  $router: {
    push: mockPush
  }
};

describe('Login.vue', () => {
  let wrapper;

  // 각 테스트 전에 새로운 wrapper를 생성하고 모의 함수 초기화
  beforeEach(() => {
    wrapper = shallowMount(Login, {
      global: {
        mocks: globalMocks
      }
    });
    jest.clearAllMocks();
  });

  // [TEST 1] 아이디와 비밀번호 입력값이 v-model과 바인딩되는지 확인
  it('아이디와 비밀번호 입력값이 데이터와 바인딩된다', async () => {
    const idInput = wrapper.find('#id-input');
    await idInput.setValue('testUser');
    expect(wrapper.vm.id).toBe('testUser');

    const pwInput = wrapper.find('#password-input');
    await pwInput.setValue('testPass');
    expect(wrapper.vm.password).toBe('testPass');
  });

  // [TEST 2] 드롭다운에서 로그인 타입 선택 시 selectedOption 값이 변경되는지 확인
  it('드롭다운에서 로그인 타입을 선택하면 데이터가 변경된다', async () => {
    expect(wrapper.vm.selectedOption).toBe('동아리 관리자');

    wrapper.vm.selectOption('동아리 연합회 / 개발팀');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.selectedOption).toBe('동아리 연합회 / 개발팀');
  });

  // [TEST 3] 입력값 검증 함수가 SQL 키워드나 공백을 포함하면 false를 반환하는지 확인
  it('입력값 검증에서 SQL 키워드 또는 공백이 포함되면 false를 반환한다', () => {
    expect(wrapper.vm.validateInput('validUser')).toBe(true);
    expect(wrapper.vm.validateInput('invalid select')).toBe(false);
    expect(wrapper.vm.validateInput('hello world')).toBe(false);
  });

  // [TEST 4] 잘못된 입력값이면 alert가 호출되는지 확인
  it('validateInput 실패 시 login 함수에서 alert가 호출된다', async () => {
    window.alert = jest.fn(); // alert 모킹

    wrapper.setData({ id: 'invalid select', password: 'pass' });
    await wrapper.vm.login();

    expect(window.alert).toHaveBeenCalledWith('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
  });

  // [TEST 5] 정상 로그인 시 axios 요청, store 저장, router 이동이 제대로 수행되는지 확인
  it('정상 로그인(동아리 관리자) 시 API 요청 후 store에 저장하고 메인 페이지로 이동한다', async () => {
    axios.post.mockResolvedValue({
      data: {
        message: '로그인 성공',
        data: {
          accessToken: 'token',
          refreshToken: 'refresh',
          role: 'LEADER',
          clubUUID: 'uuid123',
          isAgreedTerms: true
        }
      }
    });

    wrapper.setData({ id: 'leader', password: 'pass', selectedOption: '동아리 관리자' });
    await wrapper.vm.login();

    // axios 요청이 예상한 URL과 body로 호출되었는지 확인
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/club-leader/login'),
      expect.any(Object)
    );

    // Vuex store에 인증 정보 저장이 잘 수행되었는지 확인
    expect(mockDispatch).toHaveBeenCalledWith('setAuthData', expect.objectContaining({
      accessToken: 'token',
      role: 'LEADER'
    }));

    // 로그인 후 main 페이지로 라우팅이 수행되었는지 확인
    expect(mockPush).toHaveBeenCalledWith({
      name: 'main',
      props: { isAgreedTerms: true }
    });
  });

  // [TEST 6] 로그인 실패 시 실패 메시지 팝업이 표시되는지 확인
  it('로그인 실패 시 실패 메시지 팝업이 뜬다', async () => {
    // 서버에서 로그인 실패 응답을 시뮬레이션
    axios.post.mockRejectedValue({
      response: {
        data: {
          code: 'USR-211'
        }
      }
    });

    wrapper.setData({ id: 'user', password: 'wrongPass', selectedOption: '동아리 관리자' });
    await wrapper.vm.login();

    // 실패 팝업이 뜨는지 및 메시지 일치 여부 확인
    expect(wrapper.vm.showFailurePopup).toBe(true);
    expect(wrapper.vm.failureMessage).toBe('아이디 또는 비밀번호가 일치하지 않습니다.');
  });
});
