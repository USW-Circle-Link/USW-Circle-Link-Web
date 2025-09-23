import { shallowMount } from '@vue/test-utils';
import ClubroomMapManager from '@/components/Admin/ClubroomMapUpload/ClubroomMapUpload.vue';
import axios from 'axios';
import flushPromises from 'flush-promises';

jest.mock('axios');

describe('ClubroomMapManager.vue', () => {
  let wrapper;

  beforeEach(async () => {
    axios.get.mockResolvedValue({ data: { data: { presignedUrl: 'https://example.com/floor.jpg' } } });

    wrapper = shallowMount(ClubroomMapManager, {
      global: {
        mocks: {
          $store: {
            state: {
              apiBaseUrl: 'https://api.donggurami.net',
              accessToken: 'mock-token'
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

  it('created 시 fetchImages가 호출되고 이미지가 설정된다', () => {
    expect(wrapper.vm.floorData.B1.imageSrc).toBe('https://example.com/floor.jpg');
  });

  it('이미지 삭제(markImageForDeletion) 시 해당 층 이미지와 파일이 null이 된다', () => {
    wrapper.vm.floorData.B1.imageSrc = 'test.jpg';
    wrapper.vm.floorData.B1.file = new File([''], 'test.jpg');
    wrapper.vm.markImageForDeletion('B1');
    expect(wrapper.vm.floorData.B1.imageSrc).toBe(null);
    expect(wrapper.vm.floorData.B1.file).toBe(null);
  });

  it('이미지 확대(enlargeImage) 호출 시 enlargedImage가 설정된다', () => {
    wrapper.vm.enlargeImage('sample.jpg');
    expect(wrapper.vm.enlargedImage).toBe('sample.jpg');
  });

  it('closeModal 호출 시 enlargedImage가 null이 된다', () => {
    wrapper.vm.enlargedImage = 'sample.jpg';
    wrapper.vm.closeModal();
    expect(wrapper.vm.enlargedImage).toBe(null);
  });

  it('showIcons 호출 시 showingIcon이 true/false로 설정된다', () => {
    wrapper.vm.showIcons('F1', true);
    expect(wrapper.vm.floorData.F1.showingIcon).toBe(true);
    wrapper.vm.showIcons('F1', false);
    expect(wrapper.vm.floorData.F1.showingIcon).toBe(false);
  });
});
