<?php

use App\Http\Controllers\CreditController;
use Illuminate\Support\Facades\Route;

Route::post('/saveCredit',   [CreditController::class, 'saveCredit'])  ->name('saveCredit');

Route::get('/getCredits',   [CreditController::class, 'getCredits'])  ->name('getCredits');

Route::get('/getCreditsAmountLeft',[CreditController::class, 'getCreditsAmountLeft']) ->name('getCreditsAmountLeft');

Route::post('/makePayment',[CreditController::class, 'makePayment']) ->name('makePayment');



