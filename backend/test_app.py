import unittest
from app import app, users_db, admin_user, generate_password_hash


class TestAuth(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()
        # Reset users_db to only admin before each test
        users_db.clear()
        admin_user['senha'] = generate_password_hash('1234')
        users_db.append(admin_user)

    # ---------- REGISTER ----------

    def test_register_sucesso(self):
        r = self.client.post('/api/auth/register', json={
            'nome': 'Teste', 'email': 'teste@gmail.com', 'senha': 'abcd'
        })
        self.assertEqual(r.status_code, 201)
        self.assertIn('usuario', r.get_json())

    def test_register_sem_nome(self):
        r = self.client.post('/api/auth/register', json={
            'email': 'teste@gmail.com', 'senha': 'abcd'
        })
        self.assertEqual(r.status_code, 400)

    def test_register_sem_email(self):
        r = self.client.post('/api/auth/register', json={
            'nome': 'Teste', 'senha': 'abcd'
        })
        self.assertEqual(r.status_code, 400)

    def test_register_sem_senha(self):
        r = self.client.post('/api/auth/register', json={
            'nome': 'Teste', 'email': 'teste@gmail.com'
        })
        self.assertEqual(r.status_code, 400)

    def test_register_email_duplicado(self):
        self.client.post('/api/auth/register', json={
            'nome': 'Teste', 'email': 'dup@gmail.com', 'senha': 'abcd'
        })
        r = self.client.post('/api/auth/register', json={
            'nome': 'Teste2', 'email': 'dup@gmail.com', 'senha': 'abcd'
        })
        self.assertEqual(r.status_code, 409)

    def test_register_email_admin_reservado(self):
        r = self.client.post('/api/auth/register', json={
            'nome': 'Hacker', 'email': 'admin@gmail.com', 'senha': 'abcd'
        })
        self.assertEqual(r.status_code, 409)

    def test_register_senha_curta(self):
        r = self.client.post('/api/auth/register', json={
            'nome': 'Teste', 'email': 'teste@gmail.com', 'senha': 'abc'
        })
        self.assertEqual(r.status_code, 400)

    def test_register_senha_com_espaco(self):
        r = self.client.post('/api/auth/register', json={
            'nome': 'Teste', 'email': 'teste@gmail.com', 'senha': 'ab cd'
        })
        self.assertEqual(r.status_code, 400)

    def test_register_body_vazio(self):
        r = self.client.post('/api/auth/register', json={})
        self.assertEqual(r.status_code, 400)

    # ---------- LOGIN ----------

    def test_login_admin_sucesso(self):
        r = self.client.post('/api/auth/login', json={
            'email': 'admin@gmail.com', 'senha': '1234'
        })
        self.assertEqual(r.status_code, 200)
        data = r.get_json()
        self.assertTrue(data['usuario']['is_admin'])

    def test_login_usuario_registrado(self):
        self.client.post('/api/auth/register', json={
            'nome': 'User', 'email': 'user@gmail.com', 'senha': 'pass'
        })
        r = self.client.post('/api/auth/login', json={
            'email': 'user@gmail.com', 'senha': 'pass'
        })
        self.assertEqual(r.status_code, 200)

    def test_login_senha_errada(self):
        r = self.client.post('/api/auth/login', json={
            'email': 'admin@gmail.com', 'senha': 'errada'
        })
        self.assertEqual(r.status_code, 401)

    def test_login_email_inexistente(self):
        r = self.client.post('/api/auth/login', json={
            'email': 'nao@existe.com', 'senha': '1234'
        })
        self.assertEqual(r.status_code, 401)

    def test_login_sem_email(self):
        r = self.client.post('/api/auth/login', json={'senha': '1234'})
        self.assertEqual(r.status_code, 400)

    def test_login_sem_senha(self):
        r = self.client.post('/api/auth/login', json={'email': 'admin@gmail.com'})
        self.assertEqual(r.status_code, 400)

    def test_login_senha_com_espaco(self):
        r = self.client.post('/api/auth/login', json={
            'email': 'admin@gmail.com', 'senha': '12 34'
        })
        self.assertEqual(r.status_code, 400)

    def test_login_body_vazio(self):
        r = self.client.post('/api/auth/login', json={})
        self.assertEqual(r.status_code, 400)

    # ---------- GET USUARIOS ----------

    def test_get_usuarios_sem_auth(self):
        r = self.client.get('/api/usuarios')
        self.assertEqual(r.status_code, 401)

    def test_get_usuarios_admin_ve_todos(self):
        self.client.post('/api/auth/register', json={
            'nome': 'User', 'email': 'user@gmail.com', 'senha': 'pass'
        })
        r = self.client.get('/api/usuarios', headers={'X-User-Email': 'admin@gmail.com'})
        self.assertEqual(r.status_code, 200)
        self.assertGreater(len(r.get_json()), 1)

    def test_get_usuarios_usuario_ve_apenas_si(self):
        self.client.post('/api/auth/register', json={
            'nome': 'User', 'email': 'user@gmail.com', 'senha': 'pass'
        })
        r = self.client.get('/api/usuarios', headers={'X-User-Email': 'user@gmail.com'})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.get_json()), 1)

    # ---------- UPDATE USUARIO ----------

    def test_update_proprio_perfil(self):
        self.client.post('/api/auth/register', json={
            'nome': 'User', 'email': 'user@gmail.com', 'senha': 'pass'
        })
        user_id = next(u['id'] for u in users_db if u['email'] == 'user@gmail.com')
        r = self.client.put(f'/api/usuarios/{user_id}', json={'nome': 'Novo Nome'},
                            headers={'X-User-Email': 'user@gmail.com'})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.get_json()['usuario']['nome'], 'Novo Nome')

    def test_update_outro_usuario_sem_ser_admin(self):
        self.client.post('/api/auth/register', json={
            'nome': 'A', 'email': 'a@gmail.com', 'senha': 'pass'
        })
        self.client.post('/api/auth/register', json={
            'nome': 'B', 'email': 'b@gmail.com', 'senha': 'pass'
        })
        user_b_id = next(u['id'] for u in users_db if u['email'] == 'b@gmail.com')
        r = self.client.put(f'/api/usuarios/{user_b_id}', json={'nome': 'Hack'},
                            headers={'X-User-Email': 'a@gmail.com'})
        self.assertEqual(r.status_code, 403)

    def test_update_usuario_inexistente(self):
        r = self.client.put('/api/usuarios/9999999', json={'nome': 'X'},
                            headers={'X-User-Email': 'admin@gmail.com'})
        self.assertEqual(r.status_code, 404)

    def test_update_email_duplicado(self):
        self.client.post('/api/auth/register', json={
            'nome': 'A', 'email': 'a@gmail.com', 'senha': 'pass'
        })
        self.client.post('/api/auth/register', json={
            'nome': 'B', 'email': 'b@gmail.com', 'senha': 'pass'
        })
        user_a_id = next(u['id'] for u in users_db if u['email'] == 'a@gmail.com')
        r = self.client.put(f'/api/usuarios/{user_a_id}', json={'email': 'b@gmail.com'},
                            headers={'X-User-Email': 'a@gmail.com'})
        self.assertEqual(r.status_code, 409)

    # ---------- DELETE USUARIO ----------

    def test_delete_usuario_admin(self):
        self.client.post('/api/auth/register', json={
            'nome': 'User', 'email': 'user@gmail.com', 'senha': 'pass'
        })
        user_id = next(u['id'] for u in users_db if u['email'] == 'user@gmail.com')
        r = self.client.delete(f'/api/usuarios/{user_id}',
                               headers={'X-User-Email': 'admin@gmail.com'})
        self.assertEqual(r.status_code, 200)

    def test_delete_usuario_sem_ser_admin(self):
        self.client.post('/api/auth/register', json={
            'nome': 'User', 'email': 'user@gmail.com', 'senha': 'pass'
        })
        user_id = next(u['id'] for u in users_db if u['email'] == 'user@gmail.com')
        r = self.client.delete(f'/api/usuarios/{user_id}',
                               headers={'X-User-Email': 'user@gmail.com'})
        self.assertEqual(r.status_code, 403)

    def test_delete_admin_principal_bloqueado(self):
        r = self.client.delete('/api/usuarios/0',
                               headers={'X-User-Email': 'admin@gmail.com'})
        self.assertIn(r.status_code, [403, 404])

    def test_delete_usuario_inexistente(self):
        r = self.client.delete('/api/usuarios/9999999',
                               headers={'X-User-Email': 'admin@gmail.com'})
        self.assertEqual(r.status_code, 404)

    # ---------- HEALTH ----------

    def test_health(self):
        r = self.client.get('/api/health')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.get_json()['status'], 'ok')

    # ---------- ESTATISTICAS ----------

    def test_estatisticas(self):
        r = self.client.get('/api/estatisticas')
        self.assertEqual(r.status_code, 200)
        data = r.get_json()
        self.assertIn('total_usuarios', data)
        self.assertIn('usuarios_por_dia', data)


if __name__ == '__main__':
    unittest.main(verbosity=2)
