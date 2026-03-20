from datetime import datetime
import random

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
CORS(app)

admin_user = {
    'id': 0,
    'nome': 'Administrador',
    'email': 'admin@gmail.com',
    'senha': generate_password_hash('1234'),
    'data_criacao': datetime.now().isoformat(),
    'is_admin': True,
}

users_db = [admin_user]


def generate_user_id():
    existing_ids = {user['id'] for user in users_db}
    while True:
        user_id = random.randint(1000000, 9999999)
        if user_id not in existing_ids:
            return user_id


def is_main_admin(user):
    return user['id'] == admin_user['id']


@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('senha') or not data.get('nome'):
        return jsonify({'erro': 'Email, senha e nome sao obrigatorios'}), 400

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

    if current_user.get('is_admin', False) and is_main_admin(usuario) and current_user['id'] != admin_user['id']:
        return jsonify({'erro': 'O administrador principal nao pode ser editado por outro administrador'}), 403

    data = request.get_json()
    if not current_user.get('is_admin', False):
        if 'nome' in data and data['nome'].strip():
            usuario['nome'] = data['nome']
        else:
            return jsonify({'erro': 'Apenas o nome pode ser alterado'}), 400
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

    if not current_user.get('is_admin', False):
        return jsonify({'erro': 'Apenas administradores podem deletar usuarios'}), 403

    usuario = next((user for user in users_db if user['id'] == user_id), None)
    if not usuario:
        return jsonify({'erro': 'Usuario nao encontrado'}), 404

    if usuario['id'] == admin_user['id']:
        return jsonify({'erro': 'Nao e possivel deletar o administrador principal'}), 403

    users_db = [user for user in users_db if user['id'] != user_id]
    return jsonify({'mensagem': 'Usuario deletado com sucesso'}), 200


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
