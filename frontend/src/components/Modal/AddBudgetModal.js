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
    {
      value: "CUSTOM",
      label: "Tùy chỉnh",
      icon: "fa-solid fa-calendar-plus",
      iconColor: "#8b5cf6",
    },
  ];

  // Cập nhật ngày bắt đầu và kết thúc khi thay đổi kỳ hạn
  useEffect(() => {
    if (selectedPeriod !== "CUSTOM" && selectedPeriod) {
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
          return;
      }

      setStartDate(newStartDate);
      setEndDate(newEndDate);
    }
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

  //function để xác định period type từ startDate và endDate
  const determinePeriodFromDates = (startDate, endDate) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // Kiểm tra xem có phải tuần hiện tại không
    const currentWeekStart = dayjs().startOf("week");
    const currentWeekEnd = dayjs().endOf("week");
    if (
      start.isSame(currentWeekStart, "day") &&
      end.isSame(currentWeekEnd, "day")
    ) {
      return "WEEK";
    }

    // Kiểm tra xem có phải tháng hiện tại không
    const currentMonthStart = dayjs().startOf("month");
    const currentMonthEnd = dayjs().endOf("month");
    if (
      start.isSame(currentMonthStart, "day") &&
      end.isSame(currentMonthEnd, "day")
    ) {
      return "MONTH";
    }

    // Kiểm tra xem có phải năm hiện tại không
    const currentYearStart = dayjs().startOf("year");
    const currentYearEnd = dayjs().endOf("year");
    if (
      start.isSame(currentYearStart, "day") &&
      end.isSame(currentYearEnd, "day")
    ) {
      return "YEAR";
    }

    // Kiểm tra pattern tuần bất kỳ (7 ngày, bắt đầu từ Chủ nhật)
    const daysDiff = end.diff(start, "days");
    if (daysDiff === 6 && start.day() === 0) {
      return "WEEK";
    }

    // Kiểm tra pattern tháng bất kỳ (từ ngày 1 đến cuối tháng)
    if (start.date() === 1 && end.isSame(start.endOf("month"), "day")) {
      return "MONTH";
    }

    // Kiểm tra pattern năm bất kỳ (từ 1/1 đến 31/12)
    if (
      start.month() === 0 &&
      start.date() === 1 &&
      end.month() === 11 &&
      end.date() === 31
    ) {
      return "YEAR";
    }

    // Nếu không khớp pattern nào thì là CUSTOM
    return "CUSTOM";
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
        setSelectedPeriod("CUSTOM");
      }
    } else if (!budget && openModal) {
      // Reset form khi thêm mới
      setAmountLimit("");
      setStartDate("");
      setEndDate("");
      setSelectedCategory("");
      setIsRecurring(false);
      setSelectedPeriod("WEEK"); // Set default cho thêm mới
    }
  }, [budget, openModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      amountLimit: parseFloat(amountLimit),
      startDate: dayjs(startDate).format("DD/MM/YYYY"),
      endDate: dayjs(endDate).format("DD/MM/YYYY"),
      category: selectedCategory,
      isRecurring,
    };

    // Thêm id nếu đang ở chế độ edit
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
      console.error("Error submitting budget:", error);
      const errorMessage = isEditMode
        ? "Đã có lỗi xảy ra khi cập nhật ngân sách."
        : "Đã có lỗi xảy ra khi thêm ngân sách.";
      toast.error(errorMessage, { autoClose: 2000 });
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

        {selectedPeriod === "CUSTOM" && (
          <>
            <FormGroup
              icon="fa-solid fa-calendar-days"
              label="Ngày bắt đầu"
              placeholder="Chọn ngày bắt đầu"
              type="date"
              value={startDate}
              setValue={setStartDate}
            />

            <FormGroup
              icon="fa-solid fa-calendar-days"
              label="Ngày kết thúc"
              placeholder="Chọn ngày kết thúc"
              type="date"
              value={endDate}
              setValue={setEndDate}
            />
          </>
        )}

        {selectedPeriod !== "CUSTOM" && selectedPeriod && (
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
        )}

        {/* Hiển thị option lặp lại cho tất cả trường hợp có startDate và endDate */}
        {startDate && endDate && (
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
