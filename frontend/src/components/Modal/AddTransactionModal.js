import { useCallback, useEffect, useState } from "react";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import Form from "../Form/Form";
import FormGroup from "../Form/FormGroup";
import FormSelect from "../Form/FormSelect";
import { endpoints } from "../../configs/apis";
import Spinner from "../Spinner/Spinner";
import style from "./addTransactionModal.module.css";
import formatCurrency from "../../utils/formatCurrency";
import SubmitButton from "../Button/SubmitButton";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import useApi from "../../hooks/useApi";
import AddCategoryModal from "./AddCategoryModal";
import { selectPeriod } from "../../redux/features/transaction/transactionSelectors";
import {
  fetchCategoryDistribution,
  fetchSummary,
  fetchTransactions,
} from "../../redux/features/transaction/transactionThunks";

const transactionTypes = [
  {
    id: "EXPENSE",
    name: "Chi tiêu",
    icon: "fa-solid fa-arrow-down",
    iconColor: "#e74c3c",
  },
  {
    id: "INCOME",
    name: "Thu nhập",
    icon: "fa-solid fa-arrow-up",
    iconColor: "#2ecc71",
  },
  {
    id: "SAVING",
    name: "Tiết kiệm",
    icon: "fa-solid fa-piggy-bank",
    iconColor: "#a704a7ff",
  },
];

const AddTransactionModal = ({
  openModal,
  closeModalHandler,
  transaction = null,
}) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState({
    categoryResponses: [],
    totalPages: 0,
  });
  const period = useSelector(selectPeriod);
  const dispatch = useDispatch();
  const [openModalAddCategory, setOpenModalAddCategory] = useState(false);
  const { isLoading: isSubmitting, callApi: submitApi } = useApi();

  const { isLoading: isLoadingCategories, callApi: fetchCategoriesApi } =
    useApi();
  const [pageCategory, setPageCategory] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedTransactionType, setSelectedTransactionType] = useState(
    transactionTypes[0].id
  );

  const isEditMode = Boolean(transaction);

  // Khởi tạo dữ liệu khi có transaction để edit
  useEffect(() => {
    if (transaction && openModal) {
      setAmount(transaction.amount?.toString() || "");
      setDate(
        transaction.date
          ? dayjs(transaction.date, "DD/MM/YYYY").format("YYYY-MM-DD")
          : ""
      );
      setDescription(transaction.description || "");
      setSelectedCategory(transaction.category?.id);
      setSelectedTransactionType(
        transaction.category?.type || transactionTypes[0].id
      );
    } else if (!transaction && openModal) {
      // Reset form khi mở modal để thêm mới
      setAmount("");
      setDate("");
      setDescription("");
      setSelectedCategory();
      setSelectedTransactionType(transactionTypes[0].id);
    }
  }, [transaction, openModal]);

  const handleAmountChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setAmount(numericValue);
  };

  const fetchCategories = useCallback(
    async (pageCategory, isAppend = false, type) => {
      try {
        const response = await fetchCategoriesApi(
          "GET",
          `${endpoints.categories.get}?page=${pageCategory}&type=${type}`
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
      fetchCategories(1, false, selectedTransactionType);
      setPageCategory(1);
    }
  }, [fetchCategories, selectedTransactionType, openModal]);

  useEffect(() => {
    if (
      openModal &&
      pageCategory > 1 &&
      pageCategory <= categories.totalPages
    ) {
      fetchCategories(pageCategory, true, selectedTransactionType);
    }
  }, [
    openModal,
    pageCategory,
    fetchCategories,
    categories.totalPages,
    selectedTransactionType,
  ]);

  const submitModalHandler = async (e) => {
    e.preventDefault();
    const formData = {
      amount,
      date: dayjs(date).format("DD/MM/YYYY"),
      description,
      categoryId: selectedCategory,
    };

    // Thêm id nếu là edit mode
    if (isEditMode) {
      formData.id = transaction.id;
    }

    if (amount && date && description && selectedCategory) {
      try {
        // Chỉ cần dùng POST endpoint duy nhất
        const data = await submitApi(
          "POST",
          endpoints.transactions.create,
          formData
        );

        alert(data.message);

        if (data.code === 200 || data.code === 201) {
          dispatch(fetchSummary({ period }));
          dispatch(fetchTransactions({ period, page: 1 }));
          dispatch(fetchCategoryDistribution({ period, type: "EXPENSE" }));
          dispatch(fetchCategoryDistribution({ period, type: "INCOME" }));
          closeModalHandler();
        }
      } catch (error) {
        alert(error.message || "Lỗi không xác định");
      }
    }
  };

  if (!openModal) return null;

  return isSubmitting ? (
    <Spinner text={isEditMode ? "Đang cập nhật..." : "Đang tạo giao dịch..."} />
  ) : (
    <>
      <Modal
        modalTitle={isEditMode ? "Chỉnh sửa giao dịch" : "Thêm giao dịch"}
        closeModalHandler={closeModalHandler}
      >
        <Form onSubmit={submitModalHandler}>
          <FormGroup
            icon="fa-solid fa-money-bill"
            label="Số tiền"
            placeholder="Nhập số tiền"
            type="text"
            key="amount"
            value={amount ? formatCurrency(amount).replace(/\s₫/g, "") : ""}
            setValue={handleAmountChange}
          />
          <FormSelect
            icon="fa-solid fa-table-cells"
            label="Chọn loại giao dịch"
            options={transactionTypes.map((transactionType) => ({
              value: transactionType.id,
              label: transactionType.name,
              icon: transactionType.icon,
              iconColor: transactionType.iconColor,
            }))}
            selectedValue={selectedTransactionType}
            setSelectedValue={setSelectedTransactionType}
            key="type"
            placeholder="Chọn loại giao dịch"
          />
          <div className={style.categorySelect}>
            <FormSelect
              icon="fa-solid fa-table-cells"
              label="Chọn danh mục"
              options={categories.categoryResponses.map((category) => ({
                value: category.id,
                label: category.name,
                icon: category.icon.iconClass,
                iconColor: category.colorCode,
              }))}
              selectedValue={selectedCategory}
              setSelectedValue={setSelectedCategory}
              key="category"
              placeholder="Chọn danh mục"
              onScrollEnd={() => setPageCategory((prev) => prev + 1)}
              isLoading={isLoadingCategories}
            />
            <p onClick={() => setOpenModalAddCategory(true)}>Thêm danh mục</p>
          </div>

          <FormGroup
            icon="fa-solid fa-calendar-days"
            label="Ngày giao dịch"
            placeholder="Nhập ngày giao dịch"
            type="date"
            key="date"
            value={date}
            setValue={setDate}
          />
          <FormGroup
            icon="fa-solid fa-file-alt"
            label="Mô tả"
            placeholder="Nhập mô tả"
            type="text"
            key="description"
            value={description}
            setValue={setDescription}
          />
          <div className={style.modalActions}>
            <Button
              isLarge={false}
              onClick={closeModalHandler}
              text="Hủy"
              isPrimary={false}
            />
            <SubmitButton
              isLarge={false}
              text={isEditMode ? "Cập nhật" : "Lưu"}
            />
          </div>
        </Form>
      </Modal>
      <AddCategoryModal
        openModal={openModalAddCategory}
        closeModalHandler={() => setOpenModalAddCategory(false)}
      />
    </>
  );
};

export default AddTransactionModal;
