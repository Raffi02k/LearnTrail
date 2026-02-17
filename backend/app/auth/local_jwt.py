from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt
import os

# fallback to ENV or default
SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret_key_change_this_for_production_1234567890")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

def create_access_token(subject: Union[str, Any], roles: list = None) -> str:
    if roles is None:
        roles = ["user"]
        
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": str(subject), "roles": roles, "type": "local", "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
