const stripe = Stripe('REPLACE_WITH_YOUR_OWN_STRIPE_PUBLIC_KEY')
const cardnum = document.querySelector('#cardnum')
const cardexp = document.querySelector('#cardexp')
const cardcvc = document.querySelector('#cardcvc')
const btn = document.querySelector('button')
const sts = document.querySelector('.status')

const mystyle={
    base:{iconColor:'rgb(128, 128, 255)',
    color:'rgb(128, 128, 255)',
    fontFamily:'sans-serif',
    '::placeholder': { color:'#757593'}
    },
    complete:{ color:'green'}
}

const elements = stripe.elements()

const numElm = elements.create('cardNumber',{showIcon:true,iconStyle:'solid', style:mystyle})
numElm.mount(cardnum)
    
const expElm = elements.create('cardExpiry', {disabled:true, style:mystyle})
expElm.mount(cardexp)

const cvcElm = elements.create('cardCvc', {disabled:true, style:mystyle})
cvcElm.mount(cardcvc)

numElm.on('change', (e) =>{
    if(e.complete){
        expElm.update({disabled:false})
        expElm.focus()
    }
})

expElm.on('change', (e) =>{
    if(e.complete){
        cvcElm.update({disabled:false})
        cvcElm.focus()
    }
})

cvcElm.on('change', (e) =>{
    if(e.complete){
       btn.disabled = false 
    }
})

btn.addEventListener('click', ()=>{
    fetch('/paymentIntent.php', {
        method:'POST', 
        headers:{'Content-Type': 'application/json'},
        body:{}
    })
    .then(res=>res.json())
    .then(payload => {
        stripe.confirmCardPayment(payload.client_secret, {
            payment_method:{card:numElm}
        }).then(transStat => {
            if(transStat.error){
                sts.innerHTML = `
                <strong>Error:  </string> ${transStat.error.message}
                `
            }
            else{
                sts.innerHTML = `
               <h3>${transStat.paymentIntent.description}</h3>
               <strong>Transction Id: </strong>${transStat.paymentIntent.id}<br>
               <strong>Amount deducted: </strong> ${transStat.paymentIntent.amount/100} ${transStat.paymentIntent.currency}
                `
            }
            sts.style.display='block'
        })
    })
})


