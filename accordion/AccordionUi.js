import UI from '../UI.js';
import { getElement } from '../Function.js';

class Accordion extends UI {
    defaults = {
        scroll: false
    }

    el = null;
    accordionBtns = null;


    constructor(el, options){
        super('Accordion', el);

        this.init(el, options);
    }

    init(el, options){
        this.el = el;
        this.accordionBtns = this.el.querySelectorAll('.accordion-btn');
        this.defaults = {...this.defaults, ...this.parseOptions(options)}

        this.render();
    }

    set() {
        [...this.accordionBtns].forEach(accordionBtn => {
            // 초기 셋팅 : accordion contents height size 에 비례한 transition duration 수정 (height size 188px = 0.3s 기준)
            accordionBtn.nextElementSibling.style.transitionDuration = `${
                accordionBtn.nextElementSibling.scrollHeight * 0.0016
            }s`;
            // 초기 셋팅 : button 의 aria-expanded 값이 false 인 accordion contents 에 hidden 값 할당
            if (accordionBtn.ariaExpanded === 'false' && accordionBtn.nextElementSibling !== null) {
                accordionBtn.nextElementSibling.setAttribute('hidden', 'true');
            }
            // 초기 셋팅 : button 의 aria-expanded 값이 true 인 accordion contents 에 height size 할당
            if (accordionBtn.ariaExpanded === 'true' && accordionBtn.nextElementSibling !== null) {
                console.log('scrollHeight', accordionBtn.nextElementSibling.scrollHeight);
                // accordionBtn.nextElementSibling.style.height = `${accordionBtn.nextElementSibling.scrollHeight}px`;  
                accordionBtn.nextElementSibling.style.height = 'auto';
            }
        });
    }

    render(){
        this.set();        
        this.detachEvents();
        this.attachEvents();
    }
 
    attachEvents() {
        [...this.accordionBtns].forEach((accordionBtn) => {
            accordionBtn.addEventListener('click', this.accordionEvt.bind(this));
         })   
    }

    accordionEvt(e) {
        let currentTarget = e.target.tagName;
        currentTarget = currentTarget === 'BUTTON' ? e.target : e.target.closest('button');

        const accordionOption = currentTarget.closest('[accordion-option]').getAttribute('accordion-option');
        const accordionWrapper = currentTarget.closest('[data-role="accordion-group"]');
        const targetContents = accordionWrapper.querySelector(`[aria-labelledby="${currentTarget.id}"]`);        

        // toggle type (default)
        if (currentTarget.ariaExpanded === 'true') {
            currentTarget.setAttribute('aria-expanded', 'false');
            targetContents.style.height = 0;
            targetContents.removeEventListener('transitionstart', this.accordionTransitionEvt);
            targetContents.addEventListener('transitionend', this.accordionTransitionEvt);
        } else {
            // 연결 된 accordion은 무조건 하나씩 만 열리는 type
            if (accordionOption === 'only') {
                const accordionBtns = accordionWrapper.querySelectorAll('.accordion-btn');
                const accordionContents = accordionWrapper.querySelectorAll('[role="region"]');
                // 기존에 선택 된 accordion 속성 false 로 변경
                accordionBtns.forEach((accordionBtn) => {
                    accordionBtn.setAttribute('aria-expanded', 'false');
                    if (accordionBtn.nextElementSibling !== null) {
                        accordionBtn.nextElementSibling.style.height = 0;
                        accordionBtn.nextElementSibling.removeEventListener('transitionstart', this.accordionTransitionEvt);
                        accordionBtn.nextElementSibling.addEventListener('transitionend', this.accordionTransitionEvt);
                    }
                });
            }

            // 선택 된 accordion 속성 true 상태로 변경
            currentTarget.setAttribute('aria-expanded', 'true');
            targetContents.removeAttribute('hidden');
            targetContents.style.height = `${targetContents.scrollHeight}px`;            
        }
    }

    // height size transition event 후 hidden 속성 추가
    accordionTransitionEvt() {
        const accordionContentsAll = document.querySelectorAll('.wrap-accordion-contents');
        accordionContentsAll.forEach((contents) => {
          if (contents.previousElementSibling.ariaExpanded === 'false')
            contents.setAttribute('hidden', 'true');
          else contents.removeAttribute('hidden');
        });
    }

    detachEvents() {
        [...this.accordionBtns].forEach((accordionBtn) => {
            accordionBtn.removeEventListener('click', this.accordionEvt.bind(this));
         })   
    }

    destroy() {

    }
}

const accordionGroups = document.querySelectorAll('[data-role="accordion-group"]');
accordionGroups.length && [...accordionGroups].forEach((accordionGroup) => {
    const options = accordionGroup.dataset;
    const accordion = new Accordion(accordionGroup, options);
    console.log('accordion', accordion);
});