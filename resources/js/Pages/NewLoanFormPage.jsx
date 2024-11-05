import React, { useState } from 'react';
import Header from "@/Components/Header.jsx";
// TODO validation
export default function NewLoanFormPage() {
    const [formData, setFormData] = useState({
        borrowerName: '',
        amount: '',
        term: '3',
    });
    const [notification, setNotification] = useState(null);
    const [notificationType, setNotificationType] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the amount is not null or empty
        if (!formData.amount) {
            setNotification('Amount must not be null or empty.');
            setNotificationType('error');
            return; // Prevent the form from being submitted
        }

        if (Number(formData.amount) <= 0) {
            setNotification('Amount must be a positive number.');
            setNotificationType('error');
            return; // Prevent the form from being submitted
        }

        try {
            const response = await fetch('/api/saveCredit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                // Successful loan creation
                setNotification('Loan Created Successfully');
                setNotificationType('success');

                // Reset the form
                setFormData({
                    borrowerName: '',
                    amount: '',
                    term: '3',
                });

                // Refresh the page after a delay
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                // Credit limit exceeded error
                setNotification(result.message || 'Failed to create loan');
                setNotificationType('error');
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            setNotification('An error occurred while submitting the loan.');
            setNotificationType('error');
        }
    };

    return (
        <div>
            <Header />
            {notification && (
                <div
                    className={`notification ${notificationType}`}
                    style={{
                        color: notificationType === 'success' ? 'green' : 'red',
                        marginBottom: '10px'
                    }}
                >
                    {notification}
                </div>
            )}

            <form className="form" onSubmit={handleSubmit}>
                <label className="label" htmlFor="borrowerName">Borrower's Name</label>
                <input
                    className="input"
                    type="text"
                    id="borrowerName"
                    name="borrowerName"
                    value={formData.borrowerName}
                    onChange={handleChange}
                    required
                />

                <label className="label" htmlFor="amount">Amount (in BGN)</label>
                <input
                    className="input"
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />

                <label className="label" htmlFor="term">Term (3 to 120 months)</label>
                <select
                    className="select"
                    id="term"
                    name="term"
                    value={formData.term}
                    onChange={handleChange}
                    required
                >
                    {[...Array(118).keys()].map((num) => (
                        <option key={num + 3} value={num + 3}>{num + 3} months</option>
                    ))}
                </select>

                <button className="button" type="submit">Submit Loan</button>
            </form>
        </div>
    );
}
