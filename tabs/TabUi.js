import UI from '../UI.js';
import { getElement } from '../Function.js';
// import {scrollTo, wrapInnerScroll} from './simple.ui';

class Tab extends UI {
   defaults = {
       scroll: false
   }
   currentTarget = null;
   tabBtns = null;
   targetTabWrap = null;
   targetTabListWrap = null;
   targetPanelWrap = null;

   constructor(el, options){
       super('Tab', el);
       
       this.init(el, options);
   }
    
   init(el, options){
      this.el = el;
      this.tabBtns = this.el.querySelectorAll('[role="tab"]');
      this.defaults = {...this.defaults, ...this.parseOptions(options)};
       
      this.render();
   }
    
   update(){
   }
    
   render(){
       this.detachEvents();
       this.attachEvents();
   }
    
   attachEvents(){
      [...this.tabBtns].forEach((tabBtn) => {
         tabBtn.addEventListener('click', this.tabClickEvt.bind(this));
         tabBtn.addEventListener('keyup', this.tabKeyUpEvt.bind(this));
      })
   }

   // 이벤트 타겟 변수 설정
   initEvt(e) {
      console.log('target', e.target);
      this.currentTarget = e.target.tagName;
      this.currentTarget === 'BUTTON' || 'A'
        ? (this.currentTarget = e.target)
        : (this.currentTarget = e.target.closest('button') || e.target.closest('a'));
      this.targetTabWrap = this.currentTarget.closest('[data-role="tab"]');
      this.targetTabListWrap = this.targetTabWrap.querySelector('[role="tablist"]');
      this.targetPanelWrap = this.targetTabWrap.querySelector('.ui-tab-contents');  
   }

   // 클릭 이벤트
   tabClickEvt(e){
      this.initEvt(e);
      if(this.currentTarget.ariaSelected === 'false'){
         // 미선택된 탭 속성 false 상태로 만들기
         this.tabRemoveEvt(this.targetTabListWrap, this.targetPanelWrap);
         // 선택 된 탭 속성 true 상태로 만들기
         this.tabAddEvt(this.currentTarget, this.targetTabWrap);
      }
   }

   // 키보드 접근 이벤트
   tabKeyUpEvt(e) {
      this.initEvt(e);
      const targetBtnWrap = this.currentTarget.parentElement;
      if (e.key == 'ArrowRight') {
         // 키보드 -> 화살표를 눌렀을 때
         if (targetBtnWrap.nextElementSibling) {
            targetBtnWrap.nextElementSibling.children[0].focus();
            this.tabRemoveEvt(this.targetTabListWrap, this.targetPanelWrap);
            this.tabAddEvt(targetBtnWrap.nextElementSibling.children[0], this.targetTabWrap);   
         } else this.homeKeyEvt(this.targetTabListWrap, this.targetTabWrap, this.targetPanelWrap);    
      }else if (e.key == 'ArrowLeft') {
         // 키보드 <- 화살표를 눌렀을 때
         if (targetBtnWrap.previousElementSibling) {
            targetBtnWrap.previousElementSibling.children[0].focus();
            this.tabRemoveEvt(this.targetTabListWrap, this.targetPanelWrap);
            this.tabAddEvt(targetBtnWrap.previousElementSibling.children[0], this.targetTabWrap);   
         } else this.endKeyEvt(this.targetTabListWrap, this.targetTabWrap, this.targetPanelWrap);
      }
      // 키보드 End 키 눌렀을 때
      else if (e.key == 'End') this.endKeyEvt(this.targetTabListWrap, this.targetTabWrap, this.targetPanelWrap);
      // 키보드 Home 키 눌렀을 때
      else if (e.key == 'Home') this.homeKeyEvt(this.targetTabListWrap, this.targetTabWrap, this.targetPanelWrap);

      console.log('this', this);
   }

   // tab active event
   tabAddEvt(currentTarget, targetTabWrap) {
      // 선택 된 탭 속성 true 로 변경
      currentTarget.setAttribute('aria-selected', 'true');
      currentTarget.removeAttribute('tabindex');
      currentTarget.parentElement.classList.add('active');
      // 연결 된 tabpanel 숨김 해제
      const controlId = currentTarget.getAttribute('aria-controls');

      targetTabWrap.querySelector(`#${controlId}`).setAttribute('tabindex', '0');
      targetTabWrap.querySelector(`#${controlId}`).removeAttribute('hidden');
   }

   // tab active remove event
   tabRemoveEvt(tabListWrap, tabPanelWrap) {
      [...tabListWrap.querySelectorAll('li')].forEach((tabBtnWrap) => {
         // 기존에 선택 된 탭 속성 false 로 변경
         if(tabBtnWrap.classList.contains('active')){
            tabBtnWrap.classList.remove('active');
            tabBtnWrap.querySelector('[role="tab"]').setAttribute('aria-selected', false);
            tabBtnWrap.querySelector('[role="tab"]').setAttribute('tabindex', '-1');
         }
         // 기존에 선택 된 tabpanel 숨김
         for(let tabPanel of tabPanelWrap.children){
            tabPanel.setAttribute('hidden', 'true');
            tabPanel.setAttribute('tabindex', '-1');
         }
      })
   }

   // 키보드 Home key Event (선택된 탭 리스트 중 첫 번째 리스트로 포커스 이동)
   homeKeyEvt(targetTabListWrap, targetTabWrap, targetPanelWrap) {
      targetTabListWrap.children[0].children[0].focus();
      this.tabRemoveEvt(targetTabListWrap, targetPanelWrap);
      this.tabAddEvt(targetTabListWrap.children[0].children[0], targetTabWrap);  
   }

   endKeyEvt(targetTabListWrap, targetTabWrap, targetPanelWrap) {
      const targetTabLists = targetTabListWrap.querySelectorAll('li');
      targetTabLists[targetTabLists.length - 1].children[0].focus();
      this.tabRemoveEvt(targetTabListWrap, targetPanelWrap);
      this.tabAddEvt(targetTabLists[targetTabLists.length - 1].children[0], targetTabWrap);  
   }
            
   detachEvents(){
      [...this.tabBtns].forEach((tabBtn) => {
         tabBtn.removeEventListener('click', this.tabClickEvt.bind(this));
         tabBtn.removeEventListener('keyup', this.tabKeyUpEvt);
      })
   }
    
   destroy(){
       this.detachEvents();
   }
}

const tabGroups = document.querySelectorAll('[data-role="tab"]');
tabGroups.length && [...tabGroups].forEach((tabWrapper) => {
   const options = tabWrapper.dataset;
   const tab = new Tab(tabWrapper, options);
   console.log('tab', tab);
})



