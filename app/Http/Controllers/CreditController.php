<?php

namespace App\Http\Controllers;


use App\Models\Credit;
use App\Models\Debtor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

use Inertia\Response;

class CreditController extends Controller
{

    public function saveCredit(Request $request) {

        $validated = $request->validate([
            'borrowerName' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'term' => 'required|integer|min:3|max:120',
        ], [
            'borrowerName.required' => 'The borrower name is required.',
            'amount.required' => 'The amount is required.',
            'amount.numeric' => 'The amount must be a number.',
            'amount.min' => 'The amount must be at least 1.',
            'term.required' => 'The term is required.',
            'term.integer' => 'The term must be an integer.',
            'term.min' => 'The term must be at least 3 months.',
            'term.max' => 'The term may not be greater than 120 months.',
        ]);

        $debtor = Debtor::where('name', $validated['borrowerName'])->first();

        if ($debtor) {
            // Calculate the total sum of all credits for this debtor
            $totalCredits = Credit::where('debtor_id', $debtor->id)->sum('amount');

            // Check if adding this new credit would exceed the total credit limit
            if ($totalCredits + $validated['amount'] > Debtor::CREDIT_LIMIT) {
                return response()->json([
                    'message' => 'Total credit amount exceeds the allowed limit.',
                ], 400);
            }

            // Debtor with this name exists, create a credit for this debtor
            $credit =  Credit::create([
                'debtor_id' => $debtor->id,  // Associate with the debtor's ID
                'amount' => $validated['amount'],
                'amountLeft' => $validated['amount'], // Set initial amountLeft to the loan amount
                'term' => $validated['term']
            ]);

            return response()->json([
                'message' => 'Credit created successfully',
            ]);

        } else {
            $debtor = Debtor::create([
                'name' => $validated['borrowerName'],
            ]);

            $credit =  Credit::create([
                'debtor_id' => $debtor->id,  // Associate with the debtor's ID
                'amount' => $validated['amount'],
                'amountLeft' => $validated['amount'], // Set initial amountLeft to the loan amount
                'term' => $validated['term']
            ]);

            return response()->json([
                'message' => 'New debtor and credit created successfully',
            ]);
        }

    }

    //Return all credits from the DB
    public function getCredits(): JsonResponse {
        // Retrieve all credits from the database
        $credits = Credit::with('debtor') // Assuming you want to load debtor info as well
        ->get(['id', 'amount', 'term', 'amountLeft', 'debtor_id']); // Specify the columns to retrieve

        // Transform the credits into the desired format
        $creditsArray = $credits->map(function($credit) {
            return [
                'id' => $credit->id,
                'borrowerName' => $credit->debtor->name, // Assuming there's a relationship defined
                'amount' => $credit->amount,
                'term' => $credit->term,
                'monthlyPayment' => $this->calculateMonthlyPayment($credit->amount, $credit->term), // You can create a method to calculate this
            ];
        });

        return response()->json($creditsArray);
    }
    public function calculateMonthlyPayment($amount, $term)
    {
        // Convert annual rate to a monthly rate
        $monthlyRate = Credit::RATE / 100 / 12; // Convert percentage to a decimal and then to a monthly rate

        // Total number of payments
        $n = $term;

        // Monthly payment calculation using the formula
        if ($monthlyRate > 0) {
            $monthlyPayment = $amount * ($monthlyRate * pow(1 + $monthlyRate, $n)) / (pow(1 + $monthlyRate, $n) - 1);
        } else {
            $monthlyPayment = $amount / $n; // If interest rate is 0, just divide the amount by the number of terms
        }

        return round($monthlyPayment, 2); // Round to two decimal places for currency
    }

    //Used in Payments page returns the name and the amount left to pay
    public function getCreditsAmountLeft() {
        $loans = Credit::with('debtor')->get(); // Assuming a Loan model with a relationship to Debtor
        return response()->json($loans);
    }

    public function makePayment(Request $request) {
        // Validate the incoming request data
        $validated = $request->validate([
            'credit_id' => 'required|exists:credits,id',
            'payment_amount' => 'required|numeric|min:0.01',
        ]);

        // Retrieve the credit record
        $credit = Credit::findOrFail($validated['credit_id']);


        // Check if the payment amount is more than the amount left
        if ($validated['payment_amount'] > $credit->amountLeft) {
            return response()->json([
                'message' => 'Payment amount exceeds the amount left for this credit.'
            ], 400);
        }

        // Subtract the payment amount from the amount left
        $credit->amountLeft -= $validated['payment_amount'];

        // Save the updated credit
        $credit->save();

        return response()->json([
            'message' => 'Payment successfully applied.',
            'credit' => $credit
        ]);
    }

}
