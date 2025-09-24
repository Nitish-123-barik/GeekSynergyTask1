// public/js/login.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlert();

  const payload = {
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value
  };

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      showAlert('success', 'Login successful. Redirecting to home...');
      setTimeout(() => window.location.href = '/home.html', 700);
    } else {
      showAlert('danger', data.message || 'Login failed');
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
