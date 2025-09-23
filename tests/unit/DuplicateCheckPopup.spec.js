import { shallowMount } from '@vue/test-utils';
import AddCategoryPopup from '@/components/Admin/AddClub/DuplicateCheckPopup.vue';

describe('AddCategoryPopup.vue', () => {
  it('serverMessage를 화면에 렌더링한다', () => {
    const wrapper = shallowMount(AddCategoryPopup, {
      props: {
        serverMessage: '사용 가능한 아이디입니다.'
      }
    });

    expect(wrapper.text()).toContain('사용 가능한 아이디입니다.');
  });

  it('아이디 중복 확인 성공 시 "close" 이벤트가 index=true와 함께 발생한다', async () => {
    const wrapper = shallowMount(AddCategoryPopup, {
      props: {
        serverMessage: '사용 가능한 아이디입니다.'
      }
    });

    await wrapper.find('.confirm-button').trigger('click');

    expect(wrapper.emitted().close).toBeTruthy();
    expect(wrapper.emitted().close[0]).toEqual(['* 중복확인 완료', true]);
  });

  it('동아리 이름 중복 확인 성공 시 "close" 이벤트가 index=false와 함께 발생한다', async () => {
    const wrapper = shallowMount(AddCategoryPopup, {
      props: {
        serverMessage: '사용 가능한 동아리 이름입니다.'
      }
    });

    await wrapper.find('.confirm-button').trigger('click');

    expect(wrapper.emitted().close).toBeTruthy();
    expect(wrapper.emitted().close[0]).toEqual(['* 중복확인 완료', false]);
  });
});
