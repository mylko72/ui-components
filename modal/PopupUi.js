import UI from '../UI.js';
import { getElement } from '../Function.js';

class Popup extends UI {
    defaults = {
        scroll: false
    }
 
    el = null;
    currentTarget = null; 
    focusEl = [];
    popupAll = null;
    popupCloseBtnAll = null;
    popupDepth = 0;
    popupDimmed = null; 
    keyEscapeEvt = null; 
    KeyEvtEl = null;

    constructor(el, options) {
        super('Popup', el);

        this.init(el, options)
    }

    init(el, options) {
        this.el = el;
        this.popupAll = document.querySelectorAll('[role="dialog"]'),
        this.popupCloseBtnAll = document.querySelectorAll('[popup-close]');
        this.defaults = {...this.defaults, ...this.parseOptions(options)};
        
        this.render();
    }

    render() {
        this.detachEvents();
        this.attachEvents();
    }

    attachEvents() {
        // 팝업 열기
        this.el.addEventListener('click', popupOpen);

        // 팝업 닫기
        this.popupCloseBtnAll.forEach((popupCloseBtn) => {
            popupCloseBtn.addEventListener('click', popupClose);
            if (popupCloseBtn.classList.contains('btn-layer-close')) {
                popupCloseBtn.addEventListener('keydown', closeBtnKeyDown);
            }
        });        

        // ESC 키로 팝업 닫기
        window.addEventListener('keydown', this.escKeyDown);
    }

    // popup dimmed 생성
    createdDimmed() {

    }

    // popup open
    popupOpen() {

    }

    // popup close
    popupClose() {

    }

    // popup close All
    popupCloseAll() {

    }

    // ESC 누름 감지
    keyEvent() {

    }

    // ESC 키보드 이벤트
    escKeyEvt() {

    }

    // 키보드 ESC 키 누름 감지 이벤트
    escKeyDown() {

    }

    // popup 닫기 키보드 이벤트
    closeBtnKeyDown() {

    }

    // popup title 키보드 이벤트
    titleKeyDown() {

    }

    // popup dimmed click 시 팝업 닫기
    dimmedClick() {

    }

    detachEvents() {
        this.el.removeEventListener('click', popupOpen);
        window.removeEventListener('keydown', this.escKeyDown);        

        // 팝업 닫기
        this.popupCloseBtnAll.forEach((popupCloseBtn) => {
            popupCloseBtn.removeEventListener('click', popupClose);
            if (popupCloseBtn.classList.contains('btn-layer-close')) {
                popupCloseBtn.removeEventListener('keydown', closeBtnKeyDown);
            }
        });        

    }

    destroy() {
        this.detachEvents();
    }
}

const popupBtnAll = document.querySelectorAll('[aria-haspopup="dialog"]');
popupBtnAll.length && popupBtnAll.forEach(popupBtn => {
    const options = popupBtn.dataset;
    const popup = new Popup(popupBtn, options);
    console.log('popup', popup);
})
