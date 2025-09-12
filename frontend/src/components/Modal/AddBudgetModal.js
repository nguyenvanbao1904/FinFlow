import { useState, useEffect, useCallback } from "react";
import Modal from "./Modal";
import Form from "../Form/Form";
import FormGroup from "../Form/FormGroup";
import FormSelect from "../Form/FormSelect";
import FormOption from "../Form/FormOption";
import Button from "../Button/Button";
import SubmitButton from "../Button/SubmitButton";
import style from "./addTransactionModal.module.css";
import useApi from "../../hooks/useApi";
import { endpoints } from "../../configs/apis";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { formatSimpleCurrency } from "../../utils/formatters";
import { toast } from "react-toastify";
import Spinner from "../Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchBudgets } from "../../redux/features/budget/budgetThunks";
import { selectPeriod } from "../../redux/features/budget/budgetSelections";

const AddBudgetModal = ({ openModal, closeModalHandler, budget = null }) => {
  const [amountLimit, setAmountLimit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("WEEK");
  const [pageCategory, setPageCategory] = useState(1);
  const [categories, setCategories] = useState({
    categoryResponses: [],
    totalPages: 0,
  });
  const { isLoading: isLoadingCategories, callApi: fetchCategoriesApi } =
    useApi();
  const { isLoading: isSubmitting, callApi: submitBudgetApi } = useApi();
  const period = useSelector(selectPeriod);

  const dispatch = useDispatch();

  const isEditMode = Boolean(budget);

  // Định nghĩa các tùy chọn kỳ hạn
  const periodOptions = [
    {
      value: "WEEK",
      label: `Hàng tuần (${dayjs()
        .startOf("week")
        .format("DD/MM/YYYY")} - ${dayjs()
        .endOf("week")
        .format("DD/MM/YYYY")})`,
      icon: "fa-solid fa-calendar-week",
      iconColor: "#3b82f6",
    },
    {
      value: "MONTH",
      label: `Hàng tháng (${dayjs()
        .startOf("month")
        .format("DD/MM/YYYY")} - ${dayjs()
        .endOf("month")
        .format("DD/MM/YYYY")})`,
      icon: "fa-solid fa-calendar",
      iconColor: "#10b981",
    },
    {
      value: "YEAR",
      label: `Hàng năm (${dayjs()
        .startOf("year")
        .format("DD/MM/YYYY")} - ${dayjs()
        .endOf("year")
        .format("DD/MM/YYYY")})`,
      icon: "fa-solid fa-calendar-alt",
      iconColor: "#f59e0b",
    },
  ];

  // Cập nhật ngày bắt đầu và kết thúc khi thay đổi kỳ hạn
  useEffect(() => {
    const currentDate = dayjs();
    let newStartDate, newEndDate;

    switch (selectedPeriod) {
      case "WEEK":
        newStartDate = currentDate.startOf("week").format("YYYY-MM-DD");
        newEndDate = currentDate.endOf("week").format("YYYY-MM-DD");
        break;
      case "MONTH":
        newStartDate = currentDate.startOf("month").format("YYYY-MM-DD");
        newEndDate = currentDate.endOf("month").format("YYYY-MM-DD");
        break;
      case "YEAR":
        newStartDate = currentDate.startOf("year").format("YYYY-MM-DD");
        newEndDate = currentDate.endOf("year").format("YYYY-MM-DD");
        break;
      default:
        newStartDate = currentDate.startOf("week").format("YYYY-MM-DD");
        newEndDate = currentDate.endOf("week").format("YYYY-MM-DD");
        break;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  }, [selectedPeriod]);

  const fetchCategories = useCallback(
    async (pageCategory, isAppend = false) => {
      try {
        const response = await fetchCategoriesApi(
          "GET",
          `${endpoints.categories.get}?page=${pageCategory}&type=EXPENSE`
        );

        if (isAppend) {
          setCategories((prev) => ({
            ...response.data,
            categoryResponses: [
              ...prev.categoryResponses,
              ...response.data.categoryResponses,
            ],
          }));
        } else {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    [fetchCategoriesApi]
  );

  useEffect(() => {
    if (openModal) {
      fetchCategories(1, false);
      setPageCategory(1);
    }
  }, [fetchCategories, openModal]);

  useEffect(() => {
    if (
      openModal &&
      pageCategory > 1 &&
      pageCategory <= categories.totalPages
    ) {
      fetchCategories(pageCategory, true);
    }
  }, [openModal, pageCategory, fetchCategories, categories.totalPages]);

  const determinePeriodFromDates = (startDate, endDate) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    const isWeekly = end.diff(start, "days") === 6 && start.day() === 0;
    const isMonthly =
      start.date() === 1 && end.isSame(start.endOf("month"), "day");
    const isYearly =
      start.month() === 0 &&
      start.date() === 1 &&
      end.month() === 11 &&
      end.date() === 31;

    if (isWeekly) return "WEEK";
    if (isMonthly) return "MONTH";
    if (isYearly) return "YEAR";

    return "WEEK";
  };

  useEffect(() => {
    if (budget && openModal) {
      setAmountLimit(budget.amountLimit?.toString() || "");
      setSelectedCategory(budget.category?.id || "");
      setIsRecurring(budget.isRecurring || false);

      if (budget.startDate && budget.endDate) {
        setStartDate(budget.startDate);
        setEndDate(budget.endDate);

        const detectedPeriod = determinePeriodFromDates(
          budget.startDate,
          budget.endDate
        );
        setSelectedPeriod(detectedPeriod);
      } else {
        setSelectedPeriod("WEEK");
      }
    } else if (!budget && openModal) {
      // Reset form khi thêm mới
      setAmountLimit("");
      setStartDate(dayjs().startOf("week").format("YYYY-MM-DD"));
      setEndDate(dayjs().endOf("week").format("YYYY-MM-DD"));
      setSelectedCategory("");
      setIsRecurring(false);
      setSelectedPeriod("WEEK"); // Set default cho thêm mới
    }
  }, [budget, openModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recurringTypeMap = {
      WEEK: "WEEKLY",
      MONTH: "MONTHLY",
      YEAR: "YEARLY",
    };

    const formData = {
      amountLimit: parseFloat(amountLimit),
      startDate: dayjs(startDate).format("DD/MM/YYYY"),
      endDate: dayjs(endDate).format("DD/MM/YYYY"),
      category: selectedCategory,
      isRecurring,
      isUpdate: isEditMode,
      recurringType: recurringTypeMap[selectedPeriod],
    };

    if (isEditMode) {
      formData.id = budget.id;
    }

    try {
      await submitBudgetApi("POST", endpoints.budgets.create, formData);

      const successMessage = isEditMode
        ? "Cập nhật ngân sách thành công!"
        : "Thêm ngân sách thành công!";

      toast.success(successMessage, {
        autoClose: 1000,
        onClose: () => {
          dispatch(fetchBudgets({ period, page: 1 }));
          closeModalHandler();
        },
      });
    } catch (error) {
      toast.error(error.message, { autoClose: 2000 });
    }
  };

  const handleAmountChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setAmountLimit(numericValue);
  };

  if (!openModal) return null;

  return isSubmitting ? (
    <Spinner text={isEditMode ? "Đang cập nhật..." : "Đang tạo ngân sách..."} />
  ) : (
    <Modal
      modalTitle={isEditMode ? "Chỉnh sửa ngân sách" : "Tạo ngân sách mới"}
      closeModalHandler={closeModalHandler}
    >
      <Form onSubmit={handleSubmit}>
        <FormGroup
          icon="fa-solid fa-money-bill"
          label="Số tiền"
          placeholder="Nhập số tiền"
          type="text"
          key="amountLimit"
          value={
            amountLimit
              ? formatSimpleCurrency(amountLimit).replace(/\s₫/g, "")
              : ""
          }
          setValue={handleAmountChange}
        />

        <FormSelect
          icon="fa-solid fa-tags"
          label="Chọn danh mục"
          options={categories.categoryResponses.map((category) => ({
            value: category.id,
            label: category.name,
            icon: category.icon.iconClass,
            iconColor: category.colorCode,
          }))}
          selectedValue={selectedCategory}
          setSelectedValue={setSelectedCategory}
          placeholder="Chọn danh mục"
          onScrollEnd={() => setPageCategory((prev) => prev + 1)}
          isLoading={isLoadingCategories}
        />

        <FormSelect
          icon="fa-solid fa-clock"
          label="Chọn kỳ hạn"
          options={periodOptions}
          selectedValue={selectedPeriod}
          setSelectedValue={setSelectedPeriod}
          placeholder="Chọn kỳ hạn"
        />

        <div
          style={{
            padding: "1rem",
            backgroundColor: "var(--bg-tertiary)",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
            }}
          >
            <i
              className="fa-solid fa-info-circle"
              style={{ marginRight: "0.5rem" }}
            ></i>
            Kỳ hạn: {dayjs(startDate).format("DD/MM/YYYY")} -{" "}
            {dayjs(endDate).format("DD/MM/YYYY")}
          </p>
        </div>

        {/* Cập nhật điều kiện hiển thị */}
        {true && (
          <FormOption
            text="Lặp lại ngân sách này"
            checked={isRecurring}
            onChange={(value) => setIsRecurring(value)}
          />
        )}

        <div className={style.modalActions}>
          <Button
            isLarge={false}
            onClick={closeModalHandler}
            text="Hủy"
            isPrimary={false}
          />
          <SubmitButton
            isLarge={false}
            text={isEditMode ? "Cập nhật" : "Tạo ngân sách"}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default AddBudgetModal;
