from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class Users(db.Model):
    __tablename__="users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    first_name = db.Column(db.String(120), unique=False, nullable=False)
    last_name = db.Column(db.String(120), unique=False, nullable=False)

    def __repr__(self):
        return f'<User: {self.id} - {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active,
            "first_name": self.first_name,
            "last_name": self.last_name
            # do not serialize the password, its a security breach
        }
    
class Characters(db.Model):
    __tablename__="characters"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    height = db.Column(db.String(120), unique=False, nullable=False)
    mass = db.Column(db.String(120), unique=False, nullable=False)
    hair_color = db.Column(db.String(120), unique=False, nullable=False)
    skin_color = db.Column(db.String(120), unique=False, nullable=False)
    eye_color = db.Column(db.String(120), unique=False, nullable=False)
    birth_year = db.Column(db.String(120), unique=False, nullable=False)

    def __repr__(self):
        return f'<Character: {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
           "name": self.name,
            "height": self.height,
            "mass": self.mass,
            "hair_color": self.hair_color,
            "skin_color": self.skin_color,
            "eye_color": self.eye_color,
            "birth_year": self.birth_year
        }
    
class Planets(db.Model):
    __tablename__="planets"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    diameter = db.Column(db.String(120), unique=False, nullable=False)
    rotation_period = db.Column(db.String(120), unique=False, nullable=False)
    orbital_period = db.Column(db.String(120), unique=False, nullable=False)
    gravity = db.Column(db.String(120), unique=False, nullable=False)
    population = db.Column(db.String(120), unique=False, nullable=False)
    climate = db.Column(db.String(120), unique=False, nullable=False)
    terrain = db.Column(db.String(120), unique=False, nullable=False)

    def __repr__(self):
        return f'<Planet: {self.id}>'

    def serialize(self):
        return{
            "id": self.id,
            "name": self.name,
            "diameter": self.diameter,
            "rotation_period": self.rotation_period,
            "orbital_period": self.orbital_period,
            "gravity": self.gravity,
            "population": self.population,
            "climate": self.climate,
            "terrain": self.terrain
        }
    
class CharacterFavorites(db.Model):
    __tablename__="character_favorites"
    id = db.Column(db.Integer, primary_key=True)

    # Relacion con User
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id],
                               backref=db.backref('character_to', lazy='select'))
    #Relacion con Characters
    character_id = db.Column(db.Integer, db.ForeignKey('characters.id'))
    character_to = db.relationship('Characters', foreign_keys=[character_id],
                                    backref=db.backref('characters_to', lazy='select'))

    def __repr__(self):
        return f'<Character Favorite: {self.id}>'
    
    def serialize(self):
        return{
            "id": self.id
        }
    
class PlanetFavorites(db.Model):
    __tablename__="planet_favorites"
    id = db.Column(db.Integer, primary_key=True)

    #Relacion con User
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id],
                              backref=db.backref('planet_favorite_to', lazy='select'))
    #Relacion con Planets
    planet_id = db.Column(db.Integer, db.ForeignKey('planets.id'))
    planet_to = db.relationship('Planets', foreign_keys=[planet_id],
                                backref=db.backref('planet_favorite_to', lazy='select'))
    def __repr__(self):
        return f'<Planet Favorite: {self.id}>'
    
    def serialize(self):
        return{
            "id": self.id
        }

class Followers(db.Model):
    __tablename__="followers"
    id = db.Column(db.Integer, primary_key=True)

    # Relacion con Users (following)
    following_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    following_to = db.relationship('Users', foreign_keys=[following_id],
                                   backref=db.backref('following_to', lazy='select'))
    # Relacion con Users (follower)
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    follower_to = db.relationship('Users', foreign_keys=[follower_id],
                                  backref=db.backref('follower_to', lazy='select'))

    def __repr__(self):
        return f'<Follower: {self.id}>'
    
    def serialize(self):
        return{
            "id": self.id
        }

class Posts(db.Model):
    __tablename__="posts"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=False, nullable=False)
    description = db.Column(db.String(120), unique=False, nullable=False)
    body = db.Column(db.String(600), unique=False, nullable=False)
    date = db.Column(db.String(120), unique=False, nullable=False)
    image_url = db.Column(db.String(600), unique=False, nullable=False)

    # Relacion con Users
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id],
                              backref=db.backref('post_to', lazy='select'))
    
    def __repr__(self):
        return f'<Post: {self.id}>'
    
    def serialize(self):
        return{
            "id": self.id
        }

class Comments(db.Model):
    __tablename__="comments"
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(600), unique=False, nullable=False)

    # Relacion con Users 
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id],
                              backref=db.backref('comment_to', lazy='select'))
    # Relacion con Post
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    post_to = db.relationship('Posts', foreign_keys=[post_id],
                              backref=db.backref('posts_to', lazy='select'))

    def __repr__(self):
        return f'<Comment: {self.id}>'
    
    def serialize(self):
        return{
            "id": self.id
        }

class Medias(db.Model):
    __tablename__="medias"
    id = db.Column(db.Integer, primary_key=True)
    #type = #Preguntar OJO
    url = db.Column(db.String(600), unique=False, nullable=False)

    # Relacion con Posts
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    post_to = db.relationship('Posts', foreign_keys=[post_id],
                              backref=db.backref('post_to', lazy='select'))

    def __repr__(self):
        return f'<Media: {self.id}>'
    
    def serialize(self):
        return{
            "id":self.id
        }