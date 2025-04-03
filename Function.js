function isMobile(){
    return window.innerWidth <= 768;
}

function isDesktop(){
    return window.innerWidth > 768;
}

function getElement(className) {
    const element = document.querySelector(className);
    if(element){
        return element;
    }
    throw new Error(
        `Please check "${className}" selector, no such element exists`
    );
}

function setPxToVw(value){
    const deviceWidth = window.innerWidth > 768 ? 1920 : 360;
    const rate = deviceWidth / 100;
    return value / rate;
}

function callByObserver(params) {
    let { target, showCallback, hideCallback, keepObserver, options } = params;

    let defaults = {
        ...{
            root: null,
            rootMargin: '0px 0px 0px 0px',
            threshold: 1.0
        }, ...options
    };

    let callback = (entries, observer) => {
        entries.forEach(entry => {
            const { intersectionRatio: currentRatio, isIntersecting } = entry;

            if(isIntersecting){
                if(showCallback && typeof showCallback == 'function'){
                    showCallback(entry.target);
                }
                !keepObserver && observer.unobserve(entry.target);
            } else {                     
                if(hideCallback && typeof hideCallback == 'function'){
                    hideCallback(entry.target);
                }
            }
        });
    }

    if ("IntersectionObserver" in window) {
        let observer = new IntersectionObserver(callback, defaults);
        observer.observe(target);
    }
}

export {
    isMobile,
    isDesktop,
    getElement,
    callByObserver,
    setPxToVw
}