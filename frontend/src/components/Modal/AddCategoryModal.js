import { useCallback, useEffect, useState } from "react";
import Spinner from "../Spinner/Spinner";
import Modal from "./Modal";
import Form from "../Form/Form";
import FormGroup from "../Form/FormGroup";
import FormSelect from "../Form/FormSelect";
import { endpoints } from "../../configs/apis";
import useApi from "../../hooks/useApi";
import Button from "../Button/Button";
import SubmitButton from "../Button/SubmitButton";
import style from "./addTransactionModal.module.css";

const AddCategoryModal = ({ openModal, closeModalHandler }) => {
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
  const [selectedTransactionType, setSelectedTransactionType] = useState(
    transactionTypes[0].id
  );
  const [name, setName] = useState("");
  const [colorPickerValue, setColorPickerValue] = useState("#ffffff");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [icons, setIcons] = useState({
    totalPages: 1,
    iconResponses: [],
  });
  const { isLoading: isSubmitting, callApi: submitApi } = useApi();

  const { isLoading: isLoadingIcons, callApi: fetchIconsApi } = useApi();
  const [pageIcon, setPageIcon] = useState(1);

  const fetchIcons = useCallback(
    async (pageIcon, isAppend = false) => {
      try {
        const response = await fetchIconsApi(
          "GET",
          `${endpoints.icons.get}?page=${pageIcon}`
        );

        if (isAppend) {
          setIcons((prev) => ({
            ...response.data,
            iconResponses: [
              ...prev.iconResponses,
              ...response.data.iconResponses,
            ],
          }));
        } else {
          setIcons(response.data);
        }
      } catch (error) {
        console.error("Error fetching icons:", error);
      }
    },
    [fetchIconsApi]
  );

  useEffect(() => {
    fetchIcons(1);
  }, [fetchIcons]);

  useEffect(() => {
    if (openModal && pageIcon > 1 && pageIcon <= icons.totalPages) {
      fetchIcons(pageIcon, true); // true để append data
    }
  }, [openModal, pageIcon, fetchIcons, icons.totalPages]);

  const handelSubmitForm = async (e) => {
    e.preventDefault();
    if (name && selectedTransactionType && selectedIcon) {
      let formData = {
        name,
        type: selectedTransactionType,
        colorCode: colorPickerValue,
        icon: selectedIcon,
      };
      let response = await submitApi(
        "POST",
        endpoints.categories.create,
        formData
      );
      if (response.code === 201) {
        alert(response.message);
        closeModalHandler();
      } else {
        console.error("Failed to create category:", response.data);
      }
    }
  };
  if (!openModal) return null;
  return isSubmitting ? (
    <Spinner text="Loading form..." />
  ) : (
    <>
      <Modal modalTitle="Thêm hạng mục" closeModalHandler={closeModalHandler}>
        <Form onSubmit={handelSubmitForm}>
          <FormGroup
            label="Tên hạng mục"
            placeholder="Nhập tên hạng mục"
            icon="fa-solid fa-tag"
            type="text"
            key="name"
            value={name}
            setValue={setName}
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
          <FormGroup
            label="Màu nền"
            placeholder="Chọn màu nền"
            icon="fa-solid fa-palette"
            type="color"
            key="color"
            value={colorPickerValue}
            setValue={setColorPickerValue}
          />
          <FormSelect
            icon="fa-solid fa-table-cells"
            label="Chọn icon"
            options={icons.iconResponses.map((icon) => ({
              value: icon.id,
              label: icon.name,
              icon: icon.iconClass,
              iconColor: colorPickerValue,
            }))}
            selectedValue={selectedIcon}
            setSelectedValue={setSelectedIcon}
            key="icon"
            placeholder="Chọn icon"
            onScrollEnd={() => setPageIcon((prev) => prev + 1)}
            isLoading={isLoadingIcons}
          />
          <div className={style.modalActions}>
            <Button
              isLarge={false}
              onClick={closeModalHandler}
              text="Hủy"
              isPrimary={false}
            />
            <SubmitButton isLarge={false} text="Lưu" />
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default AddCategoryModal;
