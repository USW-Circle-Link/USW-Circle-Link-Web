import { shallowMount } from '@vue/test-utils';
import CategoryManager from '@/components/Admin/AddCategory/AddCategory.vue';
import axios from 'axios';
import flushPromises from 'flush-promises';

// axios 모킹
jest.mock('axios');

describe('CategoryManager.vue', () => {
  let wrapper;

  const mockCategories = [
    { clubCategoryName: '운동', clubCategoryUUID: 'uuid-1' },
    { clubCategoryName: '개발', clubCategoryUUID: 'uuid-2' }
  ];

  beforeEach(async () => {
    axios.get.mockResolvedValue({ data: { data: mockCategories } });
    wrapper = shallowMount(CategoryManager, {
      global: {
        mocks: {
          $store: {
            state: {
              apiBaseUrl: 'https://api.donggurami.net',
              accessToken: 'test-token'
            }
          }
        }
      }
    });
      wrapper = shallowMount(CategoryManager, {
      global: {
        mocks: {
          $store: {
            state: {
              apiBaseUrl: 'https://api.donggurami.net',
              accessToken: 'test-token' 
            }
          }
        }
      }
    });
    await flushPromises();
  });

  it('컴포넌트가 렌더링된다', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('fetchCategory 호출 후 카테고리가 렌더링된다', () => {
    const items = wrapper.findAll('.category-item');
    expect(items).toHaveLength(2);
    expect(items[0].text()).toContain('운동');
  });

  it('카테고리 추가 시 axios POST 요청이 호출된다', async () => {
    wrapper.vm.categoryName = '새카테고리';
    axios.post.mockResolvedValue({
      data: { data: { clubCategoryUUID: 'uuid-3' } }
    });

    await wrapper.vm.addCategory();
    await flushPromises();

    expect(axios.post).toHaveBeenCalledWith(
    'https://api.donggurami.net/admin/clubs/category',
    '새카테고리',
    expect.any(Object)
        );

    expect(wrapper.vm.categories).toContain('새카테고리');
  });

  it('중복된 카테고리 추가 시 팝업 메시지가 뜬다', async () => {
    wrapper.vm.categoryName = '운동';
    await wrapper.vm.addCategory();
    expect(wrapper.vm.serverMessage).toBe('이미 존재하는 카테고리에요.');
    expect(wrapper.vm.showPopup).toBe(true);
  });
  it('카테고리 삭제 시 axios DELETE 요청이 호출된다', async () => {
  const category = '운동';
  const index = 0;

  await wrapper.vm.removeCategory(category, index);

  expect(axios.delete).toHaveBeenCalledWith(
    'https://api.donggurami.net/admin/clubs/category/uuid-1',
    expect.any(Object) // headers 포함 config 객체
  );

  expect(wrapper.vm.categories).not.toContain(category);
});
});


