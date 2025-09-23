import { mount, flushPromises } from '@vue/test-utils';
import CategoryModal from '@/components/ClubLeader/ClubInfoRewrite/CategoryModal.vue';
import axios from 'axios';
import store from '@/store/store';

jest.mock('axios');

describe('CategoryModal.vue', () => {
  const mockCategories = [
    { clubCategoryId: 1, clubCategoryName: '운동' },
    { clubCategoryId: 2, clubCategoryName: '개발' },
    { clubCategoryId: 3, clubCategoryName: '음악' },
    { clubCategoryId: 4, clubCategoryName: '사진' }
  ];

  let wrapper;

  const createWrapper = async (customOptions = {}) => {
    axios.get.mockResolvedValue({ data: { data: mockCategories } });

    wrapper = mount(CategoryModal, {
      props: {
        isOpen: true,
        currentSelected: [],
        ...customOptions.props
      },
      global: {
        stubs: ['transition']
      }
    });

    await wrapper.vm.fetchCategories();
    await flushPromises();
  };

  beforeEach(async () => {
    store.state.accessToken = 'test-token';
    store.state.apiBaseUrl = 'https://api.test.com';
    await createWrapper();
  });

  it('카테고리를 성공적으로 불러온다', () => {
    expect(wrapper.vm.categories.length).toBe(4);
    expect(wrapper.html()).toContain('운동');
  });

  it('카테고리를 클릭하면 선택된다', async () => {
    const buttons = wrapper.findAll('.category-button');
    expect(buttons.length).toBeGreaterThan(0);

    await buttons[0].trigger('click');
    const emitted = wrapper.emitted('select');
    expect(emitted).toBeTruthy();
    expect(emitted[0][0]).toContainEqual(mockCategories[0]);
  });

  it('카테고리는 최대 3개까지만 선택할 수 있다', async () => {
    await wrapper.setProps({
      currentSelected: mockCategories.slice(0, 3)
    });
    await flushPromises();

    const buttons = wrapper.findAll('.category-button');
    expect(buttons[3].attributes('disabled')).toBeDefined(); // '사진'은 비활성화
  });

  it('에러 발생 시 에러 메시지를 표시한다', async () => {
  // axios.get은 실패하도록 설정
  axios.get.mockReset(); // 이전 설정 제거
  axios.get.mockRejectedValueOnce(new Error('API 실패'));

  const wrapper = mount(CategoryModal, {
    props: {
      isOpen: true,
      currentSelected: []
    },
    global: {
      stubs: ['transition']
    }
  });

  await flushPromises();

  // 실제 화면 텍스트 확인
  expect(wrapper.text()).toContain('카테고리를 불러오는데 실패했습니다');
});



  it('닫기 버튼을 누르면 close 이벤트가 발생한다', async () => {
    await wrapper.find('.close-button').trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('추가하기 버튼 클릭 시 선택된 카테고리가 emit된다', async () => {
    await wrapper.setData({
      selectedCategories: mockCategories.slice(0, 2)
    });
    await wrapper.find('.select-button').trigger('click');

    const emitted = wrapper.emitted('select');
    expect(emitted).toBeTruthy();
    expect(emitted[0][0].length).toBe(2);
  });
});
