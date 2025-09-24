// public/js/home.js
const token = localStorage.getItem('token');

if (!token) {
  window.location.href = '/login.html';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
});
document.getElementById('refreshBtn').addEventListener('click', fetchUsers);

const editModalEl = document.getElementById('editModal');
const editModal = new bootstrap.Modal(editModalEl);

document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlert();

  const id = document.getElementById('editUserId').value;
  const name = document.getElementById('editName').value.trim();
  const phone = document.getElementById('editPhone').value.trim();

  try {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ name, phone })
    });
    const data = await res.json();
    if (res.ok) {
      showAlert('success', data.message || 'Updated');
      editModal.hide();
      fetchUsers();
    } else {
      showAlert('danger', data.message || 'Update failed');
    }
  } catch (err) {
    showAlert('danger', 'Network error');
    console.error(err);
  }
});

async function fetchUsers() {
  clearAlert();
  try {
    const res = await fetch('/api/users', { headers: { 'Authorization': 'Bearer ' + token } });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
      } else {
        showAlert('danger', data.message || 'Could not fetch users');
      }
      return;
    }
    renderUsers(data.users || []);
  } catch (err) {
    showAlert('danger', 'Network error');
    console.error(err);
  }
}

function renderUsers(users) {
  const tbody = document.getElementById('usersBody');
  tbody.innerHTML = '';
  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center">No users found</td></tr>`;
    return;
  }
  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(u.name)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td>${escapeHtml(u.phone||'')}</td>
      <td>${escapeHtml(u.profession||'')}</td>
      <td>
        <button class="btn btn-sm btn-primary me-1" data-id="${u._id}" data-action="edit">Edit</button>
        <button class="btn btn-sm btn-danger" data-id="${u._id}" data-action="delete">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      if (action === 'edit') openEdit(id);
      if (action === 'delete') handleDelete(id);
    });
  });
}

async function openEdit(id) {
  clearAlert();
  // get specific user from the server list (or from displayed list). We'll fetch users and find it
  try {
    const res = await fetch('/api/users', { headers: { 'Authorization': 'Bearer ' + token }});
    const data = await res.json();
    if (!res.ok) { showAlert('danger', data.message || 'Fetch failed'); return; }
    const user = data.users.find(u => u._id === id);
    if (!user) { showAlert('danger', 'User not found'); return; }
    document.getElementById('editUserId').value = user._id;
    document.getElementById('editName').value = user.name || '';
    document.getElementById('editPhone').value = user.phone || '';
    editModal.show();
  } catch (err) {
    showAlert('danger', 'Network error');
    console.error(err);
  }
}

async function handleDelete(id) {
  clearAlert();
  if (!confirm('Are you sure you want to delete this user?')) return;
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    if (res.ok) {
      showAlert('success', data.message || 'Deleted');
      fetchUsers();
    } else {
      showAlert('danger', data.message || 'Delete failed');
    }
  } catch (err) {
    showAlert('danger', 'Network error');
    console.error(err);
  }
}

function showAlert(type, message) {
  const place = document.getElementById('alert-placeholder');
  place.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  </div>`;
  window.setTimeout(() => { place.innerHTML = ''; }, 5000);
}

function clearAlert() {
  document.getElementById('alert-placeholder').innerHTML = '';
}

// small helper to escape HTML
function escapeHtml(unsafe) {
  if (!unsafe && unsafe !== 0) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// initial load
fetchUsers();
