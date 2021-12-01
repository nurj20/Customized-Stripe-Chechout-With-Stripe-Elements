<?php
require './vendor/autoload.php';
header('Content-Type: application/json');

$stripe = new \Stripe\StripeClient("REPLACE_WITH_YOUR_OWN_STRIPE_SECRET_KEY");
$paymentIntent = $stripe->paymentIntents->create([
    'amount' => 2000,
    'currency' => 'gbp',
    'payment_method_types' =>['card'],
    'description' =>'Payment Collected on behalf of ShopOnline.com'
]);

echo json_encode(['client_secret' => $paymentIntent->client_secret]);
