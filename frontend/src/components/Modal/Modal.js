import style from "./modal.module.css";
const Modal = ({
  modalTitle,
  closeModalHandler,

  children,
}) => {
  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <h3>{modalTitle}</h3>
        {children}
        <button className={style.closeBtn} onClick={closeModalHandler}>
          x
        </button>
      </div>
    </div>
  );
};

export default Modal;
