import os
from datetime import datetime
import random

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash

# Configurar Flask com pasta de arquivos estáticos do React
app = Flask(__name__, 
    static_folder=os.path.join(os.path.dirname(__file__), '..', 'frontend', 'build'),
    static_url_path='/'
)
CORS(app)

# Configuração para Render
app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
port = int(os.environ.get('PORT', 5000))

admin_user = {
    'id': 0,
    'nome': 'Administrador',
    'email': 'admin@gmail.com',
    'senha': generate_password_hash('1234'),
    'data_criacao': datetime.now().isoformat(),
    'is_admin': True,
}

users_db = [admin_user]
MIN_PASSWORD_LENGTH = 4


def password_has_whitespace(password):
    return any(char.isspace() for char in password)


def password_is_too_short(password):
    return len(password) < MIN_PASSWORD_LENGTH


def generate_user_id():
    existing_ids = {user['id'] for user in users_db}
    while True:
        user_id = random.randint(1000000, 9999999)
        if user_id not in existing_ids:
            return user_id


def is_main_admin(user):
    return user['id'] == admin_user['id']


def is_admin_user(user):
    return user.get('is_admin', False)


@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('senha') or not data.get('nome'):
        return jsonify({'erro': 'Email, senha e nome sao obrigatorios'}), 400

    if password_has_whitespace(data['senha']):
        return jsonify({'erro': 'A senha nao pode conter espacos em branco'}), 400

    if password_is_too_short(data['senha']):
        return jsonify({'erro': f'A senha deve ter pelo menos {MIN_PASSWORD_LENGTH} caracteres'}), 400

    if data['email'] == 'admin@gmail.com':
        return jsonify({'erro': 'Este email e reservado para o administrador'}), 409

    if any(user['email'] == data['email'] for user in users_db):
        return jsonify({'erro': 'Email ja cadastrado'}), 409

    novo_usuario = {
        'id': generate_user_id(),
        'nome': data['nome'],
        'email': data['email'],
        'senha': generate_password_hash(data['senha']),
        'data_criacao': datetime.now().isoformat(),
    }
    users_db.append(novo_usuario)

    return jsonify({
        'mensagem': 'Usuario registrado com sucesso',
        'usuario': {
            'id': novo_usuario['id'],
            'nome': novo_usuario['nome'],
            'email': novo_usuario['email'],
        },
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('senha'):
        return jsonify({'erro': 'Email e senha sao obrigatorios'}), 400

    if password_has_whitespace(data['senha']):
        return jsonify({'erro': 'A senha nao pode conter espacos em branco'}), 400

    if password_is_too_short(data['senha']):
        return jsonify({'erro': f'A senha deve ter pelo menos {MIN_PASSWORD_LENGTH} caracteres'}), 400

    usuario = next((user for user in users_db if user['email'] == data['email']), None)
    if not usuario or not check_password_hash(usuario['senha'], data['senha']):
        return jsonify({'erro': 'Email ou senha invalidos'}), 401

    return jsonify({
        'mensagem': 'Login realizado com sucesso',
        'usuario': {
            'id': usuario['id'],
            'nome': usuario['nome'],
            'email': usuario['email'],
            'is_admin': usuario.get('is_admin', False),
        },
    }), 200


@app.route('/api/usuarios', methods=['GET'])
def get_usuarios():
    user_email = request.headers.get('X-User-Email')
    if not user_email:
        return jsonify({'erro': 'Autenticacao necessaria'}), 401

    user = next((item for item in users_db if item['email'] == user_email), None)
    if not user:
        return jsonify({'erro': 'Usuario nao encontrado'}), 404

    if not user.get('is_admin', False):
        usuarios_publicos = [{
            'id': user['id'],
            'nome': user['nome'],
            'email': user['email'],
            'data_criacao': user['data_criacao'],
        }]
    else:
        usuarios_publicos = [{
            'id': item['id'],
            'nome': item['nome'],
            'email': item['email'],
            'data_criacao': item['data_criacao'],
            'is_admin': item.get('is_admin', False),
        } for item in users_db]

    return jsonify(usuarios_publicos), 200


@app.route('/api/estatisticas', methods=['GET'])
def get_estatisticas():
    return jsonify({
        'usuarios_por_dia': [
            {'dia': 'Segunda', 'quantidade': 5},
            {'dia': 'Terca', 'quantidade': 8},
            {'dia': 'Quarta', 'quantidade': 12},
            {'dia': 'Quinta', 'quantidade': 7},
            {'dia': 'Sexta', 'quantidade': 15},
            {'dia': 'Sabado', 'quantidade': 10},
            {'dia': 'Domingo', 'quantidade': 9},
        ],
        'total_usuarios': len(users_db),
        'novos_usuarios_semana': 66,
    }), 200


@app.route('/api/usuarios/<int:user_id>', methods=['PUT'])
def update_usuario(user_id):
    user_email = request.headers.get('X-User-Email')
    if not user_email:
        return jsonify({'erro': 'Autenticacao necessaria'}), 401

    current_user = next((user for user in users_db if user['email'] == user_email), None)
    if not current_user:
        return jsonify({'erro': 'Usuario nao encontrado'}), 404

    usuario = next((user for user in users_db if user['id'] == user_id), None)
    if not usuario:
        return jsonify({'erro': 'Usuario nao encontrado'}), 404

    if not current_user.get('is_admin', False) and current_user['id'] != user_id:
        return jsonify({'erro': 'Acesso negado'}), 403

    if (
        is_admin_user(current_user)
        and current_user['id'] != user_id
        and is_admin_user(usuario)
        and not is_main_admin(current_user)
    ):
        return jsonify({'erro': 'Apenas o administrador principal pode editar outros administradores'}), 403

    data = request.get_json()
    if not is_admin_user(current_user):
        if 'nome' in data:
            if not data['nome'].strip():
                return jsonify({'erro': 'Nome invalido'}), 400
            usuario['nome'] = data['nome']
        if 'email' in data:
            if any(item['email'] == data['email'] and item['id'] != user_id for item in users_db):
                return jsonify({'erro': 'Email ja esta em uso'}), 409
            if data['email'] == 'admin@gmail.com' and usuario['id'] != admin_user['id']:
                return jsonify({'erro': 'Este email e reservado para o administrador'}), 409
            usuario['email'] = data['email']
        if 'senha' in data:
            if password_has_whitespace(data['senha']):
                return jsonify({'erro': 'A senha nao pode conter espacos em branco'}), 400
            if password_is_too_short(data['senha']):
                return jsonify({'erro': f'A senha deve ter pelo menos {MIN_PASSWORD_LENGTH} caracteres'}), 400
            usuario['senha'] = generate_password_hash(data['senha'])
    else:
        if 'nome' in data:
            usuario['nome'] = data['nome']
        if 'email' in data:
            if any(item['email'] == data['email'] and item['id'] != user_id for item in users_db):
                return jsonify({'erro': 'Email ja esta em uso'}), 409
            usuario['email'] = data['email']
        if 'is_admin' in data and isinstance(data['is_admin'], bool):
            usuario['is_admin'] = data['is_admin']

    return jsonify({
        'mensagem': 'Usuario atualizado com sucesso',
        'usuario': {
            'id': usuario['id'],
            'nome': usuario['nome'],
            'email': usuario['email'],
            'is_admin': usuario.get('is_admin', False),
        },
    }), 200


@app.route('/api/usuarios/<int:user_id>', methods=['DELETE'])
def delete_usuario(user_id):
    global users_db

    user_email = request.headers.get('X-User-Email')
    if not user_email:
        return jsonify({'erro': 'Autenticacao necessaria'}), 401

    current_user = next((user for user in users_db if user['email'] == user_email), None)
    if not current_user:
        return jsonify({'erro': 'Usuario nao encontrado'}), 404

    if not is_admin_user(current_user):
        return jsonify({'erro': 'Apenas administradores podem deletar usuarios'}), 403

    usuario = next((user for user in users_db if user['id'] == user_id), None)
    if not usuario:
        return jsonify({'erro': 'Usuario nao encontrado'}), 404

    if is_main_admin(usuario):
        return jsonify({'erro': 'Nao e possivel deletar o administrador principal'}), 403

    if is_admin_user(usuario) and not is_main_admin(current_user):
        return jsonify({'erro': 'Apenas o administrador principal pode excluir outros administradores'}), 403

    users_db[:] = [user for user in users_db if user['id'] != user_id]
    return jsonify({'mensagem': 'Usuario deletado com sucesso'}), 200


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200


# Servir React para todas as rotas que não são API
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
