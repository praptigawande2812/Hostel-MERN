import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Invoices() {
  const [invoiceList, setInvoiceList] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [paidInvoices, setPaidInvoices] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const student = JSON.parse(localStorage.getItem("student"));
        if (!student) {
          throw new Error("Student information not found");
        }

        const response = await fetch("http://localhost:5000/api/invoice/student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ student: student._id }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.errors?.[0]?.msg || "Failed to fetch invoices");
        }

        if (data.success) {
          let invoices = data.invoices;
          let List = [];
          let paidInvoices = 0;
          let pendingInvoices = 0;
    
          invoices.forEach((invoice) => {
            if (invoice.status.toLowerCase() === "paid") {
              paidInvoices += 1;
            } else {
              pendingInvoices += 1;
            }
            let date = new Date(invoice.date);
            invoice.date = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
            List.push({
              title: invoice.title,
              amount: "Rs. " + invoice.amount,
              status: invoice.status,
              date: invoice.date,
            });
          });
          setInvoiceList(List);
          setTotalInvoices(invoices.length);
          setPaidInvoices(paidInvoices);
          setPendingInvoices(pendingInvoices);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error(error.message || "Failed to fetch invoices", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const loader = (
    <svg
      aria-hidden="true"
      className="inline w-4 h-4 mr-2 animate-spin text-white fill-blue-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  );

  return (
    <div className="w-full h-screen flex flex-col gap-5 items-center justify-center max-h-screen overflow-y-auto">
      <h1 className="text-white font-bold text-5xl">Invoices</h1>
      <p className="text-white text-xl text-center px-5 sm:p-0">
        All the invoices like Mess bills, Hostel fee will be shown here
      </p>
      <div className="flex gap-10 items-center my-5">
        <div className="flex flex-col items-center justify-center">
          <dt className="mb-2 ml-2 text-5xl font-extrabold text-blue-700">
            {loading ? loader : totalInvoices}
          </dt>
          <dd className="text-gray-400 text-center">Total Invoices</dd>
        </div>
        <div className="flex flex-col items-center justify-center">
          <dt className="mb-2 text-5xl font-extrabold text-blue-700">
            {loading ? loader : paidInvoices}
          </dt>
          <dd className="text-gray-400">Paid Invoices</dd>
        </div>
        <div className="flex flex-col items-center justify-center">
          <dt className="mb-2 text-5xl font-extrabold text-blue-700">
            {loading ? loader : pendingInvoices}
          </dt>
          <dd className="text-gray-400">Pending Invoices</dd>
        </div>
      </div>

      <div className="w-full max-w-md p-4 border rounded-lg shadow sm:p-8 bg-neutral-950 border-neutral-900 drop-shadow-xl overflow-y-auto max-h-70">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-white">
            Latest Invoices
          </h5>
        </div>
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-700">
            {loading ? (
              <div className="flex justify-center items-center h-20">
                {loader} Loading invoices...
              </div>
            ) : invoiceList.length === 0 ? (
              <div className="text-white text-center py-4">No invoices found</div>
            ) : (
              invoiceList.map((invoice, index) => (
                <li className="py-3 sm:py-4" key={index}>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-white">
                        {invoice.title}
                      </p>
                      <p className="text-sm truncate text-gray-400">
                        {invoice.date}
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-base font-semibold text-white">
                      {invoice.amount}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default Invoices;
