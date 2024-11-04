import React, { useState, useEffect } from 'react';
import Header from "@/Components/Header.jsx";

export default function NewPaymentFormPage() {
    const [formData, setFormData] = useState({
        selectedLoan: '',
        paymentAmount: '',
    });
    const [loans, setLoans] = useState([]); // State to hold loans

    const [message, setMessage] = useState(null); // State to hold success or error message
    const [messageType, setMessageType] = useState(null); // State to determine message type
    // Fetch loans from the API
    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await fetch('/api/getCreditsAmountLeft'); // Adjust the URL if necessary
                console.log('=================response==============');
                console.log(response);
                if (!response.ok) {
                    throw new Error('Failed to fetch loans');
                }
                const data = await response.json();
                setLoans(data);
            } catch (error) {
                console.error('Error fetching loans:', error);
            }
        };

        fetchLoans();
    }, []); // Empty dependency array means this runs once on mount

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/makePayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    credit_id: formData.selectedLoan,
                    payment_amount: formData.paymentAmount,
                }),
            });

            const result = await response.json();


            if (response.ok) {
                // Show success message
                setMessage(result.message);
                setMessageType('success');

                setFormData({ selectedLoan: '', paymentAmount: '' });

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                // Show error message
                setMessage(result.message);
                setMessageType('error');
            }

        } catch (error) {
            console.error('Error submitting payment:', error);
            setMessage('An error occurred while submitting the payment.');
            setMessageType('error');
        }
    };

    return (
        <div>
            <Header />

            {message && (
                <div
                    className={`message ${messageType === 'success' ? 'message--success' : 'message--error'}`}
                >
                    {message}
                </div>
            )}

            <form className="form" onSubmit={handleSubmit}>
                <label className="label" htmlFor="selectedLoan">Select Loan</label>
                <select
                    className="select"
                    id="selectedLoan"
                    name="selectedLoan"
                    value={formData.selectedLoan}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Select Loan --</option>
                    {loans.map((loan) => (
                        <option key={loan.id} value={loan.id}>
                            {loan.debtor.name} - Amount: {loan.amountLeft} BGN
                        </option>
                    ))}
                </select>

                <label className="label" htmlFor="paymentAmount">Payment Amount (in BGN)</label>
                <input
                    className="input"
                    type="number"
                    id="paymentAmount"
                    name="paymentAmount"
                    value={formData.paymentAmount}
                    onChange={handleChange}
                    required
                />

                <button className="button" type="submit">Submit Payment</button>
            </form>
        </div>
    );
}
