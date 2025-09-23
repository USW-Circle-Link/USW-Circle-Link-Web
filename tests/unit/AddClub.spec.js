import { shallowMount } from '@vue/test-utils';
import AddClubForm from '@/components/Admin/AddClub/AddClub.vue';
import flushPromises from 'flush-promises';
import axios from 'axios';

jest.mock('axios');

describe('AddClubForm.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(AddClubForm, {
      global: {
        mocks: {
          $store: {
            state: {
              accessToken: 'mock-token',
              apiBaseUrl: 'https://api.donggurami.net'
            }
          }
        }
      }
    });
  });

  it('ID가 유효하지 않으면 에러 메시지를 표시한다', () => {
    wrapper.vm.id = '12'; // 너무 짧은 ID
    wrapper.vm.validateId();
    expect(wrapper.vm.idError).toContain('아이디는 5~20자');
    expect(wrapper.vm.formValidation.idValid).toBe(false);
  });

  it('유효한 ID는 에러가 없다', () => {
    wrapper.vm.id = 'validId123';
    wrapper.vm.validateId();
    expect(wrapper.vm.idError).toBe('');
    expect(wrapper.vm.formValidation.idValid).toBe(true);
  });

  it('비밀번호 형식이 틀리면 에러 메시지 표시', () => {
    wrapper.vm.password = 'weakpw';
    wrapper.vm.validatePassword();
    expect(wrapper.vm.passwordError).toContain('비밀번호는 영어, 숫자, 특수문자');
    expect(wrapper.vm.formValidation.passwordValid).toBe(false);
  });

  it('비밀번호 확인이 일치하지 않으면 에러 메시지 표시', () => {
    wrapper.vm.password = 'Test123!';
    wrapper.vm.confirmPassword = 'Different123!';
    wrapper.vm.isConfirmPasswordTouched = true;
    wrapper.vm.validateConfirmPassword();
    expect(wrapper.vm.confirmPasswordError).toContain('비밀번호가 일치하지 않습니다');
    expect(wrapper.vm.formValidation.passwordMatch).toBe(false);
  });

  it('동아리 이름이 공백 포함되면 유효성 실패', () => {
    wrapper.vm.clubName = '동아리 이름';
    wrapper.vm.validateClubName();
    expect(wrapper.vm.clubNameError).toContain('공백');
    expect(wrapper.vm.formValidation.clubNameValid).toBe(false);
  });

  it('분과를 선택하면 selectedOption과 departmentValid가 설정됨', () => {
    wrapper.vm.selectOption('학술');
    expect(wrapper.vm.selectedOption).toBe('학술');
    expect(wrapper.vm.formValidation.departmentValid).toBe(true);
  });

  it('"추가하기" 버튼 로직 조건 미충족 시 팝업 안 보임', () => {
    wrapper.vm.id = '';
    wrapper.vm.password = '';
    wrapper.vm.clubName = '';
    wrapper.vm.openPopup();
    expect(wrapper.vm.AddClubPopupVisible).toBe(false);
  });

  it('"추가하기" 조건 충족 시 팝업이 열린다', () => {
    wrapper.setData({
      id: 'validId',
      password: 'Test123!',
      confirmPassword: 'Test123!',
      clubName: '동아리',
      selectedOption: '학술',
      selectedRoom: '102',
      DuplicateCheckId: true,
      DuplicateCheckClubName: true,
      formValidation: {
        idValid: true,
        passwordValid: true,
        passwordMatch: true,
        clubNameValid: true,
        departmentValid: true,
        roomValid: true
      }
    });
    wrapper.vm.openPopup();
    expect(wrapper.vm.AddClubPopupVisible).toBe(true);
  });

  it('아이디 중복 확인 성공 시 팝업 메시지 출력', async () => {
    axios.get.mockResolvedValue({});
    wrapper.setData({ id: 'uniqueId' });
    await wrapper.vm.idDuplicateCheck();
    await flushPromises();
    expect(wrapper.vm.DuplicateCheckId).toBe(true);
    expect(wrapper.vm.showPopup).toBe(true);
  });
});
