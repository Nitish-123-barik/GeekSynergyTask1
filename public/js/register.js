document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlert();

  const payload = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value,
    phone: document.getElementById('phone').value.trim(),
    profession: document.getElementById('profession').value.trim()
  };

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      showAlert('success', data.message || 'Registered successfully. Redirecting to login...');
      setTimeout(() => window.location.href = '/login.html', 1200);
    } else {
      showAlert('danger', data.message || 'Registration failed');
    }
  } catch (err) {
    showAlert('danger', 'Network error');
    console.error(err);
  }
});

function showAlert(type, message) {
  const place = document.getElementById('alert-placeholder');
  place.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  </div>`;
}

function clearAlert() {
  document.getElementById('alert-placeholder').innerHTML = '';
}
