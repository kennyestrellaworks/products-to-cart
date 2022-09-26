const DOMStrings = {
    hamburgerMenuButtonClick: document.querySelector('.hamburger-menu__button'),
    menu: document.querySelector('.menu'),
    menuWrap: document.querySelector('.menu__wrap'),
    menuItemClick: '',
    menuSubmenu: '',
    menuSubmenuWrap: '',
    productBox: document.querySelector('.product-box'),
    productBoxBadge: '',
    productBoxQuantityUpButton: '',
    productBoxQuantityDownButton: '',
    productBoxProductPriceMultiplier: '',
    productBoxProductPriceDefault: document.querySelectorAll('.product-box__product-price-default'),
    productBoxProductPriceUpdated: document.querySelectorAll('.product-box__product-price-updated'),
    cartShoppingCartButton: document.querySelector('.cart__shopping-cart-button'),
    itemQuantityCount: document.querySelector('.cart__item-count'),
    cartPopupWrap: document.querySelector('.cart-popup__wrap'),
    cartPopupCloseButton: document.querySelector('.cart-popup__close-button'),
    contentCover: document.querySelector('.content__cover'),
    productBoxQuantityUpButton: '',
    itemDecreaseButton: '',
    productBoxFormQuantityInput: '',    
    productBoxAddToCartButton: '',
    alertPopup: document.querySelector('.alert__popup-wrap'),
    alertPopupButton: document.querySelector('.alert__popup-button'),
    alertContent: document.querySelector('.alert__popup-message'),    
    cartItemDisplay: document.querySelector('.cart-popup__cart-items'),
    cartPopupItemsTotal: document.querySelector('.cart-popup__items-total'),
    cartOverallSum: document.querySelector('.cart-popup__total-amount'),
    productAddToCartButton: '',
    continueShoppingButton: document.querySelector('.cart-popup__continue-shopping-button'),
    cartPopupCheckoutButton: document.querySelector('.cart-popup__checkout-button'),
    cartPopupQuantityIncreaseButton: '',
    cartPopupQuantityDecreaseButton: '',
    cartPopupFormQuantityInput: '',
    cartPopupItemPrice: '',
    cartPopupItemPriceTotal: '',
    cartPopupAlertBoxWrap: '',
    cartPopupAlertBoxButton: '',
    cartPopupClearCartButton: document.querySelector('.cart-popup__clear-cart-button'),
    cartPopupItemPriceMultiplier: ''    
}

let cartArray = []
let cartArrayItemToSave = []
let cartArrayItemToDelete = []

class UI {
    static resetProductBoxValues(index) {
        DOMStrings.productBoxFormQuantityInput[index].value = 0
        DOMStrings.productBoxAddToCartButton[index].innerHTML = 'add to cart'
        DOMStrings.productBoxQuantityDownButton[index].disabled = true
        DOMStrings.productBoxQuantityDownButton[index].classList.add('button-icon__primary')
        DOMStrings.productBoxQuantityDownButton[index].classList.remove('button-icon__primary-disabled')
        DOMStrings.productBoxProductPriceUpdated[index].innerHTML = ''
        DOMStrings.productBoxProductPriceMultiplier[index].innerHTML = ''
        let productItem = Storage.getProduct(DOMStrings.productBoxFormQuantityInput[index].dataset.id)
        DOMStrings.productBoxProductPriceUpdated[index].innerHTML = `&#8369; ${UI.formatNumber(productItem.price.toFixed(2))}`      
    }

    static processCartPopupOverallTotal() {
        // At the 'cart popup UI' when the current 'increase button' of an item is clicked, we multiply the 'input value' to the 'PRICE'
        // to get the 'TOTAL'
        let cartItemPriceTotal = 0
        let overallTotal = 0
        let cartItemArray = []
        let cartItemSum = 0
        let cartSumQuantityText

        if (cartArray.length != 0) {
            // We are getting each 'PRICE' of the 'cart-popup' items that are added then multiply it to the 'input value' to get the 'TOTAL'.
            // Then we get the 'TOTAL' to have the 'Overall Total'.
            for (let i = 0; i < cartArray.length; i++) {
                cartItemPriceTotal = cartArray[i].price * DOMStrings.cartPopupFormQuantityInput[i].value
                overallTotal += cartItemPriceTotal

                // We also push some values to 'cartItemArray' so that we can use it to determine the total items in the 'cart-popup'.
                cartItemArray.push(parseInt(DOMStrings.cartPopupFormQuantityInput[i].value))
            }
            DOMStrings.cartOverallSum.innerHTML = `&#8369; ${UI.formatNumber(overallTotal.toFixed(2))}`        

            // We loop throught the 'Elements' within the 'cartItemArray' to get the sum, that specifies the total items in the 'cart-popup'.
            for (let i = 0; i < cartItemArray.length; i++) {
                cartItemSum += cartItemArray[i]
            }
        } else {
            DOMStrings.cartOverallSum.innerHTML = `&#8369; 0.00`
        }  
        
        // We determine wether we add suffix 'Items', 'Item' or 'No Items'.
        if (cartItemSum > 1) {
            cartSumQuantityText = cartItemSum + ' Items'
        } else if (cartItemSum == 1) { 
            cartSumQuantityText = cartItemSum + ' Item' 
        } else if (cartItemSum == 0) {
            cartSumQuantityText = 'No Items'
        }
        DOMStrings.cartPopupItemsTotal.innerHTML = cartSumQuantityText

        // Reset the values.
        cartItemSum = 0
        cartItemArray = []
    }
    
    static setProductBoxItemMultiplier(index, state) {
        let productItem
        let productUpdatedPrice = 0
        if (state == 'page-load') {
            for (let i = 0; i < DOMStrings.productBoxFormQuantityInput.length; i++) {
                if (DOMStrings.productBoxFormQuantityInput[i].value > 0) {
                    DOMStrings.productBoxProductPriceMultiplier[i].innerHTML = `x ${DOMStrings.productBoxFormQuantityInput[i].value}`
                    productItem = Storage.getProduct(DOMStrings.productBoxFormQuantityInput[i].dataset.id)
                    productUpdatedPrice = productItem.price * parseInt(DOMStrings.productBoxFormQuantityInput[i].value)
                    DOMStrings.productBoxProductPriceUpdated[i].innerHTML = `&#8369; ${UI.formatNumber(productUpdatedPrice.toFixed(2))}` 
                }
            }
        } else {
            productItem = Storage.getProduct(DOMStrings.productBoxFormQuantityInput[index].dataset.id)
            if (DOMStrings.productBoxFormQuantityInput[index].value == 1 || DOMStrings.productBoxFormQuantityInput[index].value == 0) {
                DOMStrings.productBoxProductPriceMultiplier[index].textContent = `x 1`
                productUpdatedPrice = productItem.price * 1
            } else {
                DOMStrings.productBoxProductPriceMultiplier[index].textContent = `x ${DOMStrings.productBoxFormQuantityInput[index].value}`
                productUpdatedPrice = productItem.price * parseInt(DOMStrings.productBoxFormQuantityInput[index].value)                
            }
            DOMStrings.productBoxProductPriceUpdated[index].innerHTML = `&#8369; ${UI.formatNumber(productUpdatedPrice.toFixed(2))}`
        } 
    }

    static formatNumber(numberToFormat) {
        // We need to slice the number into 2 parts, that's why we need an 'Array' that
        // will hold 'Elements' before the period '.'.
        let numbersBeforeDecimalArray = []

        // These 2 'Array' will be very essential to create the 'Elements' after the
        // decimal point.
        let numbersAfterDecimalArray = []
        let numbersAfterDecimalTempArray = []

        // The first slice 'Array'.
        let numbersSliceOneArray = []

        // The second slice 'Array'.
        let numbersSliceTwoArray = []

        let divider = 3 // Constant divider representing 3 places before the comma ','.
        let numbersLengthModulu = 0 // The remainder or modulu.
        let numbersLengthQuotient = 0 // The quotient.

        // Combine the 'Elements' of 'numbersSliceOneArray' and 'numbersSliceTwoArray'.
        let numbersSliceAll = []

        // The final 'String' that we can display.
        let numberFormatted = ''

        const doNumbersBeforeDecimal = function() {
            // We loop through 'numberToString' letters, then check if the current letter which
            // is represented by '[i]' is not equal '!=' to period '.', if 'true', then we push
            // the current element to the 'numbersBeforeDecimalArray Array'. The 'else statement'
            // will stop this process.
            for (let i = 0; i < numberToFormat.length; i++) {
                if (numberToFormat[i] != '.') {
                    numbersBeforeDecimalArray.push(numberToFormat[i])
                } else { return }
            }
        }

        const doNumbersAfterDecimal = function() {
            // A different arrangement of the 'For loop' so that we can start looping through the
            // 'Elements' at the very end of 'numberToString' then push the 'Elements' until the 
            // loop discovers the period '.' then the loop breaks.
            for (let i = numberToFormat.length - 1; i != 0; i--) {
                if (numberToFormat[i] != '.') {
                    numbersAfterDecimalTempArray.push(numberToFormat[i])
                } else { return }
            }   
        }

        const doReverseNumbersAfterDecimal = function() {
            // Since the resulting 'Array' will have a reverse formation of what we're looking for,
            // we will do another 'For loop' to reverse the placment one again, thus, getting the 
            // correct arrangement we need.
            for (let i = numbersAfterDecimalTempArray.length; i != 0; i--) {
                numbersAfterDecimalArray.push(numbersAfterDecimalTempArray[i - 1])
            }
        }

        const doLongProcess = function() {
            // Getting the 'remainder or modulu'.
            numbersLengthModulu = numbersBeforeDecimalArray.length % divider

            // Getting the 'qoutient'.
            numbersLengthQuotient = parseInt(numbersBeforeDecimalArray.length / divider)

            // Setting the 'sliceTwoCounter Variable' which needs to be equal to the 'remainder or
            // modulu' but less than 1.
            let sliceTwoCounter = numbersLengthModulu - 1

            // The 'Variable' to count how many times we pushed an 'Element' where we limit only to 3.
            let pushCount = 0

            // Constructing the 'numbersSliceOneArray Array' which will hold the 'Elements' to be
            // preceeded by the first comma, ',' to format the 'number'.    
            for (let i = 0; i < numbersLengthModulu; i++) {
                numbersSliceOneArray.push(numbersBeforeDecimalArray[i])
            }

            // Then we push a comma ',', our first one if 'numbersLengthModulu variable' is not equal to 0.
            if (numbersLengthModulu != 0) {
                numbersSliceOneArray.push(',')
            }    

            // We construct the next set of 'Elements' that will be added to 'numbersSliceTwoArray Array'
            // where these set represents the numbers that are divisible by 3, meaning, we can  place a
            // comma in every 3rd place but not at the last 'Element'.
            //
            // For example, 123456789
            // We can put a comma after 3, 6 but not at 9 which is the last 'Element'. 
            while (sliceTwoCounter < numbersBeforeDecimalArray.length - 1) {
                sliceTwoCounter++        
                if (pushCount != divider) {
                    numbersSliceTwoArray.push(numbersBeforeDecimalArray[sliceTwoCounter])
                    pushCount++
                } else if (pushCount == 3) { 
                    numbersSliceTwoArray.push(',')
                    pushCount = 0
                    sliceTwoCounter--        
                }
            }

            // Pusing the period lastly to this 'Array'
            numbersSliceTwoArray.push('.')

            // Spreading the 'Elements' of the 3 'Arrays'.
            numbersSliceAll = [...numbersSliceOneArray, ...numbersSliceTwoArray, ...numbersAfterDecimalArray]

            // Finalizing the 'String'.
            for (let i = 0; i < numbersSliceAll.length; i++) {
                numberFormatted += numbersSliceAll[i]
            }
        }

        doNumbersBeforeDecimal()
        doNumbersAfterDecimal()
        doReverseNumbersAfterDecimal()
        doLongProcess()

        // Value checking.
        // console.log('numberToFormat', numberToFormat)
        // console.log('numbersBeforeDecimalArray', numbersBeforeDecimalArray)
        // console.log('numbersAfterDecimalTempArray', numbersAfterDecimalTempArray)
        // console.log('numbersAfterDecimalArray', numbersAfterDecimalArray)
        // console.log('numbersLengthModulu', numbersLengthModulu)
        // console.log('numbersLengthQuotient', numbersLengthQuotient)
        // console.log('numbersSliceOneArray', numbersSliceOneArray)
        // console.log('numbersSliceTwoArray', numbersSliceTwoArray)
        // console.log('numbersSliceAll', numbersSliceAll)
        // console.log('numberFormatted', numberFormatted)

        return numberFormatted
    }

    static setupCart() {
        let cartContent = ''
        let sumQuantity = 0
        let cartOverallSum = 0
        let cart = Storage.getCart()        
        cartArray = cart        

        if (cartArray.length == 0) {
            cartContent = `<div class="cart-popup__empty-message">you cart is empty</div>`
            DOMStrings.cartPopupClearCartButton.disabled = true
            DOMStrings.cartPopupClearCartButton.classList.remove('button__tertiary')
            DOMStrings.cartPopupClearCartButton.classList.add('button__tertiary-disabled')
            DOMStrings.cartPopupCheckoutButton.classList.remove('button__primary')
            DOMStrings.cartPopupCheckoutButton.classList.add('button__primary-disabled')                      
        } else {
            DOMStrings.cartPopupClearCartButton.disabled = false
            DOMStrings.cartPopupClearCartButton.classList.add('button__tertiary')
            DOMStrings.cartPopupClearCartButton.classList.remove('button__tertiary-disabled')
            DOMStrings.cartPopupCheckoutButton.classList.add('button__primary')
            DOMStrings.cartPopupCheckoutButton.classList.remove('button__primary-disabled')                

            for (let i = 0; i < cartArray.length; i++) {
                cartContent += `
                <div class="cart-popup__cart-items-box">                    
                    <div class="cart-popup__cart-items-box-left">
                        <div class="cart-popup__cart-item-button">
                        <button class="button-icon button-icon__tertiary cart-popup__remove-item-button" data-id="${cartArray[i].id}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 26">
                            <g id="icon-close" transform="translate(-8509 2491)">
                                <g id="Group_177" data-name="Group 177" opacity="0">
                                <rect id="Rectangle_80" data-name="Rectangle 80" width="24" height="26" transform="translate(8509 -2491)" fill="#fff"/>
                                <rect id="Rectangle_83" data-name="Rectangle 83" width="20" height="18" transform="translate(8511 -2487)" fill="#d58484"/>
                                </g>
                                <path id="close" d="M131.2,128.958l6.285-6.285a1.589,1.589,0,0,0-2.245-2.249l-6.285,6.285-6.285-6.285a1.591,1.591,0,0,0-2.249,2.249l6.285,6.285-6.285,6.285a1.591,1.591,0,0,0,2.249,2.249l6.285-6.285,6.285,6.285a1.591,1.591,0,0,0,2.249-2.249Z" transform="translate(8392.042 -2606.958)"/>
                            </g>
                            </svg>                              
                        </button>
                        </div>                              
                    </div>
                    <div class="cart-popup__cart-items-box-right">
                        <div class="cart-popup__cart-items-box-right-wrap">
                        <div class="cart-popup__cart-items-image-and-detail">
                            <img src="${cartArray[i].imageUrl}" alt="${cartArray[i].title}" class="cart-popup__cart-item-image">
                            <div class="cart-popup__cart-item-detail">
                            <div class="text-title__primary">${cartArray[i].title}</div>
                            <div class="text-title__description">${cartArray[i].description}</div>
                            </div>
                        </div>
                        <div class="cart-popup__quantity-price-total">
                            <div class="cart-popup__quantity-price-total-wrap">
                            <div class="cart-popup__quantity">
                                <button class="cart-popup__quantity-button button-icon button-icon__quaternary button-icon__quaternary-up cart-popup__quantity-decrease-button" data-id="${cartArray[i].id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14.15" height="8.086" viewBox="0 0 14.15 8.086">
                                    <path id="chevron-up" d="M101.188,168.134a1.011,1.011,0,0,1-.716-.295l-5.349-5.349-5.349,5.349a1.01,1.01,0,0,1-1.428-1.428l6.065-6.065a1.007,1.007,0,0,1,1.428,0l6.065,6.065a1.009,1.009,0,0,1-.716,1.723Z" transform="translate(-88.05 -160.05)"/>
                                </svg>                                                    
                                </button>
                                <form action="" class="cart-popup__form">
                                <input type="number" class="cart-popup__form-quantity-input" placeholder="0" value="${cartArray[i].quantity}" data-id="${cartArray[i].id}">
                                </form>
                                <button class="cart-popup__quantity-button button-icon button-icon__quaternary button-icon__quaternary-down  cart-popup__quantity-increase-button" data-id="${cartArray[i].id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14.15" height="8.086" viewBox="0 0 14.15 8.086">
                                    <path id="chevron-up" d="M101.188,168.134a1.011,1.011,0,0,1-.716-.295l-5.349-5.349-5.349,5.349a1.01,1.01,0,0,1-1.428-1.428l6.065-6.065a1.007,1.007,0,0,1,1.428,0l6.065,6.065a1.009,1.009,0,0,1-.716,1.723Z" transform="translate(-88.05 -160.05)"/>
                                </svg>                                                    
                                </button>
                            </div>
                            <div class="cart-popup__item-price-and-multiplier text-title__secondary-v3">
                                <div class="cart-popup__item-price"></div>
                                <div class="cart-popup__item-price-multiplier">x 2</div>
                            </div>
                            <div class="cart-popup__item-price-total text-title__secondary-v2"></div>
                            </div>                                    
                        </div>
                        </div>                                
                    </div>
                </div>
                `
                sumQuantity += parseInt(cartArray[i].quantity)
                cartOverallSum += cartArray[i].price * cartArray[i].quantity                               
            }
        }
        let cartSumQuantityText 
        if (sumQuantity > 1) {
            cartSumQuantityText = sumQuantity + ' Items'
        } else if (sumQuantity == 1) { 
            cartSumQuantityText = sumQuantity + ' Item' 
        } else if (sumQuantity == 0) {
            cartSumQuantityText = 'No Items'
        }
        DOMStrings.cartItemDisplay.innerHTML = cartContent 
        if (cartArray.length == 0) {
            DOMStrings.cartOverallSum.innerHTML = `&#8369; 0.00`
        } else {
            DOMStrings.cartOverallSum.innerHTML = `&#8369; ${UI.formatNumber(cartOverallSum.toFixed(2))}`
        }        
        DOMStrings.cartPopupItemsTotal.innerHTML = cartSumQuantityText
                
        // Some classes needed after the 'cart popup' is rendered.
        DOMStrings.cartPopupQuantityIncreaseButton = document.querySelectorAll('.cart-popup__quantity-increase-button')              
        DOMStrings.cartPopupQuantityDecreaseButton = document.querySelectorAll('.cart-popup__quantity-decrease-button')
        DOMStrings.cartPopupFormQuantityInput = document.querySelectorAll('.cart-popup__form-quantity-input')
        DOMStrings.cartPopupItemPrice = document.querySelectorAll('.cart-popup__item-price')
        DOMStrings.cartPopupItemPriceTotal = document.querySelectorAll('.cart-popup__item-price-total')
        DOMStrings.cartPopupAlertBoxWrap = document.querySelector('.cart-popup__alert-box-wrap')
        DOMStrings.cartPopupAlertBoxButton = document.querySelector('.cart-popup__alert-box-button')
        DOMStrings.cartPopupRemoveItemButton = document.querySelectorAll('.cart-popup__remove-item-button')
        DOMStrings.cartPopupItemPriceMultiplier = document.querySelectorAll('.cart-popup__item-price-multiplier')

        // Format the 'PRICE' and 'TOTAL' after the 'cart-popup' is rendered.
        for (let i = 0; i < cartArray.length; i++) {
            DOMStrings.cartPopupItemPrice[i].innerHTML = `&#8369; ${UI.formatNumber(cartArray[i].price.toFixed(2))}`
            DOMStrings.cartPopupItemPriceTotal[i].innerHTML = `&#8369; ${UI.formatNumber((cartArray[i].price * cartArray[i].quantity).toFixed(2))}`
            // Then we render the 'multiplier'.
            DOMStrings.cartPopupItemPriceMultiplier[i].innerHTML = `x ${cartArray[i].quantity}`
        }        
    }

    static renderItemQuantityCount() {
        let cartArray = Storage.getCart()
        let totalItems = 0  
        for (let j = 0; j < cartArray.length; j++) {
            // Rendering total items.
            totalItems += parseInt(cartArray[j].quantity)   
        }
        // DOM element for the total items.
        DOMStrings.itemQuantityCount.innerHTML = totalItems
    }

    static renderProductItems() {
        let cartArray = Storage.getCart()      
        for (let i = 0; i < DOMStrings.productBoxFormQuantityInput.length; i++) {
            for (let j = 0; j < cartArray.length; j++) {
                if (DOMStrings.productBoxFormQuantityInput[i].dataset.id == cartArray[j].id) {
                    DOMStrings.productBoxFormQuantityInput[i].value = cartArray[j].quantity
                    DOMStrings.productBoxAddToCartButton[i].textContent = 'in cart'                  
                } 
            }
        }
        this.renderItemQuantityCount()
    }

    static hideAlertPopup() {
        DOMStrings.alertPopup.classList.add('alert__popup-wrap-hidden')
        DOMStrings.alertPopup.classList.remove('alert__popup-wrap-displayed')
        DOMStrings.contentCover.classList.remove('content__cover-displayed') 
    }

    static hideCartPopup() {
        DOMStrings.cartPopupWrap.classList.add('.cart-popup__wrap-hidden')
        DOMStrings.cartPopupWrap.classList.remove('cart-popup__wrap-displayed')
        DOMStrings.contentCover.classList.remove('content__cover-displayed')
    }

    static showAlertPopup(message) {
        DOMStrings.contentCover.classList.add('content__cover-displayed')
        DOMStrings.alertPopup.classList.remove('alert__popup-wrap-hidden')
        DOMStrings.alertPopup.classList.add('alert__popup-wrap-displayed')
        DOMStrings.alertContent.innerHTML = message
    }

    static showCartPopup() {
        DOMStrings.contentCover.classList.add('content__cover-displayed')
        DOMStrings.cartPopupWrap.classList.remove('.cart-popup__wrap-hidden')
        DOMStrings.cartPopupWrap.classList.add('cart-popup__wrap-displayed')
    }

    static disableItemDecreaseButton() {
        for (let i = 0; i < DOMStrings.productBoxFormQuantityInput.length; i++) {
            if (DOMStrings.productBoxFormQuantityInput[i].value == 0) {
                DOMStrings.productBoxQuantityDownButton[i].disabled = true
                DOMStrings.productBoxQuantityDownButton[i].classList.remove('button-icon__primary')
                DOMStrings.productBoxQuantityDownButton[i].classList.add('button-icon__primary-disabled')
            }
        }  
    }

    // Using the destructured 'products' to construct the list of products at the front-end.
    static displayProducts(products) {
        let productBoxInnerHTML = ''
        for (let i = 0; i < products.length; i++) {
            productBoxInnerHTML += `
            <div class="product-box__wrap">
                <div class="product-box__card">
                    <div class="product-box__on-sale-badge">
                        <div class="product-box__on-sale-badge-polygon-1"></div>
                        <div class="product-box__on-sale-badge-polygon-2"></div>
                        <span class="product-box__on-sale-badge-text">sale</span>
                    </div>
                    <div class="product-box__content">                        
                        <div class="product-box__owner-logo">
                            <img src="${products[i].ownerUrl}" alt="${products[i].ownerUrl}" class="product-box__owner-logo-img">
                        </div>
                        <div class="product-box__product-image">
                            <img src="${products[i].imageUrl}" alt="${products[i].title}" class="product-box__product-image-img">
                        </div>
                        <div class="product-box__title-and-description">
                            <div class="product-box__product-title">${products[i].title}</div>
                            <div class="product-box__product-description">${products[i].description}</div>
                        </div>
                        <div class="product-box__add-to-cart-prep">
                            <div class="product-box__add-to-cart-prep-wrap">
                                <div class="product-box__add-to-cart-prep-wrap-left">
                                    <div class="product-box__add-to-cart-prep-input-wrap">
                                        <form action="" class="product-box__form">
                                            <input type="number" class="product-box__form-quantity-input" value="0" placeholder="0" data-id="${products[i].id}">
                                        </form>
                                    </div>                                            
                                    <div class="product-box__add-to-cart-prep-up-down-wrap">
                                        <button class="product-box__quantity-button-up button-icon button-icon__primary" data-id="${products[i].id}">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14.15" height="8.086" viewBox="0 0 14.15 8.086">
                                                <path id="chevron-up" d="M101.188,168.134a1.011,1.011,0,0,1-.716-.295l-5.349-5.349-5.349,5.349a1.01,1.01,0,0,1-1.428-1.428l6.065-6.065a1.007,1.007,0,0,1,1.428,0l6.065,6.065a1.009,1.009,0,0,1-.716,1.723Z" transform="translate(-88.05 -160.05)"/>
                                            </svg>                                                    
                                        </button>
                                        <button class="product-box__quantity-button-down button-icon button-icon__primary" data-id="${products[i].id}">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14.15" height="8.086" viewBox="0 0 14.15 8.086">
                                                <path id="chevron-up" d="M101.188,168.134a1.011,1.011,0,0,1-.716-.295l-5.349-5.349-5.349,5.349a1.01,1.01,0,0,1-1.428-1.428l6.065-6.065a1.007,1.007,0,0,1,1.428,0l6.065,6.065a1.009,1.009,0,0,1-.716,1.723Z" transform="translate(-88.05 -160.05)"/>
                                            </svg>                                                    
                                        </button>
                                    </div>
                                </div>
                                <div class="product-box__add-to-cart-prep-wrap-right">
                                    <div class="product-box__product-price-and-multiplier">
                                        <div class="product-box__product-price-default">&#8369; ${products[i].price.toFixed(2)}</div>
                                        <div class="product-box__product-price-multiplier"></div>
                                    </div>                                    
                                    <div class="product-box__product-price-updated">&#8369; ${products[i].price.toFixed(2)}</div>
                                    <button class="button__primary product-box__button" data-id="${products[i].id}">
                                        <a href="#" class="button__primary-link product-box__add-to-cart-button">add to cart</a>    
                                    </button>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>`
        }
        DOMStrings.productBox.innerHTML = productBoxInnerHTML
        DOMStrings.productBoxQuantityDownButton = document.querySelectorAll('.product-box__quantity-button-down')
        DOMStrings.productBoxBadge = document.querySelectorAll('.product-box__on-sale-badge')
        DOMStrings.productBoxQuantityUpButton = document.querySelectorAll('.product-box__quantity-button-up')
        DOMStrings.productBoxQuantityDownButton = document.querySelectorAll('.product-box__quantity-button-down')      
        DOMStrings.productBoxFormQuantityInput = document.querySelectorAll('.product-box__form-quantity-input')
        DOMStrings.productBoxAddToCartButton = document.querySelectorAll('.product-box__add-to-cart-button')
        DOMStrings.productAddToCartButton = document.querySelectorAll('.product-box__button')
        DOMStrings.productBoxProductPriceMultiplier = document.querySelectorAll('.product-box__product-price-multiplier')
        DOMStrings.productBoxProductPriceDefault = document.querySelectorAll('.product-box__product-price-default')
        DOMStrings.productBoxProductPriceUpdated = document.querySelectorAll('.product-box__product-price-updated')

        // Rendering the formats of the elements to place correct comma ','.
        // 1 'DOMStrings.productBoxProductPriceDefault'
        // 2 'DOMStrings.productBoxProductPriceUpdated'
        for (let i = 0; i < products.length; i++) {
            DOMStrings.productBoxProductPriceDefault[i].innerHTML = `&#8369; ${UI.formatNumber(products[i].price.toFixed(2))}`
            DOMStrings.productBoxProductPriceUpdated[i].innerHTML = `&#8369; ${UI.formatNumber(products[i].price.toFixed(2))}`
        }

        // By default the 'sale' badge is displayed when the products are displayed at the front-end. We hide it here.
        for (let i = 0; i < products.length; i++) {
            if (products[i].sale == false) {
                DOMStrings.productBoxBadge[i].classList.add('product-box__on-sale-badge-hidden')
            }
        }
    }

    static resetMenu() {
        for (let i = 0; i < DOMStrings.menuItemClick.length; i ++) {
            DOMStrings.menuSubmenu[i].classList.remove('menu__submenu-active')
            DOMStrings.menuItemClick[i].classList.remove('menu__item-active')
        }
    }

    static displayMenu() {
        let menuHTML = ''
        for (let i = 0; i < settings.navmenu.length; i++) {
            menuHTML += `
            <div class="menu__item menu__target">
                <div class="menu__link-and-icon menu__target">
                    <a class="menu__link menu__target">${settings.navmenu[i].name}</a>
                    <svg class="menu__link-down-icon menu__target" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 26">
                        <g class="menu__target" id="icon-down-arrow" transform="translate(-8550 2434)">
                            <g class="menu__target" id="Group_175" data-name="Group 175" opacity="0">
                                <rect class="menu__target" id="Rectangle_84" data-name="Rectangle 84" width="24" height="26" transform="translate(8550 -2434)" fill="#fff"/>
                                <rect class="menu__target" id="Rectangle_85" data-name="Rectangle 85" width="20" height="18" transform="translate(8552 -2430)" fill="#d58484"/>
                            </g>
                            <path class="menu__target" id="chevron-up" d="M106.618,171.475a1.428,1.428,0,0,1-1.012-.417L98.047,163.5l-7.559,7.559a1.427,1.427,0,1,1-2.018-2.018l8.571-8.571a1.423,1.423,0,0,1,2.018,0l8.571,8.571a1.426,1.426,0,0,1-1.012,2.434Z" transform="translate(8660.05 -2255.521) rotate(180)"/>
                        </g>
                    </svg>
                </div>
                <div class="menu__submenu">
                    <div class="menu__submenu-wrap"></div>
                </div>
            </div>
            `
        }
        DOMStrings.menuWrap.innerHTML = menuHTML
        DOMStrings.menuItemClick = document.querySelectorAll('.menu__item')
        DOMStrings.menuSubmenu = document.querySelectorAll('.menu__submenu')
        DOMStrings.menuSubmenuWrap = document.querySelectorAll('.menu__submenu-wrap')

        let menuSubmenuHTML = ''
        for (let i = 0; i < settings.navmenu.length; i++) {
            for (let j = 0; j < settings.navmenu[i].submenu.length; j++) {
                menuSubmenuHTML += `
                    <div class="menu__submenu-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 26">
                            <g id="icon-play" transform="translate(-8569 2504)">
                                <g id="Group_179" data-name="Group 179" opacity="0">
                                <rect id="Rectangle_81" data-name="Rectangle 81" width="24" height="26" transform="translate(8569 -2504)" fill="#fff"/>
                                <rect id="Rectangle_82" data-name="Rectangle 82" width="20" height="18" transform="translate(8571 -2500)" fill="#d58484"/>
                                </g>
                                <path id="Union_2" data-name="Union 2" d="M129.493-135.378a1.2,1.2,0,0,1-.464-.737l-.028.02-.016-15.734.03.021a1.17,1.17,0,0,1,.478-.814,1.978,1.978,0,0,1,2.325,0l9.872,7.714a1.1,1.1,0,0,1,0,1.817l-9.872,7.714a1.9,1.9,0,0,1-1.165.378A1.883,1.883,0,0,1,129.493-135.378Z" transform="translate(8445.016 -2347)"/>
                            </g>
                        </svg>
                        <a href="#" class="menu__submenu-item-link">${settings.navmenu[i].submenu[j].name}</a>
                    </div>
                `
            }
            DOMStrings.menuSubmenuWrap[i].innerHTML = menuSubmenuHTML
            menuSubmenuHTML = ''
        }
    }
}

class Events {
    static clearCart() {
        DOMStrings.cartPopupClearCartButton.addEventListener('click', function() {
            cartArray = []
            Storage.saveCart(cartArray)
            UI.setupCart()            
            UI.renderItemQuantityCount()
            UI.processCartPopupOverallTotal()
            Events.cartPopupIncreaseQuantity()
            Events.cartPopupDecreaseQuantity()
            Events.hideCartPopupAlert()
            Events.removeCartItem()
            if (cartArray.length == 0) {
                for (let i = 0; i < DOMStrings.productBoxFormQuantityInput.length; i++) {
                    UI.resetProductBoxValues(i)
                }   
            }
            DOMStrings.cartPopupClearCartButton.disabled = true
            DOMStrings.cartPopupClearCartButton.classList.remove('button__tertiary')
            DOMStrings.cartPopupClearCartButton.classList.add('button__tertiary-disabled')

            UI.disableItemDecreaseButton()
        })
    }

    // Remove cart item button.
    static removeCartItem() {        
        for (let i = 0; i < DOMStrings.cartPopupRemoveItemButton.length; i++) {
            // We attach a 'click event listener' to the current x button that is clicked.
            DOMStrings.cartPopupRemoveItemButton[i].addEventListener('click', function() {
                // We loop through the 'cartArray' to see if the 'dataset.id' of the current x button clicked exist in the
                // 'cartArray' throught the 'cartArray' current id.
                for (let j = 0; j < cartArray.length; j++) {
                    // If the loop encounters 'Elements' that are not equal to the current x button clicked 'dataset.id', then we
                    // push those 'Elements' to the 'cartItemToSave'. If the loop encounters a match, then we push the 'Element' to the
                    // 'cartArrayItemToDelete'. The 'Element' within the 'cartArrayItemToDelete' refers to a product item that was removed
                    // from the 'cart-popup'.
                    if (DOMStrings.cartPopupRemoveItemButton[i].dataset.id != cartArray[j].id) {
                        cartArrayItemToSave.push(cartArray[j])
                    } else { // The loop found a match.                    
                        cartArrayItemToDelete.push(cartArray[j])
                    }
                }
                // We update the 'cartArray' with the 'cartArrayItemToSave', this means, we are updating the 'cart' in the 'Local Storage'.
                cartArray = cartArrayItemToSave
                Storage.saveCart(cartArray)
                cartArrayItemToSave = []
                // Then we remove the corresponding 'HTML Element' at the front-end.
                DOMStrings.cartPopupRemoveItemButton[i].parentElement.parentElement.parentElement.remove()                
                // Then at the front-end, behind the 'cart-popup', we need to update the corresponding product that was removed from the
                // 'cart-popup'.
                for (let k = 0; k < DOMStrings.productBoxFormQuantityInput.length; k++) {
                    // Looping through 'cartArrayItemToDelete' which will have only 1 'Element', the product item that was removed from the
                    // 'cart-popup'.
                    for (let l = 0; l < cartArrayItemToDelete.length; l++) {
                        if (DOMStrings.productBoxFormQuantityInput[k].dataset.id == cartArrayItemToDelete[l].id) {
                            DOMStrings.productBoxFormQuantityInput[k].value = 0
                            DOMStrings.productBoxAddToCartButton[k].textContent = 'add to cart'
                            UI.disableItemDecreaseButton()
                            DOMStrings.productBoxProductPriceUpdated[k].innerHTML = `&#8369; ${UI.formatNumber(cartArrayItemToDelete[l].price.toFixed(2))}`
                            DOMStrings.productBoxProductPriceMultiplier[k].innerHTML = ''
                        }
                    }
                }

                cartArrayItemToDelete = []

                UI.setupCart()
                UI.processCartPopupOverallTotal()
                Events.cartPopupIncreaseQuantity()
                Events.cartPopupDecreaseQuantity()             
                UI.renderItemQuantityCount()                
                Events.removeCartItem()
            })            
        }        
    }

    static hideCartPopupAlert() {
        DOMStrings.cartPopupAlertBoxButton.addEventListener('click', function() {
            DOMStrings.cartPopupAlertBoxWrap.classList.remove('cart-popup__alert-box-wrap-displayed')
            DOMStrings.cartPopupAlertBoxWrap.classList.add('cart-popup__alert-box-wrap-hidden')
        })        
    }
    // Cart popup decrease quantity button.
    static cartPopupDecreaseQuantity() {
        for (let i = 0; i < DOMStrings.cartPopupQuantityDecreaseButton.length; i++) {
            DOMStrings.cartPopupQuantityDecreaseButton[i].addEventListener('click', function() {
                // When current 'cart popup input value' is 1.
                if (DOMStrings.cartPopupFormQuantityInput[i].value == 1) {
                    DOMStrings.cartPopupFormQuantityInput[i].value = parseInt(DOMStrings.cartPopupFormQuantityInput[i].value) - 1
                    DOMStrings.cartPopupQuantityDecreaseButton[i].disabled = true
                    DOMStrings.cartPopupQuantityDecreaseButton[i].classList.remove('button-icon__quaternary')
                    DOMStrings.cartPopupQuantityDecreaseButton[i].classList.add('button-icon__quaternary-disabled')
                    for (let k = 0; k < cartArray.length; k++) {
                        if (DOMStrings.cartPopupQuantityDecreaseButton[i].dataset.id != cartArray[k].id) {
                            cartArrayItemToSave.push(cartArray[k])
                        } else {
                            cartArrayItemToDelete.push(cartArray[k])
                        }
                    }
                    cartArray = cartArrayItemToSave
                    Storage.saveCart(cartArray)
                    cartArrayItemToSave = []                    
                    DOMStrings.cartPopupRemoveItemButton[i].parentElement.parentElement.parentElement.remove()

                    for (let l = 0; l < DOMStrings.productBoxFormQuantityInput.length; l++) {
                        for (let i = 0; i < cartArrayItemToDelete.length; i++) {
                            if (DOMStrings.productBoxFormQuantityInput[l].dataset.id == cartArrayItemToDelete[i].id) {
                                DOMStrings.productBoxFormQuantityInput[l].value = 0
                                DOMStrings.productBoxAddToCartButton[l].textContent = 'add to cart'
                                UI.disableItemDecreaseButton()
                                DOMStrings.productBoxProductPriceUpdated[l].innerHTML = `&#8369; ${UI.formatNumber(cartArrayItemToDelete[i].price.toFixed(2))}`
                                DOMStrings.productBoxProductPriceMultiplier[l].innerHTML = ''
                            }
                        }
                    }
    
                    cartArrayItemToDelete = []
    
                    UI.setupCart()
                    UI.processCartPopupOverallTotal()
                    Events.cartPopupIncreaseQuantity()
                    Events.cartPopupDecreaseQuantity()             
                    UI.renderItemQuantityCount()                
                    Events.removeCartItem()
                }
                if (DOMStrings.cartPopupFormQuantityInput[i].value > 1) {
                    DOMStrings.cartPopupFormQuantityInput[i].value = parseInt(DOMStrings.cartPopupFormQuantityInput[i].value) - 1
                }
                if (DOMStrings.cartPopupFormQuantityInput[i].value > 0) {                                        
                    let productItem = Storage.getProduct(DOMStrings.cartPopupFormQuantityInput[i].dataset.id)
                    let productPriceAndQuantity = productItem.price * DOMStrings.cartPopupFormQuantityInput[i].value
                    DOMStrings.cartPopupItemPriceTotal[i].innerHTML = `&#8369; ${UI.formatNumber(productPriceAndQuantity.toFixed(2))}`

                    DOMStrings.cartPopupItemPriceMultiplier[i].innerHTML = `x ${DOMStrings.cartPopupFormQuantityInput[i].value}`

                    UI.processCartPopupOverallTotal()
                    UI.renderItemQuantityCount()
                    Events.clearCart()
                }                
            })
        }
    }
    static cartPopupIncreaseQuantity() {
        // Increase quantity functionality of the 'cart items' of the cart popup by 1.
        // Looping through each 'increase button' then attaching a 'click event listener to the current button clicked. When we say
        // current, it's represented by 'i' in this for loop.
        for (let i = 0; i < DOMStrings.cartPopupQuantityIncreaseButton.length; i++) {
            DOMStrings.cartPopupQuantityIncreaseButton[i].addEventListener('click', function() {
                let productPriceAndQuantity = 0
                // We check it the 'input value' of the current input element with the class 'cart-popup__form-quantity-input' if it reaches
                // the 'limit' we set at the 'settings.js'.
                if (DOMStrings.cartPopupFormQuantityInput[i].value != settings.perItemLimit[0]) {
                    // If the 'input value' is not greater than the 'limit'.
                    // Increasing the current 'input value' in the 'cart popup' by 1, then enabling the 'item decrease button'.
                    DOMStrings.cartPopupFormQuantityInput[i].value = parseInt(DOMStrings.cartPopupFormQuantityInput[i].value) + 1
                    DOMStrings.cartPopupQuantityDecreaseButton[i].disabled = false
                    DOMStrings.cartPopupQuantityDecreaseButton[i].classList.add('button-icon__quaternary')
                    DOMStrings.cartPopupQuantityDecreaseButton[i].classList.remove('button-icon__quaternary-disabled')                

                    let productItem = Storage.getProduct(DOMStrings.cartPopupFormQuantityInput[i].dataset.id)
                    productPriceAndQuantity = productItem.price * DOMStrings.cartPopupFormQuantityInput[i].value
                    DOMStrings.cartPopupItemPriceTotal[i].innerHTML = `&#8369; ${UI.formatNumber(productPriceAndQuantity.toFixed(2))}`

                    DOMStrings.cartPopupItemPriceMultiplier[i].innerHTML = `x ${DOMStrings.cartPopupFormQuantityInput[i].value}`

                } else {
                    // If it's greater than the 'limit' we will show an alert.
                    if (DOMStrings.cartPopupAlertBoxWrap.classList.contains('cart-popup__alert-box-wrap-hidden')) {
                        DOMStrings.cartPopupAlertBoxWrap.classList.remove('cart-popup__alert-box-wrap-hidden')
                        DOMStrings.cartPopupAlertBoxWrap.classList.add('cart-popup__alert-box-wrap-displayed')
                    }
                }
                UI.processCartPopupOverallTotal()
                UI.renderItemQuantityCount()
                Events.clearCart()
            })
        }
    }    

    static closeAlertPopup() {
        DOMStrings.alertPopupButton.addEventListener('click', function() {
            UI.hideAlertPopup()          
        })
    }

    static decreaseItemQuantity() {
        // Creating a 'click event' to the current element with class 'product-box__quantity-button-down' which will be triggered
        // through a click, decreasing the input value.
        for (let i = 0; i < DOMStrings.productBoxQuantityDownButton.length; i++) {
            DOMStrings.productBoxQuantityDownButton[i].addEventListener('click', function() {
                // If the input value is equal to 1, we deduct 1 to it but we will disable the current button to decrease the input value which is
                // the element with the class 'product-box__quantity-button-down'.
                if (DOMStrings.productBoxFormQuantityInput[i].value > 2) {
                    DOMStrings.productBoxFormQuantityInput[i].value = parseInt(DOMStrings.productBoxFormQuantityInput[i].value) - 1  
                    DOMStrings.productBoxAddToCartButton[i].textContent = 'update cart'
                    UI.setProductBoxItemMultiplier(i, '')               
                    return
                }
                if (DOMStrings.productBoxFormQuantityInput[i].value != 0 && DOMStrings.productBoxFormQuantityInput[i].value == 2) {
                    DOMStrings.productBoxFormQuantityInput[i].value = parseInt(DOMStrings.productBoxFormQuantityInput[i].value) - 1  
                    DOMStrings.productBoxAddToCartButton[i].textContent = 'in cart'
                    UI.setProductBoxItemMultiplier(i, '')         
                    return
                }
                if (DOMStrings.productBoxFormQuantityInput[i].value == 1) {
                    DOMStrings.productBoxFormQuantityInput[i].value = parseInt(DOMStrings.productBoxFormQuantityInput[i].value) - 1
                    DOMStrings.productBoxAddToCartButton[i].textContent = 'add to cart'
                    let cart = Storage.getCart()
                    cartArray = cart
                    for (let j = 0; j < cartArray.length; j++) {
                        if (DOMStrings.productBoxFormQuantityInput[i].dataset.id != cartArray[j].id) {
                            cartArrayItemToSave.push(cartArray[j])                                        
                        }
                    }
                    cartArray = cartArrayItemToSave
                    Storage.saveCart(cartArray)
                    cartArrayItemToSave = []
                    UI.disableItemDecreaseButton()
                    UI.setProductBoxItemMultiplier(i, '')
                }
                UI.renderItemQuantityCount()                    
            })
        }
    }
    static increaseItemQuantity() {
        // Attaching a 'click' event to the current element with class 'product-box__quantity-button-up' which will be triggered
        // through a mouse click, increasing the input value.
        for (let i = 0; i < DOMStrings.productBoxQuantityUpButton.length; i++) {
            DOMStrings.productBoxQuantityUpButton[i].addEventListener('click', function() {
                // We check if the input value of the current element with class 'product-box__form-quantity-input' does not reach the limit
                // value we set in the 'settings object'. If it's not within limit, we execute the next logic, else, we display the 'alert popup'.
                if (DOMStrings.productBoxFormQuantityInput[i].value != settings.perItemLimit[0]) {
                    DOMStrings.productBoxFormQuantityInput[i].value = parseInt(DOMStrings.productBoxFormQuantityInput[i].value) + 1
                    // By default, the input value will be zero, if it's increased to 1, we add it to the 'cart' in the 'local storage', then add
                    // a new property value, 'quantity'. Then we setup the 'cart' where we can see it when the 'cart button' is clicked.
                    if (DOMStrings.productBoxFormQuantityInput[i].value == 1) {
                        let productItem = Storage.getProduct(DOMStrings.productBoxQuantityUpButton[i].dataset.id)
                        cartArray.push({...productItem, quantity: 1})
                        Storage.saveCart(cartArray)
                        DOMStrings.productBoxAddToCartButton[i].textContent = 'in cart'
                    }
                    if (DOMStrings.productBoxFormQuantityInput[i].value > 1) {
                        DOMStrings.productBoxAddToCartButton[i].textContent = 'update cart'
                    }
                    if (DOMStrings.productBoxFormQuantityInput[i].value > 0) {
                        DOMStrings.productBoxQuantityDownButton[i].disabled = false
                        DOMStrings.productBoxQuantityDownButton[i].classList.add('button-icon__primary')
                        DOMStrings.productBoxQuantityDownButton[i].classList.remove('button-icon__primary-disabled')
                    }                    
                }
                else { // Reach limit.
                    let message = 'a maximum of 10 per item is allowed!'
                    UI.showAlertPopup(message)
                }
                UI.renderItemQuantityCount()
                UI.setProductBoxItemMultiplier(i, '')
            })
        }
    }

    static doAddTocartButton() {
        // Loop through all class '.product-box__button' and attached the 'click event listener'.
        for (let i = 0; i < DOMStrings.productAddToCartButton.length; i++) {
            // Attaching the 'click event listener' to the current 'add to cart' button clicked.
            DOMStrings.productAddToCartButton[i].addEventListener('click', function() {
                // Checing if the current 'ADD TO CART' button has a textContent of 'UPDATE CART'.
                if (DOMStrings.productAddToCartButton[i].children[0].textContent == 'update cart') {
                    // Checking if the current 'product' exist in the 'cartArray' that's why we nned to loop through
                    // the 'cartArray'.
                    for (let j = 0; j < cartArray.length; j++) {
                        // If the current 'product' exist in the 'cartArray', we will check if the updated 'item quantity input' 
                        // is greater than zero, then check if it's equal to zero. If it's greater than zero, we update the current
                        // 'product quantity', then save it in the 'local storage'. If it's zero, we will remove it to the 'local
                        // storage' and 'cartArray'.
                        if (DOMStrings.productAddToCartButton[i].dataset.id == cartArray[j].id) {
                            // If it's greater than zero, we update the current 'product quantiy', then save it to the 'local
                            // storage.
                            if (DOMStrings.productBoxFormQuantityInput[i].value > 0) {
                                cartArray[j].quantity = DOMStrings.productBoxFormQuantityInput[i].value
                                Storage.saveCart(cartArray)
                            } 
                            // If it's zero, we remove the current 'product' to the 'local storage', then remove it from the
                            // 'cartArray'.
                            if (DOMStrings.productBoxFormQuantityInput[i].value == 0) {
                                for (let k = 0; k < cartArray.length; k++) {
                                    if (DOMStrings.productBoxFormQuantityInput[i].dataset.id != cartArray[k].id) {
                                        cartArrayItemToSave.push(cartArray[k])                                        
                                    }
                                }
                                cartArray = cartArrayItemToSave
                                Storage.saveCart(cartArray)
                                cartArrayItemToSave = []
                            }
                        }                
                    }
                    DOMStrings.productAddToCartButton[i].children[0].textContent = 'in cart'
                }
                // Checing if the current 'ADD TO CART' button has a textContent of 'ADD TO CART'. 
                if (DOMStrings.productAddToCartButton[i].children[0].textContent == 'add to cart') {
                    console.log('boooo')                    
                    DOMStrings.productBoxFormQuantityInput[i].value = parseInt(DOMStrings.productBoxFormQuantityInput[i].value) + 1
                    let productItem = Storage.getProduct(DOMStrings.productBoxQuantityUpButton[i].dataset.id)
                    cartArray.push({...productItem, quantity: 1})
                    Storage.saveCart(cartArray)
                    DOMStrings.productBoxAddToCartButton[i].textContent = 'in cart'
                }
                UI.renderItemQuantityCount()                
            })
        }
    }

    static doContentCover() {
        DOMStrings.contentCover.addEventListener('click', function() {
            if (DOMStrings.cartPopupWrap.classList.contains('cart-popup__wrap-displayed')) {
                UI.hideCartPopup()
            }
            if (DOMStrings.alertPopup.classList.contains('alert__popup-wrap-displayed')) {
                UI.hideAlertPopup()
            }
        }) 
    }
    // Cart popup continue shopping button.
    static continueShopping() {
        DOMStrings.continueShoppingButton.addEventListener('click', function() {
            UI.hideCartPopup()
        })
    }
    // Cart popup close button.
    static closeCartPopup() {
        DOMStrings.cartPopupCloseButton.addEventListener('click', function() {
            UI.hideCartPopup()
        })    
    }
    // Shopping cart button.
    static doCartButton() {
        DOMStrings.cartShoppingCartButton.addEventListener('click', function() {
            if (cartArray.length == 0) {
                DOMStrings.cartPopupCheckoutButton.classList.remove('button__primary')
                DOMStrings.cartPopupCheckoutButton.classList.add('button__primary-disabled')
            } else {
                DOMStrings.cartPopupCheckoutButton.classList.add('button__primary')
                DOMStrings.cartPopupCheckoutButton.classList.remove('button__primary-disabled')
            }
            UI.setupCart()
            Events.cartPopupIncreaseQuantity()
            Events.cartPopupDecreaseQuantity()
            Events.hideCartPopupAlert()
            Events.removeCartItem()
            UI.showCartPopup()
            Events.clearCart()            
        })
    }
    static notMenuTarget() {
        window.addEventListener('click', function(event) {
            const menuTarget = event.target.classList.contains('menu__target')            
            if (!menuTarget) { UI.resetMenu() }
        })
    }
    static showMenuSubmenu() {
        for (let i = 0; i < DOMStrings.menuItemClick.length; i++) {
            DOMStrings.menuItemClick[i].addEventListener('click', function() {
                UI.resetMenu()
                DOMStrings.menuSubmenu[i].classList.add('menu__submenu-active')
                DOMStrings.menuItemClick[i].classList.add('menu__item-active')
            })
        }
    }    
    static toggleMenu() {
        // Hamburger menu click.
        DOMStrings.hamburgerMenuButtonClick.addEventListener('click', function() {
            DOMStrings.hamburgerMenuButtonClick.classList.toggle('hamburger-menu__button-active')
            DOMStrings.menu.classList.toggle('menu__active')
        })
    }
}

class Products {    
    // Destructuring data from 'data.json' and returning it as 'products'.
    static async getProducts() {
        // But then, decided to use 'contentful', thus, we are now going to destructure the data according to the
        // 'contentful JavaScript SDK on Github'.
        // https://github.com/contentful/contentful.js
        // https://contentful.github.io/contentful.js/contentful/9.1.18/

        const client = contentful.createClient({
            // This is the space ID. A space is like a project folder in Contentful terms
            space: "t55ovi3p6u02",
            // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
            accessToken: "4cwLNQxGmwLzIO8ypdUR5laQVELGeXmmEqF3RB9USSg"
        });

        try {
            // Using 'contentful'.
            const contentful = await client.getEntries({
                content_type: 'productsToCart'
            })
            // Local data from 'data.json'.
            // let fetchData = await fetch('data.json')
            // let awaitData = await fetchData.json()            
            //let products = awaitData.items

            let products = contentful.items
            // console.log('products before',products)
            products = products.map(item => {
                const {id} = item.sys
                const {title, price, description, sale} = item.fields
                const {image: {fields: {file: {url: imageUrl}}}} = item.fields
                const {owner: {fields: {file: {url: ownerUrl}}}} = item.fields
                return {id, title, price, description, sale, imageUrl, ownerUrl}
            })
            // console.log('products after',products)        
            return products
        } catch (error) {}
    }
}

class Storage {
    // Getting 'cart' on 'LocalStorage'.
    static getCart() {
        let cart = localStorage.getItem('cart')
        if (cart) {
            return JSON.parse(localStorage.getItem('cart'))
        } else {
            return []
        }
    }
    // Saving 'cart' into 'LocalStorage'.
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    // Getting a single product in 'LocalStorage'. If the 'id' matches, it returns the
    // corresponding 'product'.
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'))
        for (let i = 0; i < products.length; i++) {
            if (id == products[i].id) {
                return products[i]
            }
        }
    }
    // Saving 'products' to 'LocalStorage'.
    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products))
    }
    // Setting 'cartArray'.
    static setCartArray() {
        let cart = this.getCart()   
        cartArray = cart
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Constructing 'navmenu', data are available from 'settings.js', 'settings object'.
    UI.displayMenu()    

    // Some events.
    Events.toggleMenu()
    Events.showMenuSubmenu()
    Events.notMenuTarget()
    Events.doCartButton()    
    Events.closeCartPopup()
    Events.doContentCover()
    Events.closeAlertPopup()    
    Events.continueShopping()    

    // Getting products from 'data.json' and displaying it on the front-end.
    Products.getProducts().then(function(products) {
        Storage.saveProducts(products)
        UI.displayProducts(products) // Displaying data from 'data.json'.
        Storage.setCartArray()
        UI.renderProductItems()
        UI.setProductBoxItemMultiplier('','page-load')
        Events.increaseItemQuantity()
        Events.decreaseItemQuantity()
        Events.doAddTocartButton()
        UI.disableItemDecreaseButton()        
    })
})