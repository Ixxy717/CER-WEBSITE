// Netlify serverless function — creates a Stripe PaymentIntent
//
// SETUP:
//   1. Go to dashboard.stripe.com → Developers → API keys
//   2. Copy your Secret Key (starts with sk_live_... for production, sk_test_... for testing)
//   3. In Netlify dashboard → Site → Environment Variables, add:
//      STRIPE_SECRET_KEY = your secret key
//   4. Never commit your secret key to version control
//
// This function is called by TVCalculator.astro when the user clicks "Proceed to Payment".
// It creates a PaymentIntent server-side so the amount cannot be manipulated by the browser.

const Stripe = require('stripe');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let inches;
  try {
    ({ inches } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!inches || typeof inches !== 'number' || inches <= 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid inches value' }) };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Amount in cents — $1.00 per inch
  const amount = Math.round(inches * 100);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description: `TV Recycling Fee — ${inches} inch TV`,
      metadata: { tv_size_inches: String(inches) },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (err) {
    console.error('Stripe error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create payment intent' }),
    };
  }
};
