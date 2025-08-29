document.addEventListener("DOMContentLoaded", () => {
  // Modal handling code (existing)
  const categoryModal = document.getElementById("category-modal");
  const addCategoryBtn = document.getElementById("add-category-btn");
  const closeCategoryModalBtn = document.getElementById(
    "close-category-modal-btn"
  );
  const closeCategoryEditModalBtn = document.getElementById(
    "close-category-edit-modal-btn"
  );
  const cancelCategoryBtn = document.getElementById("cancel-category-btn");

  const iconModal = document.getElementById("icon-modal");
  const addIconBtn = document.getElementById("add-icon-btn");
  const closeIconModalBtn = document.getElementById("close-icon-modal-btn");
  const cancelIconBtn = document.getElementById("cancel-icon-btn");

  // Modal functions
  const openCategoryModal = () => {
    if (categoryModal) categoryModal.style.display = "grid";
  };
  const closeCategoryModal = () => {
    if (categoryModal) categoryModal.style.display = "none";
  };

  if (addCategoryBtn)
    addCategoryBtn.addEventListener("click", openCategoryModal);
  if (closeCategoryModalBtn)
    closeCategoryModalBtn.addEventListener("click", closeCategoryModal);
  if (closeCategoryEditModalBtn) {
    closeCategoryEditModalBtn.addEventListener("click", () => {
      history.back();
    });
  }
  if (cancelCategoryBtn)
    cancelCategoryBtn.addEventListener("click", closeCategoryModal);

  if (categoryModal) {
    categoryModal.addEventListener("click", (e) => {
      if (e.target === categoryModal) {
        closeCategoryModal();
      }
    });
  }

  const openIconModal = () => {
    if (iconModal) iconModal.style.display = "grid";
  };
  const closeIconModal = () => {
    if (iconModal) iconModal.style.display = "none";
  };

  if (addIconBtn) addIconBtn.addEventListener("click", openIconModal);
  if (closeIconModalBtn)
    closeIconModalBtn.addEventListener("click", closeIconModal);
  if (cancelIconBtn) cancelIconBtn.addEventListener("click", closeIconModal);

  if (iconModal) {
    iconModal.addEventListener("click", (e) => {
      if (e.target === iconModal) {
        closeIconModal();
      }
    });
  }

  // Pagination button loading states
  document.querySelectorAll(".pagination-btn").forEach((link) => {
    link.addEventListener("click", () => {
      const isNext = link.classList.contains("next-btn");
      const isPrev = link.classList.contains("prev-btn");

      // Show loading state
      const originalHTML = link.innerHTML;

      if (isNext) {
        link.innerHTML =
          '<i class="fa-solid fa-spinner fa-spin"></i> Đang tải...';
      } else if (isPrev) {
        link.innerHTML =
          '<i class="fa-solid fa-spinner fa-spin"></i> Đang tải...';
      }

      link.style.pointerEvents = "none";
      link.style.opacity = "0.7";

      // Browser sẽ navigate tự động
    });
  });

  // Icon selection
  document.querySelectorAll(".icon-option").forEach((option) => {
    option.addEventListener("click", (e) => {
      document
        .querySelectorAll(".icon-option")
        .forEach((o) => o.classList.remove("selected"));
      option.classList.add("selected");
      document.getElementById("category-icon-input").value =
        option.getAttribute("data-icon-id");
    });
  });

  // Delete handlers
  document.querySelectorAll(".remove-icon").forEach((removeBtn) => {
    removeBtn.addEventListener("click", (e) => {
      const iconId = e.target
        .closest(".remove-icon")
        .getAttribute("data-icon-id");
      callApiDelete(iconId, `${window.location.origin}/fin-flow/api/icons`);
    });
  });

  document.querySelectorAll(".delete").forEach((removeBtn) => {
    removeBtn.addEventListener("click", (e) => {
      const categoryId = e.target
        .closest(".delete")
        .getAttribute("data-category-id");
      callApiDelete(
        categoryId,
        `${window.location.origin}/fin-flow/api/categories`
      );
    });
  });

  // Smooth scroll to top khi có pagination params trong URL
  if (window.location.search.includes("Page=")) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

const callApiDelete = (id, url) => {
  fetch(`${url}/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      if (data.code === 204) {
        window.location.reload();
      }
    });
};
