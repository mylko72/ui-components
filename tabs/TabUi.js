import UI from '../UI.js';
import { getElement } from '../Function.js';
// import {scrollTo, wrapInnerScroll} from './simple.ui';

class Tab extends UI {
    defaults = {
       scroll: false
    }
    currentTarget = null;
    targetTabWrap = null;
    targetTabListWrap = null;
    targetPanelWrap = null;

    constructor(el, options){
       super('Tab', el);
       
       this.init(el, options);
    }
    
    init(el, options){
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
      this.el.addEventListener('click', this.tabClickEvt);
    }

    initEvt(e){
      this.currentTarget = e.target.tagName;
      this.currentTarget === 'BUTTON' || 'A'
        ? (this.currentTarget = e.target)
        : (this.currentTarget = e.target.closest('button') || e.target.closest('a'));
      this.targetTabWrap = this.currentTarget.closest('[data-role="tab"]');
      this.targetTabListWrap = this.targetTabWrap.querySelector('[role="tablist"]');
      this.targetPanelWrap = targetTabWrap.querySelector('.ui-tab-contents');  
    }

    tabClickEvt(){
      this.initEvt();
    }
            
    detachEvents(){
      //  this.$el.off(this.eventId);
    }
    
    destroy(){
       this.detachEvents();
    }
}

const tabGroups = document.querySelectorAll('[data-role="tab"]');
tabGroups.length && [...tabGroups].forEach((tabWrapper) => {
   const tabBtns = tabWrapper.querySelectorAll('[role="tab"]');
   tabBtns.length && [...tabBtns].forEach((tabBtn) => {
      const options = tabBtn.dataset;
      const tab = new Tab(tabBtn, options);
      console.log('tab', tab);
   });
})



