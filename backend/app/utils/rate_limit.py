from slowapi import Limiter
from slowapi.util import get_remote_address

# Limiter compartilhado entre os routers. Protege endpoints sensíveis
# (como /auth/login) contra força bruta sem exigir nenhum serviço externo
# (usa memória local por padrão - suficiente para um único processo).
limiter = Limiter(key_func=get_remote_address)
