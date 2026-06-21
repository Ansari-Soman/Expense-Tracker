import React, { useEffect, useState, useContext } from "react";
import { useUserAuth } from "../../hooks/userAuth";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import ExpenseOverview from "../../components/Expense/onExpenseIncome";
import Drawer from "../../components/Drawer";
import Modal from "../../components/Modal";
import AddTransactionDrawerContent from "../../components/AddTransactionDrawerContent";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { MOCK_EXPENSES } from "../../utils/mockData";
import ConsoleLoader from "../../components/ConsoleLoader";

const Expense = () => {
  useUserAuth();
  const location = useLocation();
  const { demoDataEnabled } = useContext(UserContext);

  const [openAddExpenseDrawer, setOpenAddExpenseDrawer] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  useEffect(() => {
    if (location.state?.openModal) {
      setOpenAddExpenseDrawer(true);
      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Get All Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.GET_ALL_EXPENSE
      );
      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (err) {
      console.log("Something went wrong. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Expense (supports both single object and bulk array)
  const handleAddExpense = async (expense) => {
    // 1. Bulk Insert
    if (Array.isArray(expense)) {
      try {
        setLoading(true);
        await Promise.all(
          expense.map((item) =>
            axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
              amount: item.amount,
              icon: item.icon,
              category: item.category,
              date: item.date,
              description: item.description,
              paymentMethod: item.paymentMethod,
            })
          )
        );
        setOpenAddExpenseDrawer(false);
        toast.success("Bulk expense logs added successfully");
        fetchExpenseDetails();
      } catch (err) {
        console.error("Bulk add expense error:", err);
        toast.error("Failed to add bulk expenses. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. Single Insert
    const { category, amount, icon, date, description, paymentMethod } = expense;
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        amount,
        icon,
        category,
        date,
        description,
        paymentMethod,
      });
      setOpenAddExpenseDrawer(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (err) {
      console.error(
        "Error adding expense: ",
        err.response?.data?.message || err.message
      );
      toast.error(err.response?.data?.message || "Failed to add expense");
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
    } catch (err) {
      console.error(
        "Error deleting expense: ",
        err.response?.data?.message || err.message
      );
    }
  };

  // Handle download expense details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        { responseType: "blob" }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading expenses details", err);
      toast.error("Failed to download expense details. Please try again");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
  }, []);

  // Use mock data if sandbox mode is active or database is empty
  const activeExpenseData = (demoDataEnabled || (!loading && expenseData.length === 0)) ? MOCK_EXPENSES : expenseData;

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        {loading ? (
          <ConsoleLoader message="RETRIEVING_DATA_STREAM" />
        ) : (
          <>
            {demoDataEnabled && (
              <div className="mb-4 p-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] font-mono text-[10px] rounded border border-[var(--color-primary)]/20 flex items-center justify-between">
                <span>$ sandbox_status --mode sandbox_simulation_active</span>
                <span>[SIMULATING DATA]</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              <div className="">
                <ExpenseOverview
                  transactions={activeExpenseData}
                  onExpenseIncome={() => setOpenAddExpenseDrawer(true)}
                />
              </div>

              <ExpenseList
                transactions={activeExpenseData}
                onDelete={(id) => {
                  setOpenDeleteAlert({ show: true, data: id });
                }}
                onDownload={handleDownloadExpenseDetails}
              />
            </div>
          </>
        )}

        {/* Sliding side drawer for additions */}
        <Drawer
          isOpen={openAddExpenseDrawer}
          onClose={() => setOpenAddExpenseDrawer(false)}
          title="Add Expense Records"
        >
          <AddTransactionDrawerContent
            type="expense"
            onSave={handleAddExpense}
            onClose={() => setOpenAddExpenseDrawer(false)}
          />
        </Drawer>

        {/* Center alert popup is kept for destructive deletes */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense details?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
