const adminKeyInput = document.getElementById("admin-key");
const adminLoadBtn = document.getElementById("admin-load");
const adminStatus = document.getElementById("admin-status");
const adminPending = document.getElementById("admin-pending");

if (adminLoadBtn) {
  adminLoadBtn.addEventListener("click", () => {
    loadPending();
  });
}

async function loadPending() {
  if (!adminStatus || !adminKeyInput || !adminPending) return;
  const key = adminKeyInput.value.trim();
  if (!key) {
    adminStatus.textContent = "Введи админ-ключ.";
    return;
  }

  adminStatus.textContent = "Загружаю заявки...";
  adminPending.innerHTML = "";

  try {
    const res = await fetch(`/api/admin/pending?key=${encodeURIComponent(key)}`);
    if (!res.ok) throw new Error("load failed");
    const data = await res.json();
    const list = Array.isArray(data.pending) ? data.pending : [];

    if (list.length === 0) {
      adminPending.innerHTML = "<p>Пока нет заявок.</p>";
    } else {
      adminPending.innerHTML = list
        .map(item => {
          const tags = (item.tags || []).join(", ");
          return `
            <div class="admin-card" data-id="${item.id}">
              <p><strong>${item.title}</strong></p>
              <p class="admin-small">Теги: ${tags || "—"}</p>
              <p class="admin-small">Файл: ${item.originalFilename}</p>
              <button type="button" class="submit-button admin-approve">Одобрить</button>
              <button type="button" class="submit-button admin-reject">Отклонить</button>
            </div>
          `;
        })
        .join("");

      adminPending.querySelectorAll(".admin-approve").forEach(btn => {
        btn.addEventListener("click", () => handleAction(btn, "approve"));
      });
      adminPending.querySelectorAll(".admin-reject").forEach(btn => {
        btn.addEventListener("click", () => handleAction(btn, "reject"));
      });
    }

    adminStatus.textContent = "";
  } catch {
    adminStatus.textContent = "Не удалось загрузить заявки. Сервер не запущен или неверный ключ.";
  }
}

async function handleAction(button, action) {
  if (!adminKeyInput || !adminStatus) return;
  const card = button.closest(".admin-card");
  if (!card) return;
  const id = card.getAttribute("data-id");
  if (!id) return;

  const key = adminKeyInput.value.trim();
  if (!key) return;

  const url =
    action === "approve"
      ? `/api/admin/approve/${encodeURIComponent(id)}?key=${encodeURIComponent(key)}`
      : `/api/admin/reject/${encodeURIComponent(id)}?key=${encodeURIComponent(key)}`;

  button.disabled = true;
  adminStatus.textContent = action === "approve" ? "Одобряю..." : "Отклоняю...";

  try {
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) throw new Error("action failed");
    card.remove();
    adminStatus.textContent = "Готово.";
  } catch {
    adminStatus.textContent = "Не удалось выполнить действие.";
    button.disabled = false;
  }
}


const adminKeyInput = document.getElementById("admin-key");
const adminLoadBtn = document.getElementById("admin-load");
const adminStatus = document.getElementById("admin-status");
const adminPending = document.getElementById("admin-pending");

if (adminLoadBtn) {
  adminLoadBtn.addEventListener("click", () => {
    loadPending();
  });
}

async function loadPending() {
  if (!adminStatus || !adminKeyInput || !adminPending) return;
  const key = adminKeyInput.value.trim();
  if (!key) {
    adminStatus.textContent = "Введи админ-ключ.";
    return;
  }

  adminStatus.textContent = "Загружаю заявки...";
  adminPending.innerHTML = "";

  try {
    const res = await fetch(`/api/admin/pending?key=${encodeURIComponent(key)}`);
    if (!res.ok) throw new Error("load failed");
    const data = await res.json();
    const list = Array.isArray(data.pending) ? data.pending : [];

    if (list.length === 0) {
      adminPending.innerHTML = "<p>Пока нет заявок.</p>";
    } else {
      adminPending.innerHTML = list
        .map(item => {
          const tags = (item.tags || []).join(", ");
          return `
            <div class="admin-card" data-id="${item.id}">
              <p><strong>${item.title}</strong></p>
              <p class="admin-small">Теги: ${tags || "—"}</p>
              <p class="admin-small">Файл: ${item.originalFilename}</p>
              <button type="button" class="submit-button admin-approve">Одобрить</button>
              <button type="button" class="submit-button admin-reject">Отклонить</button>
            </div>
          `;
        })
        .join("");

      adminPending.querySelectorAll(".admin-approve").forEach(btn => {
        btn.addEventListener("click", () => handleAction(btn, "approve"));
      });
      adminPending.querySelectorAll(".admin-reject").forEach(btn => {
        btn.addEventListener("click", () => handleAction(btn, "reject"));
      });
    }

    adminStatus.textContent = "";
  } catch {
    adminStatus.textContent = "Не удалось загрузить заявки. Сервер не запущен или неверный ключ.";
  }
}

async function handleAction(button, action) {
  if (!adminKeyInput || !adminStatus) return;
  const card = button.closest(".admin-card");
  if (!card) return;
  const id = card.getAttribute("data-id");
  if (!id) return;

  const key = adminKeyInput.value.trim();
  if (!key) return;

  const url =
    action === "approve"
      ? `/api/admin/approve/${encodeURIComponent(id)}?key=${encodeURIComponent(key)}`
      : `/api/admin/reject/${encodeURIComponent(id)}?key=${encodeURIComponent(key)}`;

  button.disabled = true;
  adminStatus.textContent = action === "approve" ? "Одобряю..." : "Отклоняю...";

  try {
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) throw new Error("action failed");
    card.remove();
    adminStatus.textContent = "Готово.";
  } catch {
    adminStatus.textContent = "Не удалось выполнить действие.";
    button.disabled = false;
  }
}

