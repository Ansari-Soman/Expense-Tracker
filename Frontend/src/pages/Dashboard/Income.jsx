import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import Drawer from "../../components/Drawer";
import Modal from "../../components/Modal";
import AddTransactionDrawerContent from "../../components/AddTransactionDrawerContent";
import toast from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";
import { useUserAuth } from "../../hooks/userAuth";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { MOCK_INCOMES } from "../../utils/mockData";
import ConsoleLoader from "../../components/ConsoleLoader";

const Income = () => {
  useUserAuth();
  const location = useLocation();
  const { demoDataEnabled } = useContext(UserContext);

  const [openAddIncomeDrawer, setOpenAddIncomeDrawer] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  useEffect(() => {
    if (location.state?.openModal) {
      setOpenAddIncomeDrawer(true);
      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Get All Income Details
  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (err) {
      console.log("Something went wrong. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Income (supports both single object and bulk array)
  const handleAddIncome = async (income) => {
    // 1. Bulk Insert
    if (Array.isArray(income)) {
      try {
        setLoading(true);
        await Promise.all(
          income.map((item) =>
            axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
              amount: item.amount,
              icon: item.icon,
              source: item.source,
              date: item.date,
              description: item.description,
              paymentMethod: item.paymentMethod,
            })
          )
        );
        setOpenAddIncomeDrawer(false);
        toast.success("Bulk income logs added successfully");
        fetchIncomeDetails();
      } catch (err) {
        console.error("Bulk add income error:", err);
        toast.error("Failed to add bulk income. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. Single Insert
    const { source, amount, icon, date, description, paymentMethod } = income;
    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        amount,
        icon,
        source,
        date,
        description,
        paymentMethod,
      });
      setOpenAddIncomeDrawer(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    } catch (err) {
      console.error(
        "Error adding income: ",
        err.response?.data?.message || err.message
      );
      toast.error(err.response?.data?.message || "Failed to add income");
    }
  };

  // Delete Income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income details deleted successfully");
      fetchIncomeDetails();
    } catch (err) {
      console.error(
        "Error deleting income: ",
        err.response?.data?.message || err.message
      );
    }
  };

  // Handle download income details
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        { responseType: "blob" }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading income details", err);
      toast.error("Failed to download income details. Please try again");
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  // Use mock data if sandbox mode is active or database is empty
  const activeIncomeData = (demoDataEnabled || (!loading && incomeData.length === 0)) ? MOCK_INCOMES : incomeData;

  return (
    <DashboardLayout activeMenu="Income">
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
              <div>
                <IncomeOverview
                  transactions={activeIncomeData}
                  onAddIncome={() => setOpenAddIncomeDrawer(true)}
                />
              </div>

              <IncomeList
                transactions={activeIncomeData}
                onDelete={(id) => {
                  setOpenDeleteAlert({ show: true, data: id });
                }}
                onDownload={handleDownloadIncomeDetails}
              />
            </div>
          </>
        )}

        {/* Sliding side drawer for additions */}
        <Drawer
          isOpen={openAddIncomeDrawer}
          onClose={() => setOpenAddIncomeDrawer(false)}
          title="Add Income Records"
        >
          <AddTransactionDrawerContent
            type="income"
            onSave={handleAddIncome}
            onClose={() => setOpenAddIncomeDrawer(false)}
          />
        </Drawer>

        {/* Center alert popup is kept for destructive deletes */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income details?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
