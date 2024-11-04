<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('CreditTable');
})->name('creditTable');

Route::get('/new-loan', function () {
    return Inertia::render('NewLoanFormPage');
})->name('newLoanForm');

Route::get('/new-payment', function () {
    return Inertia::render('NewPaymentFormPage');
})->name('newPayment');
