import React, {useEffect, useState} from 'react';
import Header from '../Components/Header';

export default function CreditTable() {
    const [credits, setCredits] = useState([]); // State to hold credits data
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to track errors

    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const response = await fetch('/api/getCredits'); // Adjust the API endpoint as needed
                if (!response.ok) {
                    throw new Error('Failed to fetch credits');
                }
                const data = await response.json();
                setCredits(data); // Set the fetched data to state
            } catch (err) {
                setError(err.message); // Handle errors
            } finally {
                setLoading(false); // Set loading to false after fetch
            }
        };

        fetchCredits(); // Call the function to fetch credits
    }, []); // Empty dependency array means this runs once when the component mounts

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Error state
    }

    return (
        <div>
            <Header />
            <table className="table">
                <thead>
                <tr>
                    <th className="th">Borrower's Name</th>
                    <th className="th">Amount</th>
                    <th className="th">Term</th>
                    <th className="th">Monthly Payment</th>
                </tr>
                </thead>
                <tbody>
                {credits.map((credit, index) => (
                    <tr key={index}>
                        <td className="td">{credit.borrowerName}</td>
                        <td className="td">{credit.amount} лв</td>
                        <td className="td">{credit.term} months</td>
                        <td className="td">{credit.monthlyPayment} лв</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

