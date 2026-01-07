"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users, Characters
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"}
    return (response_body), 200


@api.route('/products', methods=['POST', 'GET'])
def products():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = 'Respuesta GET de /products'
        return response_body, 200
    if request.method == 'POST':
        response_body['message'] = 'Respuesta POST de /products'
        return response_body, 201
    return response_body, 404


@api.route('/users', methods=['POST', 'GET'])
def users():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = 'Listado de /users (GET)'
        # Se obtiene el registro de la tabla Users
        rows = db.session.execute(db.select(Users)).scalars()
        results = [row.serialize() for row in rows]
        response_body['results'] = results
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        print('data:', data)
        return response_body, 201
    return response_body, 404

@api.route('/users/<int:user_id>', methods=['GET','PUT','DELETE'])
def user(user_id):
    response_body = {}
    row = db.session.execute(db.select(Users).where(Users.id==user_id)).scalar()
    if not row:
        response_body['message'] = 'Usuario no encontrado'
        return response_body, 404
    if request.method == 'GET':
        print('info row:', row)
        response_body['results'] = row.serialize()
        response_body['message'] = f'Información de Ususario {user_id}'
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.first_name = data.get('first_name', row.first_name)
        row.last_name = data.get('last_name', row.last_name)
        row.email = data.get('email', row.email)
        row.password = data.get('password', row.password)
        row.is_active = data.get('is_active', row.is_active)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = f'Información de Ususario {user_id} editado'
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Se elimino el usuario {user_id}'
        return response_body, 200
    

# Para consumir los recursos de una API externa
@api.route('/characters', methods=['GET'])
def characters():
    response_body = {}
    url = 'https://swapi.info/api/people'
    response = requests.get(url) 
    if response.status_code == 200:
        data = response.json()
        for row in data:
            print(row['name'], row['mass'])
            row = Characters(name=row['name'],
                             height=row['height'],
                             mass=row['mass'],
                             hair_color=row['hair_color'],
                             skin_color=row['skin_color'],
                             eye_color=row['eye_color'],
                             birth_year=row['birth_year'])
            db.session.add(row)
            db.session.commit()
            response_body['message'] = 'Personajes agregados con exito dsde la API externa.'   
            response_body['results'] = data
            return response_body, 200
        return response_body, 400   


    
