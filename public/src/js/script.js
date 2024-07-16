document.addEventListener('DOMContentLoaded', () => {
    const platillos = document.querySelectorAll('.platillo');
    platillos.forEach(platillo => {
        platillo.addEventListener('click', () => {
            const platilloId = platillo.getAttribute('data-id');
            window.location.href = `platillo.html?id=${platilloId}`;
        });
    });

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const correo = document.getElementById('correo').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('http://localhost:3000/API/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo, password })
                });

                if (!response.ok) {
                    document.getElementById('login-error').style.display = 'block';
                    return;
                }

                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('isAdmin', true);
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    const reservaForm = document.getElementById('reserva-form');
    if (reservaForm) {
        reservaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id_usuario = document.getElementById('id_usuario').value;
            const id_mesa = document.getElementById('id_mesa').value;
            const pago = document.getElementById('pago').value;
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('http://localhost:3000/API/reservaciones', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ id_usuario, id_mesa, pago })
                });

                if (!response.ok) {
                    document.getElementById('reserva-error').style.display = 'block';
                    return;
                }

                document.getElementById('reserva-error').style.display = 'none';
                document.getElementById('reserva-exito').style.display = 'block';
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('reserva-error').style.display = 'block';
            }
        });
    }

    // Mostrar secciones de administración si es admin
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
        const adminLinks = document.querySelectorAll('.admin');
        adminLinks.forEach(link => {
            link.style.display = 'inline';
        });
    }

    // Verificar si el usuario es admin en páginas de administración
    const adminPages = ['agregar-mesas.html', 'ver-mesas.html', 'agregar-meseros.html', 'ver-meseros.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (adminPages.includes(currentPage)) {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const token = localStorage.getItem('token');

        if (!isAdmin || !token) {
            alert('Acceso denegado. Debes ser administrador para ver esta página.');
            window.location.href = 'index.html';
        }
    }
});
