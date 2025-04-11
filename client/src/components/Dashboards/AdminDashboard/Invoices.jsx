import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingBar from 'react-top-loading-bar'

function Invoices() {
  const genInvoices = async () => {
    setProgress(30)
    try {
      const hostel = JSON.parse(localStorage.getItem("hostel"));
      if (!hostel || !hostel._id) {
        toast.error("Hostel information not found", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        return;
      }

      const res = await fetch("http://localhost:5000/api/invoice/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ hostel: hostel._id })
      });
      setProgress(60)
      const data = await res.json();
      console.log("Invoice generation response:", data);
      
      if (data.success) {
        toast.success(
          `Successfully generated ${data.count} invoices!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        getInvoices();
      } else {
        toast.error(
          data.errors?.[0]?.msg || "Failed to generate invoices", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      }
    } catch (err) {
      console.error("Error generating invoices:", err);
      toast.error(
        err.message || "Failed to generate invoices", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
    setProgress(100)
  };

  const approveInvoice = async (id) => {
    setProgress(30);
    try {
      const response = await fetch("http://localhost:5000/api/invoice/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ student: id, status: "approved" })
      });
      setProgress(60);
      const data = await response.json();
      if (data.success) {
        toast.success("Invoice approved successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
        });
        setPendingInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.student._id !== id));
      } else {
        toast.error(data.errors?.[0]?.msg || "Failed to approve invoice", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error approving invoice:", error);
      toast.error("Failed to approve invoice", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
    }
    setProgress(100);
  };

  const getInvoices = async () => {
    setProgress(30);
    try {
      const hostel = JSON.parse(localStorage.getItem("hostel"));
      if (!hostel || !hostel._id) {
        toast.error("Hostel information not found", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
        });
        return;
      }

      const response = await fetch("http://localhost:5000/api/invoice/getbyid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ hostel: hostel._id })
      });
      setProgress(60);
      const data = await response.json();
      if (data.success) {
        const invoices = Array.isArray(data.invoices) ? data.invoices : [];
        setPendingInvoices(invoices.filter(invoice => invoice.status === "pending"));
      } else {
        toast.error(data.errors?.[0]?.msg || "Failed to fetch invoices", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to fetch invoices", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
    }
    setProgress(100);
  };

  const [Progress, setProgress] = useState(0)
  const [allInvoices, setAllInvoices] = useState([]);
  const [pendingInvoices, setPendingInvoices] = useState([]);

  useEffect(() => {
    getInvoices();
  }, [allInvoices.length, pendingInvoices.length]);

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center justify-center">
      <LoadingBar color='#0000FF' progress={Progress} onLoaderFinished={() => setProgress(0)} />
      <h1 className="text-white font-bold text-5xl">Invoices</h1>
      <button onClick={genInvoices} className="py-3 px-7 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-800 transition-all">
        Generate Invoices
      </button>
      <div className="bg-neutral-950 px-10 py-5 rounded-xl shadow-xl sm:w-[50%] sm:min-w-[500px] w-full mt-5 max-h-96 overflow-auto">
        <span className="text-white font-bold text-xl">All Invoices</span>
        <ul role="list" className="divide-y divide-gray-700 text-white">
          {pendingInvoices.length === 0
            ? "No Students Found"
            : pendingInvoices.map((invoice) => (
                <li
                  className="py-3 px-5 rounded sm:py-4 hover:bg-neutral-700 hover:scale-105 transition-all"
                  key={invoice.id}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-white">
                        {invoice.student.name}
                      </p>
                      <p className="text-sm truncate text-gray-400">
                        Room: {invoice.student.room_no} | Amount: Rs.{" "}
                        {invoice.amount}
                      </p>
                    </div>
                    <button className="group/show relative z-0" onClick={() => approveInvoice(invoice.student._id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 group-hover/show:scale-125 group-hover/show:text-green-600 transition-all"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>

                      <span className="text-sm hidden absolute px-2 -right-10 top-6 bg-black text-center group-hover/show:block rounded">
                        Approve Payment
                      </span>
                    </button>
                  </div>
                </li>
              ))}
        </ul>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
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
