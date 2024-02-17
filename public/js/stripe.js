import axios from 'axios';
import { showAlert } from './alert';
const Stripe = require('stripe');
const stripe = Stripe('pk_test_51OkUROSC6lp7Mt7a4NAy317DSCMiarJYzfPVYxok9ylfCqQhGiGfsN0N2kOPNRXyowsWHgzGujM7j8zoCJtvuT1k00aAvunaVK');

export const bookTour = async tourId => {
    try {
        // 1) Get checkout session from API
        const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);

        console.log(session);

        // 2) Create checkout form + charge credit card
        // await stripe.redirectToCheckout({
        //     sessionId: session.data.session.id
        // });
        window.location.replace(session.data.session.url);

    } catch (err) {
        console.error(err);
        showAlert('error', err);
    }
}