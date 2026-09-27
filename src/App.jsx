import { useState, useEffect } from 'react';
import DemoSender from './components/DemoSender.jsx'
import './index.css';

const API_BASE = import.meta.env.VITE_API_BASE;

function App() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch(`${API_BASE}/api/invoices`);
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, []);

  if (loading) return <div className="container"><p>Loading invoices...</p></div>;
  if (error) return <div className="container"><p>Error: {error}</p></div>;

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalPrice, 0);
  const sentCount = invoices.filter((inv) => inv.emailStatus === 'sent').length;
  const failedCount = invoices.filter((inv) => inv.emailStatus === 'failed').length;

  return (
    <div className="container">
      <h1>Invoices</h1>
      {/* <DemoSender/> */}
      <div className="summary">
        <div className="summary-item">
          <div className="value">{invoices.length}</div>
          <div className="label">Total invoices</div>
        </div>
        <div className="summary-item revenue">
          <div className="value">${totalRevenue.toFixed(2)}</div>
          <div className="label">Total invoiced</div>
        </div>
        <div className="summary-item">
          <div className="value">{sentCount}</div>
          <div className="label">Sent</div>
        </div>
        <div className="summary-item failed">
          <div className="value">{failedCount}</div>
          <div className="label">Failed</div>
        </div>
      </div>
      
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv._id}>
              <td className="order-number" data-label="Order">#{inv.orderNumber}</td>
              <td data-label="Customer">{inv.customerName || "Guest"}</td>
              <td className="total" data-label="Total">${inv.totalPrice.toFixed(2)}</td>
              <td data-label="Status"><span className={`status status-${inv.emailStatus}`}>{inv.emailStatus}</span></td>
              <td data-label="Date">{new Date(inv.createdAt).toLocaleDateString()}</td>
              <td data-label="">
                <a href={`${API_BASE}/api/invoices/${inv._id}/pdf`} target="_blank" rel="noopener noreferrer">
                  <button className="download-btn">Download</button>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <DemoSender/> 
    </div>
  );
}

export default App;