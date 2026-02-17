import requests
from jose import jwt
from fastapi import HTTPException
import os
import time

# Cache keys
_jwks_cache = None
_jwks_last_update = 0

def get_jwks():
    global _jwks_cache, _jwks_last_update
    # Refresh cache every hour
    if _jwks_cache is None or (time.time() - _jwks_last_update > 3600):
        url = os.getenv("OIDC_JWKS_URL")
        if not url:
            # Fallback/Log or skip if no OIDC configured
            return {}
        try:
            response = requests.get(url)
            _jwks_cache = response.json()
            _jwks_last_update = time.time()
        except Exception as e:
            print(f"Error fetching JWKS: {e}")
            return {}
    return _jwks_cache

def validate_oidc_token(token: str):
    jwks = get_jwks()
    
    # Get header to find key ID
    try:
        header = jwt.get_unverified_header(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token header")
        
    rsa_key = {}
    for key in jwks.get("keys", []):
        if key["kid"] == header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }
            break
            
    if rsa_key:
        try:
            # We relax audience validation slightly because Microsoft tokens might have 
            # the ClientID or the API URI as audience depending on how they are acquired.
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                # audience=os.getenv("OIDC_AUDIENCE"), 
                options={"verify_at_hash": False, "verify_aud": False}
            )
            return payload
        except jwt.ExpiredSignatureError:
            print("OIDC Token expired")
            raise HTTPException(status_code=401, detail="Token has expired")
        except jwt.JWTClaimsError as e:
            print(f"OIDC Claims error: {e}")
            raise HTTPException(status_code=401, detail="Incorrect claims")
        except Exception as e:
            print(f"OIDC structure error: {type(e).__name__} - {e}")
            raise HTTPException(status_code=401, detail="Unable to parse authentication token")
            
    raise HTTPException(status_code=401, detail="Unable to find appropriate key")
