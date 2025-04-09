import UI from '../UI.js';
import { getElement } from '../Function.js';

class Popup extends UI {
    defaults = {
        scroll: false
    }
 
    popupBtn = null;
    currentTarget = null;    
    keyEscapeEvt = null;
    KeyEvtEl = null;
    // ESC 누름 감지
    keyEvent = {
        get keyEscape() {
            return this._state;
        },
        set keyEscape(state) {
            this._state = state;
            if (state) escKeyEvt(KeyEvtEl, keyEscapeEvt);
        },
    }

    constructor(el, options) {
        super('Popup', el);

        this.init(el, options)
    }

    init(el, options) {
        this.popupBtn = el;
        this.popupAll = document.querySelectorAll('[role="dialog"]'),
        this.popupCloseBtnAll = document.querySelectorAll('[popup-close]');
        this.defaults = {...this.defaults, ...this.parseOptions(options)};

        console.log('keyEvent', this.keyEvent);
        
        this.render();
    }

    render() {
        this.detachEvents();
        this.attachEvents();
    }

    attachEvents() {
        // 팝업 열기
        this.popupBtn.addEventListener('click', this.popupOpen.bind(this));

        // 팝업 닫기
        this.popupCloseBtnAll.forEach((popupCloseBtn) => {
            popupCloseBtn.addEventListener('click', this.popupClose);
            if (popupCloseBtn.classList.contains('btn-layer-close')) {
                popupCloseBtn.addEventListener('keydown', this.closeBtnKeyDown);
            }
        });        

        // ESC 키로 팝업 닫기
        window.addEventListener('keydown', this.escKeyDown);
    }

    // popup dimmed 생성
    createdDimmed() {
        const createDiv = document.createElement('div');
        createDiv.classList.add('popup-dimmed');
        document.querySelector('body').appendChild(createDiv);
    }

    // popup open
    popupOpen(e) {
        this.currentTarget = (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') ? e.target : e.target.closest('button') || e.target.closest('a');
        this.popupDimmed = document.querySelectorAll('.popup-dimmed');
        if (!this.popupDimmed.length) this.createdDimmed();
        this.popupAll.forEach((popupEl) => {
        if (popupEl.getAttribute('data-popup') === this.currentTarget.getAttribute('data-popup')) {
            console.log('popupDepth', super.popupDepth);
            super.popupDepth += 1; // popup depth 저장
            this.focusEl.splice((this.popupDepth - 1), 0, this.currentTarget); // popup focus Element 저장
            popupEl.classList.add('popup-open'); // open class add
            popupEl.setAttribute('popup-depth', this.popupDepth); // popup depth 설정
            // dimmed click 이벤트 할당
            popupEl.removeEventListener('click', this.dimmedClick);
            popupEl.addEventListener('click', this.dimmedClick);
            document.body.classList.add('scroll-lock'); // popup scroll lock
            popupEl.querySelector('.wrap-layer-popup-title').focus(); // popup 오픈 시 타이틀에 포커스
            // shift+tab 또는 <- 화살표 키 키보드 동작 시 팝업 밖으로 포커스 이동 방지 이벤트 할당
            popupEl.querySelector('.wrap-layer-popup-title').removeEventListener('keydown', this.titleKeyEvt);
            popupEl.querySelector('.wrap-layer-popup-title').addEventListener('keydown', this.titleKeyEvt);
            // popup 위 팝업 케이스 dimmed 수정
            if (this.popupDepth > 1) document.querySelector(`[popup-depth='${this.popupDepth - 1}']`).classList.add('prev-popup');
            this.KeyEvtEl = popupEl; // ESC 키 동작을 위한 현재 활성화 된 popup element 저장
        };
        });
    }

    // popup close
    popupClose(e) {
        // 키보드 이벤트 ESC 일 경우 currentTarget 설정
        if (e.key == 'Escape' || e.key == 'Esc') this.currentTarget = this.KeyEvtEl.querySelector('.btn-layer-close');
        // 일반적인 클릭, 키보드 이벤트 일 경우 currentTarget 설정
        else {
            this.currentTarget = (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') ? e.target : e.target.closest('button') || e.target.closest('a');
            let popupId = this.currentTarget.getAttribute('popup-close');
            if (this.currentTarget.getAttribute('popup-close-all') === 'true') return this.popupCloseAll();
            if (this.currentTarget.getAttribute('popup-confirm')) confirmEvt[popupId]();
            else if (currentTarget.getAttribute('popup-cancel')) cancelEvt[popupId]();
        }
        this.popupAll.forEach((popupEl) => {
            if (popupEl.getAttribute('data-popup') === this.currentTarget.getAttribute('popup-close')) {
                popupEl.classList.remove('popup-open');
                // 저장된 focus element 가 있을 때
                if (this.focusEl.length > 0) {
                    this.focusEl[this.popupDepth - 1].focus(); // focus 상태 재설정
                    this.focusEl.splice((this.popupDepth - 1), 1); // popup focus Element 삭제
                    this.popupDepth -= 1; // popup depth 재설정
                    this.KeyEvtEl = document.querySelector(`.wrap-layer-popup[popup-depth='${popupDepth}']`); // ESC 키 동작을 위한 현재 활성화 된 popup element 저장
                } else { // 저장된 focus element 가 없을 때
                    document.body.setAttribute('tabindex', '0');
                    document.body.focus();
                    this.KeyEvtEl = null;
                }
            };
        });
        // 이전에 오픈 된 popup이 있는 지 확인
        const openPopups = document.querySelectorAll(`.popup-open`);
        if (openPopups.length === 0) popupCloseAll('none');
        else if (openPopups.length > 0) { // 오픈된 popup이 있을 경우 popup dimmed 수정
            const getPopupValue = this.currentTarget.getAttribute('popup-close') || this.currentTarget.getAttribute('data-popup');
            const getPopupDepth = Number(document.querySelector(`.wrap-layer-popup[data-popup='${getPopupValue}']`).getAttribute('popup-depth'));
            document.querySelector(`.wrap-layer-popup[popup-depth='${getPopupDepth - 1}']`).classList.remove('prev-popup');
            document.querySelector(`.wrap-layer-popup[data-popup='${getPopupValue}']`).removeAttribute('popup-depth');
        };
    }

    // popup close All
    popupCloseAll(focusActionNone) {
        // dimmed 삭제
        const popupDimmed = document.querySelector('.popup-dimmed');
        popupDimmed.style.opacity = 0;
        popupDimmed.addEventListener('transitionend', function() {
            if (popupDimmed.parentNode !== null) popupDimmed.parentNode.removeChild(popupDimmed);
        });
        // popup depth 설정 삭제
        this.popupAll.forEach((popupEl) => {
            popupEl.classList.remove('prev-popup');
            popupEl.removeAttribute('popup-depth');
        });
        // scroll lock 해지
        document.body.classList.remove('scroll-lock');
        // popupClose Event 통해서 focus 설정이 되지 않았을 경우 (popupCloseAll 단독 실행일 경우)
        if (focusActionNone !== 'none') {
            if (this.focusEl.length > 0) this.focusEl[0].focus();  // 저장된 focus element 가 있을 때
            else { // 저장된 focus element 가 없을 때
                document.body.setAttribute('tabindex', '0');
                document.body.focus();
            };
            this.focusEl = []; // focus reset
        }
        this.popupAll.forEach((popupEl) => popupEl.classList.remove('popup-open')); // open class 삭제
        this.popupDepth = 0; // popup depth reset
        this.KeyEvtEl = null; // KeyEvtEl reset
    }

    // ESC 키보드 이벤트
    escKeyEvt(el, e) {
        const openPopups = document.querySelectorAll(`.popup-open`);
        // 팝업 열린 상태에서 키보드 ESC 키 이벤트 실행
        if (openPopups.length > 0) this.popupClose(e);
    }

    // 키보드 ESC 키 누름 감지 이벤트
    escKeyDown(e) {
        if (e.key == 'Escape' || e.key == 'Esc') {
            this.keyEscapeEvt = e;
            this.keyEvent.keyEscape = true;
        };
    }

    // popup 닫기 키보드 이벤트
    closeBtnKeyDown(e) {
        if ((e.key == 'Tab' && !e.shiftKey) || e.key == 'ArrowRight') {
            e.preventDefault();
            this.popupAll.forEach((popupEl) => {
                if (popupEl.getAttribute('data-popup') === e.target.getAttribute('popup-close')) {
                    popupEl.querySelector('.wrap-layer-popup-title').focus();
                };
            });
        };
    }

    // popup title 키보드 이벤트
    titleKeyEvt(e) {
        if ((e.key == 'Tab' && e.shiftKey) || e.key == 'ArrowLeft') {
            e.preventDefault();
            this.popupAll.forEach((popupEl) => {
                if (popupEl.getAttribute('data-popup') === e.target.closest('.wrap-layer-popup').getAttribute('data-popup')) {
                    popupEl.querySelector('.btn-layer-close').focus();
                };
            });
        };
    }

    // popup dimmed click 시 팝업 닫기
    dimmedClick(e) {
        if (e.target.classList.contains('wrap-layer-popup')) {
            this.popupCloseAll();
            this.keyEvent.keyEscape = false;
        }   
    }

    detachEvents() {
        this.popupBtn.removeEventListener('click', this.popupOpen);
        window.removeEventListener('keydown', this.escKeyDown);        

        // 팝업 닫기
        this.popupCloseBtnAll.forEach((popupCloseBtn) => {
            popupCloseBtn.removeEventListener('click', this.popupClose);
            if (popupCloseBtn.classList.contains('btn-layer-close')) {
                popupCloseBtn.removeEventListener('keydown', this.closeBtnKeyDown);
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
