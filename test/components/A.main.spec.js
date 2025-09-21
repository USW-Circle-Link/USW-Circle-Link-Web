/* eslint-env jest */
import { shallowMount } from '@vue/test-utils';
import Main from '@/components/Admin/Main.vue';

describe('Admin Main.vue', () => {
  let originalInnerWidth;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;//테스트 전 저장
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;// 테스트 후 너비 돌려두기
  });

  function setWindowWidth(width) {
    window.innerWidth = width;
    window.dispatchEvent(new Event('resize'));
  }

  it('renders HeadBar and SidebarMenu', async () => {
    setWindowWidth(1400);//이 넓이면 해당 설정
    const wrapper = shallowMount(Main, {
      global: {
        stubs: {
          routerView: true,
          transition: false,
          HeadBar: true,
          SidebarMenu: true
        }
      }
    });
    await wrapper.vm.$nextTick();// DOM 업데이트 대기
    expect(wrapper.findComponent({ name: 'HeadBar' }).exists()).toBe(true); //존재 확인
    expect(wrapper.findComponent({ name: 'SidebarMenu' }).exists()).toBe(true);//존재 확인
  });

  it('shows sidebar by default on wide screens', () => {
    setWindowWidth(1400);
    const wrapper = shallowMount(Main, {
      global: {
        stubs: {
          routerView: true,
          transition: false,
          HeadBar: true,
          SidebarMenu: true
        }
      }
    });
    expect(wrapper.vm.showSidebar).toBe(true);
    expect(wrapper.findComponent({ name: 'SidebarMenu' }).exists()).toBe(true);
  });

  it('hides sidebar on small screens', async () => {
    setWindowWidth(1200); //이 넓이면
    const wrapper = shallowMount(Main, {
      global: {
        stubs: {
          routerView: true,
          transition: false,
          HeadBar: true,
          SidebarMenu: true
        }
      }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showSidebar).toBe(false);// 사이드바 숨기기 확인
    expect(wrapper.findComponent({ name: 'SidebarMenu' }).exists()).toBe(false);
  });

  it('toggles sidebar visibility on window resize', async () => {// 크기 변경에 따라 반응형이 되는지
    setWindowWidth(1400);
    const wrapper = shallowMount(Main, {
      global: {
        stubs: {
          routerView: true,
          transition: false,
          HeadBar: true,
          SidebarMenu: true
        }
      }
    });
    setWindowWidth(1200);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showSidebar).toBe(false);
    setWindowWidth(1400);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showSidebar).toBe(true);
  });
});
