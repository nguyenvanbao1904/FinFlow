import { useState } from "react";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import Form from "../Form/Form";
import FormGroup from "../Form/FormGroup";
import SubmitButton from "../Button/SubmitButton";
import useApi from "../../hooks/useApi";
import { endpoints } from "../../configs/apis";
import Spinner from "../Spinner/Spinner";
import style from "./addTransactionModal.module.css";
import { toast } from "react-toastify";

const CreatePasswordModal = ({ openModal, closeModalHandler }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isLoading: isSubmitting, callApi: submitApi } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.");
      return;
    }

    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    try {
      const formData = {
        password: password,
      };

      const response = await submitApi(
        "POST",
        endpoints.users.create_password,
        formData
      );

      if (response.code === 201) {
        toast.success(response.message, {
          position: "top-right",
          autoClose: 3000,
          toastId: "auth-success",
          onClose: () => {
            closeModalHandler();
          },
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
        toastId: "auth-error",
      });
    }
  };

  const handleClose = () => {
    setPassword("");
    setConfirmPassword("");
    closeModalHandler();
  };

  if (!openModal) return null;

  return isSubmitting ? (
    <Spinner text="Đang tạo mật khẩu..." />
  ) : (
    <Modal
      modalTitle="Tạo mật khẩu cho tài khoản"
      closeModalHandler={handleClose}
    >
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Để bảo mật tài khoản, vui lòng tạo mật khẩu để đăng nhập lần sau
        </p>
      </div>

      <Form onSubmit={handleSubmit}>
        <FormGroup
          icon="fa-solid fa-lock"
          label="Mật khẩu mới"
          placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
          type="password"
          value={password}
          setValue={setPassword}
          required
        />

        <FormGroup
          icon="fa-solid fa-lock"
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
          type="password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          required
        />

        <div className={style.modalActions}>
          <Button
            isLarge={false}
            onClick={handleClose}
            text="Bỏ qua"
            isPrimary={false}
          />
          <SubmitButton isLarge={false} text="Tạo mật khẩu" type="submit" />
        </div>
      </Form>
    </Modal>
  );
};

export default CreatePasswordModal;
