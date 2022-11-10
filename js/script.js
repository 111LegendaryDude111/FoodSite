window.addEventListener('DOMContentLoaded',()=>{

    //Tabs
    const tabsItems = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');



    function hideTabContent(){
            tabsContent.forEach(item => {
                item.classList.add('hide');
                item.classList.remove('show', 'fade');

            });

            tabsItems.forEach(item => {
                item.classList.remove('tabheader__item_active');
            });
        }
    
        
        function showTabContent(i = 0){
            tabsContent[i].classList.add('show', 'fade');
            tabsContent[i].classList.remove('hide');
            tabsItems[i].classList.add('tabheader__item_active');
        }
    
    
    hideTabContent();
    showTabContent();
    
        tabsParent.addEventListener('click', (e) => {
            const target = e.target;

            if (target && target.classList.contains('tabheader__item')){
                tabsItems.forEach((item, i) => {
                    if (target == item){
                        hideTabContent();
                        showTabContent(i);
                    }
                });
            }
        });
        

        //Timer

        const deadline = '2023-04-20';

        function getTimeRemaining(endTime){
            const t = Date.parse(endTime) - Date.parse(new Date());
            let  days, hours, minutes, seconds;

                if ( t <= 0){
                    days = 0,
                    hours = 0,
                    minutes = 0,
                    seconds = 0;
                }else{
                    days = Math.floor(t / (1000 * 60 * 60 * 24)),
                    hours = Math.floor((t / (1000 * 60 * 60) % 24)),
                    minutes = Math.floor((t / 1000 / 60) % 60),
                    seconds = Math.floor((t / 1000) % 60 );
                }

                    return {
                        'total': t,
                        'days': days,
                        hours,
                        minutes,
                        seconds
                    };

            }   


        function getZero(num){
            if (num >= 0 && num < 10){
                return `0${num}`;
            }else{
                return num;
            }
        }

        function setClock(selector, endTime){
            const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

            updateClock();

            function updateClock(){
                const t = getTimeRemaining(endTime);

                days.innerHTML = getZero(t.days);
                hours.innerHTML = getZero(t.hours);
                minutes.innerHTML = getZero(t.minutes);
                seconds.innerHTML = getZero(t.seconds);


                if (t.total <= 0){
                    clearInterval(timeInterval);
                }

            }
        }

        setClock('.timer', deadline);

        //Modal

        const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

        modalTrigger.forEach(btn => {
            btn.addEventListener('click', openModal);
        });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == "") {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) { 
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 300000);
    // Изменил значение, чтобы не отвлекало

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);
        // Создание карточек динамически.

        class MenuCard{
            constructor(src, alt, title, descr, price, parentSelector, ...classes){
                this.src = src;
                this.alt = alt;
                this.title = title;
                this.descr = descr;
                this.price = price;
                this.classes = classes;
                this.parent = document.querySelector(parentSelector);
                this.tranfer = 27;
                this.changeTOUAH();
            }

            changeTOUAH(){
                this.price = this.price * this.tranfer;
            }
            
            render(){
                const element = document.createElement('div');
                if (this.classes.length === 0){
                    this.element = 'menu__item';
                    element.classList.add(this.element);
                }else{
                    this.classes.forEach(className => element.classList.add(className));
                }

                element.innerHTML = `
                    <div class="menu__item">                <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    `;
                this.parent.append(element);
            }
        }

        const getResource = async (url) => {
            const res = await fetch(url); 

            if (!res.ok ){
                throw new Error(`Could not fetch ${url}, status: ${res.status}`);
            }

            return await res.json();
        };

        getResource('http://localhost:3000/menu')
        .then (data => {
            data.forEach(({img, altimg, title, descr, price}) =>{
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });


        //Forms
        
        const forms = document.querySelectorAll('form');

        const message = {
            loading: 'img/form/spinner.svg',
            succes: 'Спасибо! Скоро мы с вами свяжемся',
            failure: 'Что-то пошло не так...'
        };

        forms.forEach(el => {
            bindPostData(el);
        });

        const postData = async (url, data) => {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: data
            });

            return await res.json();
        };

        function bindPostData(form){
            form.addEventListener('submit', (e) =>{
                e.preventDefault();

                const statusMessage = document.createElement('img');
                statusMessage.src = message.loading;
                statusMessage.style.cssText = `
                    display:block;
                    margin: 0 auto;
                `;
                form.insertAdjacentElement('afterend', statusMessage);
                const formData = new FormData(form);
            
                //JSON
                const json = JSON.stringify(Object.fromEntries(formData.entries()));

                
                postData('http://localhost:3000/requests',json)
                .then( data => {
                    console.log(data);
                    showModalThanks(message.succes);
                    statusMessage.remove();
                }).catch( () => {
                    showModalThanks(message.failure);
                }).finally( () => {
                    form.reset();
                });
            });
        }
        //ХMLHttpRequest

        // const request = new XMLHttpRequest();
        // request.open('POST', 'js/server.php');//Настройки запроса - действие,т.е что мы хотиим отправить или получить данные с сервера,Второй аргумент это путь по которму мы отправляем запрос.
        // request.setRequestHeader('Content-type', 'application/json');
        // const formData = new FormData(form);//Чтобы FormData работала корректно , обязательно при создании iput в html нужно указать name='name', name='phone'  и тд, если этих атрибутов не будет тогда объект формДата не сможет корректно собрать данные дял отправки из инпутов
        // const obj = {};
        // formData.forEach(function(value, key){
        //     obj[key] = value;
        // });
        // const json = JSON.stringify(obj);
        // request.send(json);
        // request.addEventListener('load', ()=> {
        //     if (request.status === 200){
        //         console.log(request.response);
        //         showModalThanks(message.succes);
        //         form.reset();
        //         statusMessage.remove();
        //     }else {
        //         showModalThanks(message.failure);
        //     }
        // });


        //ModalThanks
        
        function showModalThanks(message){
            const prevModalDialog = document.querySelector('.modal__dialog');

            prevModalDialog.classList.add('hide');
            openModal();

            const thanksModal = document.createElement('div');
            thanksModal.classList.add('modal__dialog');
            thanksModal.innerHTML = `
            <div class='modal__content'>
                <div class="modal__close" data-close> × </div>
                <div class="modal__title">${message}</div>
            </div>
            `;
            document.querySelector('.modal').append(thanksModal);
            setTimeout(() =>{
                thanksModal.remove();
                prevModalDialog.classList.add('show');
                prevModalDialog.classList.remove('hide');
                closeModal();
            }, 4000);
        }

        // fetch('http://localhost:3000/menu')
        // .then(el => el.json())
        // .then(item => console.log(item));
        
        //Слайдер

        // const counterSlider = document.querySelector('#current'),
        //     btnSliderPrev = document.querySelector('.offer__slider-prev'),
        //     btnSliderNext = document.querySelector('.offer__slider-next'),
        //     sliderWrapper = document.querySelectorAll('.offer__slide');

        //     function sliderShow(i = 0){
        //         sliderWrapper[i].classList.add('show');
        //         sliderWrapper[i].classList.remove('hide');
        //         sliderWrapper[i].classList.add('tabheader__item_active');
        //     }

        //     function hideSlider(){
        //         sliderWrapper.forEach(el => {
        //             el.classList.add('hide');
        //             el.classList.remove('show');
        //             el.classList.remove('tabheader__item_active');

        //         });
        //     }
            
        //     let i = 0;
        //     hideSlider();
        //     sliderShow(i);
        //     counterSlider.innerHTML = `0${i + 1}`;


        //     btnSliderNext.addEventListener('click', (e) => {
        //         if (i === 3){
        //             i = 0;
        //         }else{
        //             i++;
        //         }
        //             hideSlider();
        //             sliderShow(i);
        //             counterSlider.innerHTML = `0${i + 1}`;
        //     });

        //     btnSliderPrev.addEventListener('click', (e) => {
        //         if (i === 0){
        //             i = 3;
        //         }else{
        //             i--;
        //         }
        //             hideSlider();
        //             sliderShow(i);
        //             counterSlider.innerHTML = `0${i + 1}`;
        //     });


            //Slider v2.0

            // let slideIndex = 1;
            // const slides = document.querySelectorAll('.offer__slide'),
            //     prev = document.querySelector('.offer__slider-prev'),
            //     next = document.querySelector('.offer__slider-next'),
            //     total = document.querySelector('#total'),
            //     current = document.querySelector('#current');
        
            // showSlides(slideIndex);
        
            // if (slides.length < 10) {
            //     total.textContent = `0${slides.length}`;
            // } else {
            //     total.textContent = slides.length;
            // }
        
            // function showSlides(n) {
            //     if (n > slides.length) {
            //         slideIndex = 1;
            //     }
            //     if (n < 1) {
            //         slideIndex = slides.length;
            //     }
            //     slides.forEach((item) => item.style.display = 'none');
            //     slides[slideIndex - 1].style.display = 'block'; 
            //     if (slides.length < 10) {
            //         current.textContent =  `0${slideIndex}`;
            //     } else {
            //         current.textContent =  slideIndex;
            //     }
            // }
        
            // function plusSlides (n) {
            //     showSlides(slideIndex += n);
            // }
        
            // prev.addEventListener('click', function(){
            //     plusSlides(-1);
            // });
        
            // next.addEventListener('click', function(){
            //     plusSlides(1);
            // });

            // Slider v3.0
            let offset = 0;
            let slideIndex = 1;
        
            const slides = document.querySelectorAll('.offer__slide'),
                slider = document.querySelector('.offer__slider'),
                next = document.querySelector('.offer__slider-next'),
                prev = document.querySelector('.offer__slider-prev'),
                total = document.querySelector('#total'),
                current = document.querySelector('#current'),
                slidesWrapper = document.querySelector('.offer__slider-wrapper'),
                width = window.getComputedStyle(slidesWrapper).width,
                slidesField = document.querySelector('.offer__slider-inner');
        
            if (slides.length < 10) {
                total.textContent = `0${slides.length}`;
                current.textContent =  `0${slideIndex}`;
            } else {
                total.textContent = slides.length;
                current.textContent =  slideIndex;
            }
            
            slidesField.style.width = 100 * slides.length + '%';
            slidesField.style.display = 'flex';
            slidesField.style.transition = '0.5s all';
        
            slidesWrapper.style.overflow = 'hidden';
        
            slides.forEach(slide => {
                slide.style.width = width;
            });
        
            slider.style.position = 'relative';

            const indicators = document.createElement('ol');
             let   dots = [];
            indicators.classList.add('carousel-indicators');
            slider.append(indicators);

            for (let i = 0; i < slides.length; i++){
                const dot = document.createElement('li');
                dot.setAttribute('data-slide-to', i + 1);
                dot.classList.add('dot');
                if (i === 0){
                    dot.style.opacity = 1;
                }
                indicators.append(dot);
                dots.push(dot);
            }

            function deleteNotDigits(str){
                return + str.replace(/\D/g, '');
            }

            next.addEventListener('click', () => {
                if (offset == deleteNotDigits(width) * (slides.length - 1)) {
                    offset = 0;
                } else {
                    offset += deleteNotDigits(width); 
                }
        
                slidesField.style.transform = `translateX(-${offset}px)`;
        
                if (slideIndex == slides.length) {
                    slideIndex = 1;
                } else {
                    slideIndex++;
                }
        
                if (slides.length < 10) {
                    current.textContent =  `0${slideIndex}`;
                } else {
                    current.textContent =  slideIndex;
                }

                dots.forEach( el => {
                    el.style.opacity = '.5';
                });
                dots[slideIndex - 1].style.opacity = 1;
            });
        
            prev.addEventListener('click', () => {
                if (offset == 0) {
                    offset = deleteNotDigits(width) * (slides.length - 1);
                } else {
                    offset -= deleteNotDigits(width);
                }
        
                slidesField.style.transform = `translateX(-${offset}px)`;
        
                if (slideIndex == 1) {
                    slideIndex = slides.length;
                } else {
                    slideIndex--;
                }
        
                if (slides.length < 10) {
                    current.textContent =  `0${slideIndex}`;
                } else {
                    current.textContent =  slideIndex;
                }
                dots.forEach( el => {
                    el.style.opacity = '.5';
                });
                dots[slideIndex - 1].style.opacity = 1;
            });

            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    const slideTo = e.target.getAttribute('data-slide-to');
        
                    slideIndex = slideTo;
                    offset = deleteNotDigits(width) * (slideTo - 1);
        
                    slidesField.style.transform = `translateX(-${offset}px)`;
        
                    if (slides.length < 10) {
                        current.textContent =  `0${slideIndex}`;
                    } else {
                        current.textContent =  slideIndex;
                    }
        
                    dots.forEach(dot => dot.style.opacity = ".5");
                    dots[slideIndex-1].style.opacity = 1;
                });
            });

            //Calc

            let result = document.querySelector('.calculating__result span');
            let sex = 'female', weight, height,age, ratio  = '1.375';

            function calcTotal(){
                if (!sex || !weight || !height || !age || !ratio){
                    result.textContent = '____';
                    return;
                }

                if (sex === 'female'){
                    result.textContent = Math.round(447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age) * ratio);
                }else{
                    result.textContent = Math.round(88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age) * ratio);
                }
            }

            calcTotal();

            function getStaticInformation(parentSelector, activeClass){
                const elements = document.querySelectorAll(`${parentSelector} div`);

                elements.forEach(elem => 
                    elem.addEventListener('click',(e) => {
                    if (e.target.getAttribute('data-ratio')){
                        ratio = +e.target.getAttribute('data-ratio');
                    }else{
                        sex = e.target.getAttribute('id');
                    }

                    elements.forEach(el => el.classList.remove(activeClass));

                    e.target.classList.add(activeClass);
                    calcTotal();
                }));
            }


            getStaticInformation('#gender', 'calculating__choose-item_active');
            getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');


            function getDynamicInformation(selector){
                const input = document.querySelector(selector);

                input.addEventListener('input', () => {
                    switch(input.getAttribute('id')) {
                        case 'height':
                            height = +input.value;
                            break;
                        case 'weight':
                            weight = +input.value;
                            break;
                        case 'age':
                            age = +input.value;
                            break;
                        }
                        calcTotal();
                }); 
                
            }

            getDynamicInformation('#height');
            getDynamicInformation('#weight');
            getDynamicInformation('#age');

});