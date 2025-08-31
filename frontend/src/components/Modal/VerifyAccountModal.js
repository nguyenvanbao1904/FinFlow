import { useState } from "react";
import Modal from "./Modal";
import Form from "../Form/Form";
import FormGroup from "../Form/FormGroup";
import SubmitButton from "../Button/SubmitButton";
import Button from "../Button/Button";
import Spinner from "../Spinner/Spinner";
import { toast } from "react-toastify";

const VerifyAccountModal = ({
  openModal,
  closeModalHandler,
  onSendOtp,
  onVerifyOtp,
}) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSendOtp(email);
      toast.success("Đã gửi mã OTP tới email!", { position: "top-right" });
      setStep(2);
    } catch (error) {
      toast.error(error.message || "Gửi OTP thất bại!", {
        position: "top-right",
      });
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onVerifyOtp(email, otp);
      toast.success("Xác thực thành công!", { position: "top-right" });
      closeModalHandler();
    } catch (error) {
      toast.error(error.message || "Xác thực thất bại!", {
        position: "top-right",
      });
    }
    setLoading(false);
  };

  const handleClose = () => {
    setEmail("");
    setOtp("");
    setStep(1);
    closeModalHandler();
  };

  if (!openModal) return null;

  return (
    <Modal modalTitle="Xác thực tài khoản" closeModalHandler={handleClose}>
      {loading ? (
        <Spinner
          text={step === 1 ? "Đang gửi mã OTP..." : "Đang xác thực..."}
        />
      ) : step === 1 ? (
        <Form onSubmit={handleSendOtp}>
          <FormGroup
            icon="fa-solid fa-envelope"
            label="Email xác thực"
            placeholder="Nhập email của bạn"
            type="email"
            value={email}
            setValue={setEmail}
            required
          />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Button text="Bỏ qua" onClick={handleClose} />
            <SubmitButton text="Gửi mã OTP" type="submit" disabled={!email} />
          </div>
        </Form>
      ) : (
        <Form onSubmit={handleVerifyOtp}>
          <FormGroup
            icon="fa-solid fa-key"
            label="Mã OTP"
            placeholder="Nhập mã OTP gồm 6 số"
            type="text"
            value={otp}
            setValue={setOtp}
            maxLength={6}
            required
          />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Button text="Quay lại" onClick={() => setStep(1)} />
            <SubmitButton
              text="Xác thực"
              type="submit"
              disabled={otp.length !== 6}
            />
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default VerifyAccountModal;
