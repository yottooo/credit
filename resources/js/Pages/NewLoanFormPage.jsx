import React, { useState } from 'react';
import Header from "@/Components/Header.jsx";
// TODO validation
export default function NewLoanFormPage() {
    const [formData, setFormData] = useState({
        borrowerName: '',
        amount: '',
        term: '3',
    });
    const [notification, setNotification] = useState(null); // State for notification

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/saveCredit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            const result = await response.json();
            console.log('Form submitted successfully:', result);

            setNotification('Loan Created Successfully');

            setFormData({
                borrowerName: '',
                amount: '',
                term: '3',
            });

            setTimeout(() => {
                window.location.reload();
            }, 2000); // 2 seconds delay for the notification to be visible

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div>
            <Header />
            {notification && (
                <div className="notification" style={{ color: 'green', marginBottom: '10px' }}>
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
